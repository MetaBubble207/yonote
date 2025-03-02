import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, eq, gte, lte, like, sql, desc, count } from "drizzle-orm";
import { referrals, type SpeedUp, order, user, UserSelect } from "@/server/db/schema";
import { createCaller } from "@/server/api/root";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";
import { getOneUser } from "./user";

export const getOneByUserIdAndColumnId = (
  db: PostgresJsDatabase<typeof schema>,
  id: string,
  columnId: string,
) => {
  return db.query.referrals.findFirst({
    where: and(eq(referrals.userId, id), eq(referrals.columnId, columnId)),
  });
};

export const referralsRouter = createTRPCRouter({
  // 新增分页查询方法
  getByColumnIdPaginated: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
        userId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { columnId, page, pageSize, userId, startDate, endDate } = input;
      const offset = (page - 1) * pageSize;

      // 构建查询条件
      const conditions = [
        eq(order.columnId, columnId),
        eq(order.status, true),
        sql`${order.recommendationId} IS NOT NULL`
      ];

      // 添加时间筛选条件
      if (startDate) {
        conditions.push(gte(order.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(order.createdAt, new Date(endDate)));
      }

      // 执行查询获取订单数据
      const orderResults = await ctx.db
        .select({
          recommendationId: order.recommendationId,
          totalPrice: sql`SUM(${order.price})`.as("totalPrice"),
          count: sql`COUNT(*)`.as("count"),
        })
        .from(order)
        .where(and(...conditions))
        .groupBy(order.recommendationId);
      // 获取用户ID列表
      const userIds = orderResults
        .map(item => item.recommendationId)
        .filter(Boolean) as string[];
      // 如果没有推荐记录，直接返回空结果
      if (userIds.length === 0) {
        return {
          items: [],
          total: 0,
          page,
          pageSize
        };
      }
      let userResults: UserSelect[];

      try {
        // 使用 Promise.all 和多个单独查询替代 IN 操作符
        // 使用类型断言确保返回类型符合UserSelect[]
        userResults = (await Promise.all(
          userIds.map(async (id) => {
            // 如果有userId筛选条件，先检查当前id是否匹配
            if (userId && !id.includes(userId)) {
              return null;
            }

            const result = await ctx.db
              .select({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              })
              .from(user)
              .where(eq(user.id, id));

            return result[0] || null;
          })
        )) as UserSelect[];

        // 过滤掉null结果
        userResults = userResults.filter(Boolean);
      } catch (error) {
        console.error("查询用户信息出错:", error);
        userResults = [];
      }
      // 合并数据
      const mergedData = userResults.map(userInfo => {
        const orderInfo = orderResults.find(order => order.recommendationId === userInfo.id);
        return {
          id: Math.random(), // 确保有唯一ID
          avatar: userInfo.avatar || "",
          username: userInfo.name || "",
          userId: userInfo.id,
          acceleratedTotal: orderInfo?.count || 0,
          totalPrice: Number(orderInfo?.totalPrice) || 0,
        } as SpeedUp;
      });
      // 按加速量排序
      const sortedData = mergedData.sort((a, b) => b.acceleratedTotal - a.acceleratedTotal);

      // 分页
      const paginatedData = sortedData.slice(offset, offset + pageSize);

      return {
        items: paginatedData,
        total: sortedData.length,
        page,
        pageSize
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        userId: z.string(),
        referredUserId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.query.referrals.findFirst({
        where: and(
          eq(referrals.userId, input.userId),
          eq(referrals.columnId, input.columnId),
        ),
      });
      if (data) {
        return ctx.db
          .update(referrals)
          .set({
            referredUserId: input.referredUserId,
          })
          .where(
            and(
              eq(referrals.userId, input.userId),
              eq(referrals.columnId, input.columnId),
            ),
          );
      } else {
        return ctx.db.insert(referrals).values({
          columnId: input.columnId,
          userId: input.userId,
          referredUserId: input.referredUserId,
        });
      }
    }),

  getOneByUserIdAndColumnId: publicProcedure
    .input(z.object({ columnId: z.string(), userId: z.string() }))
    .query(({ ctx, input }) => {
      return getOneByUserIdAndColumnId(ctx.db, input.userId, input.columnId);
    }),
});

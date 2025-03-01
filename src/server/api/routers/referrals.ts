import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, eq, gte, lte, like, sql, desc, count } from "drizzle-orm";
import { referrals, type SpeedUp, order, user } from "@/server/db/schema";
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
  // 保留原有方法，但不推荐使用
  getByColumnId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const caller = createCaller(ctx);
      const res: SpeedUp[] = [];
      const referralsList = await ctx.db.query.referrals.findMany({
        where: eq(referrals.columnId, input),
      });
      // 使用 Map 按照 referredUserId 去重
      const uniqueReferrals = Array.from(
        new Map(
          referralsList.map((item) => [item.referredUserId, item]),
        ).values(),
      );
      const promise = uniqueReferrals.map(async (referral, index) => {
        const price = await caller.order.getTotalPriceByReferralId(
          referral.referredUserId,
        );
        const user = await getOneUser(ctx.db, referral.referredUserId!);
        res.push({
          id: index + 1,
          avatar: user.avatar,
          username: user.name,
          userId: user.id,
          acceleratedTotal: price.length,
          totalPrice: price.reduce((acc, curr) => acc + curr, 0),
        });
      });
      await Promise.all(promise);
      return res;
    }),

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

      // 构建用户查询条件
      let userConditions = [];

      // 使用 IN 操作符查询多个用户
      if (userIds.length > 0) {
        userConditions.push(sql`${user.id} IN (${userIds.join(',')})`);
      }

      // 添加用户ID筛选
      if (userId) {
        userConditions.push(like(user.id, `%${userId}%`));
      }

      // 查询用户信息
      const userResults = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        })
        .from(user)
        .where(userConditions.length > 0 ? and(...userConditions) : undefined);

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

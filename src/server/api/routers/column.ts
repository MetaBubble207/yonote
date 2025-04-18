import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  type BaseColumnCard,
  column,
  type DetailColumnCard,
  order,
  post,
  priceList,
  user,
} from "@/server/db/schema";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { uniqueArray } from "@/app/_utils/uniqueArray";
import { getCurrentTime } from "@/app/_utils/getCurrentTime";
import { checkUnreadPosts, getDetailColumnCard } from "../tools/columnQueries";
import { getOneUser } from "../tools/userQueries";

export const columnRouter = createTRPCRouter({
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        priceList: z.array(
          z.object({
            id: z.union([z.number(), z.undefined()]),
            price: z.number(),
            timeLimit: z.number(),
          }),
        ),
        introduce: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 获取旧的价格列表
      const oldPriceList = await ctx.db
        .select()
        .from(priceList)
        .where(eq(priceList.columnId, input.id));

      const oldIds = oldPriceList.map(item => item.id);
      const newIds = input.priceList.map(item => item.id).filter(id => id !== undefined);

      // 删除不再存在的价格策略
      const deletePromises = oldPriceList
        .filter(item => !newIds.includes(item.id))
        .map(item => ctx.db.delete(priceList).where(eq(priceList.id, item.id)));

      await Promise.all(deletePromises);

      // 更新或插入价格策略
      const updatePromises = input.priceList.map(async (item) => {
        if (item.id && oldIds.includes(item.id)) {
          // 更新已存在的价格策略
          return ctx.db
            .update(priceList)
            .set({
              price: item.price,
              timeLimit: item.timeLimit,
            })
            .where(eq(priceList.id, item.id));
        } else {
          // 插入新的价格策略
          return ctx.db.insert(priceList).values({
            columnId: input.id,
            price: item.price,
            timeLimit: item.timeLimit,
          });
        }
      });

      await Promise.all(updatePromises);

      // 更新专栏信息
      await ctx.db
        .update(column)
        .set({
          name: input.name,
          introduce: input.introduce,
          description: input.description,
          updatedAt: getCurrentTime(), // 更新修改时间
        })
        .where(eq(column.id, input.id));

      // 获取更新后的专栏数据
      const updatedColumn = await ctx.db.query.column.findFirst({
        where: eq(column.id, input.id),
      });

      // 获取更新后的价格列表
      const updatedPriceList = await ctx.db
        .select()
        .from(priceList)
        .where(eq(priceList.columnId, input.id));

      // 返回完整的更新后数据
      return {
        column: updatedColumn,
        priceList: updatedPriceList
      };
    }),

  updateCover: publicProcedure
    .input(z.object({ id: z.string(), cover: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(column)
        .set({
          cover: input.cover,
        })
        .where(eq(column.id, input.id));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const columns = await ctx.db.select().from(column);
    const promises = columns.map(async (item) => {
      const u = await ctx.db.query.user.findFirst({
        where: eq(user.id, item.userId),
      });
      return { ...item, user: u };
    });
    return await Promise.all(promises);
  }),

  getAllByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.column.findMany({
        where: eq(column.userId, input.userId),
      });
    }),

  getUpdate: publicProcedure
    .input(z.object({ visitorId: z.string(), writerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      // 查找作者下所有的专栏
      const columns = await db
        .select()
        .from(column)
        .where(eq(column.userId, input.writerId));

      if (!columns.length) return [];

      // 获取所有专栏的文章
      const posts = await db
        .select()
        .from(post)
        .where(and(
          sql`${post.columnId} IN ${columns.map(c => c.id)}`,
          eq(post.status, true)
        ));

      // 检查未读更新
      const updatedColumnIds = await checkUnreadPosts(db, posts, input.visitorId);

      // 返回有更新的专栏
      return columns.filter(col => updatedColumnIds.has(col.id));
    }),


  getColumnName: publicProcedure
    .input(z.object({ searchValue: z.string() }))
    .query(async ({ ctx, input }): Promise<BaseColumnCard[]> => {
      const { db } = ctx;

      // 并行执行两个主查询
      const [userResults, columnResults] = await Promise.all([
        // 查询用户名匹配的记录
        db.select()
          .from(user)
          .where(like(user.name, `%${input.searchValue}%`)),

        // 查询专栏名匹配的记录
        db.select()
          .from(column)
          .where(like(column.name, `%${input.searchValue}%`))
      ]);

      // 收集所有需要查询的专栏和用户
      const columnsByUser = await Promise.all(
        userResults.map(async (user) => {
          const userColumns = await db
            .select()
            .from(column)
            .where(eq(column.userId, user.id));

          return userColumns.map(col => ({
            ...col, // 包含所有原始专栏字段，包括 distributorship 和 type
            userId: user.id,
            userName: user.name ?? "",
            idType: user.idType ?? 0,
            avatar: user.avatar ?? "",
            isVisible: true, // 默认为 true
          }));
        })
      );

      // 处理专栏名匹配的结果
      const columnsByName = await Promise.all(
        columnResults.map(async (col) => {
          const userData = await db.query.user.findFirst({
            where: eq(user.id, col.userId)
          });

          if (!userData) {
            throw new Error(`User not found for column ${col.id}`);
          }

          return {
            ...col, // 包含所有原始专栏字段，包括 distributorship 和 type
            userId: userData.id,
            userName: userData.name ?? "",
            idType: userData.idType ?? 0,
            avatar: userData.avatar ?? "",
            isVisible: true, // 默认为 true
          };
        })
      );

      // 合并结果并去重
      const allResults = [
        ...columnsByUser.flat(),
        ...columnsByName
      ];

      return uniqueArray(allResults, "id");
    }),

  getCreateAt: publicProcedure.query(async ({ ctx }) => {
    const columns = await ctx.db
      .select()
      .from(column)
      .orderBy(desc(column.createdAt));
    const promises = columns.map(async (item) => {
      const u = await ctx.db.query.user.findFirst({
        where: eq(user.id, item.userId),
      });
      return { ...item, user: u };
    });
    return await Promise.all(promises);
  }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const columnDetail = await ctx.db.query.column.findFirst({ where: eq(column.id, input) });
      return columnDetail ?? null;
    }),

  // 获取用户更新了帖子还未读的专栏列表
  getUpdateColumn: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }): Promise<DetailColumnCard[]> => {
      const { db } = ctx;

      // 获取用户有效订阅的专栏
      const orders = await db
        .select()
        .from(order)
        .where(and(
          eq(order.buyerId, input),
          eq(order.isVisible, true),
          eq(order.status, true),
        ));

      if (!orders.length) return [];

      const columnIds = new Set(orders.map(order => order.columnId));

      // 批量获取所有相关文章
      const posts = await db
        .select()
        .from(post)
        .where(sql`${post.columnId} IN ${Array.from(columnIds)}`);

      if (!posts.length) return [];

      // 检查未读更新
      const updatedColumnIds = await checkUnreadPosts(db, posts, input);

      // 获取详细信息
      const detailColumns = await Promise.all(
        Array.from(updatedColumnIds).map(id => getDetailColumnCard(ctx, id))
      );

      return detailColumns.filter((col): col is DetailColumnCard => col !== null);
    }),
  // 获取用户所有可见订阅专栏列表
  getSubscriptColumn: publicProcedure
    .input(z.object({ userId: z.string(), type: z.number().optional() }))
    .query(async ({ ctx, input }): Promise<BaseColumnCard[]> => {
      const { db } = ctx;

      // 获取用户订阅的专栏记录
      const ordersQuery = db
        .select({
          columnId: order.columnId,
          isVisible: order.isVisible
        })
        .from(order)
        .where(and(
          eq(order.buyerId, input.userId),
          eq(order.status, true),
        ));
      let orders;
      if (input.type !== undefined) {
        // 如果指定了类型，则联表查询符合类型的专栏
        orders = await ordersQuery
          .innerJoin(column, and(
            eq(order.columnId, column.id),
            eq(column.type, input.type)
          ));
        if (!orders.length) return [];
      } else {
        // 如果没有指定类型，则查询所有订阅
        orders = await ordersQuery;
        if (!orders.length) return [];
      }
      if (!orders.length) return [];
      // 创建订阅记录映射，用于后续获取 isVisible
      const orderMap = new Map(orders.map(o => [o.columnId, o.isVisible]));

      // 批量获取专栏数据
      const columns = await db.query.column.findMany({
        where: sql`${column.id} IN ${orders.map(o => o.columnId)}`
      });

      if (!columns.length) return [];

      // 批量获取用户数据
      const userIds = [...new Set(columns.map(col => col.userId))];
      const users = await Promise.all(
        userIds.map(id => getOneUser(ctx.db, id))
      );

      // 创建用户信息查找映射
      const userMap = new Map(users.map(user => [user!.id, user]));
      // 组合数据，添加 isVisible 字段
      return columns.map(col => {
        const user = userMap.get(col.userId);
        const isVisible = orderMap.get(col.id);
        if (!user) throw new Error(`User not found for column ${col.id}`);
        return {
          ...col,
          userId: user.id,
          idType: user.idType ?? 0,
          userName: user.name ?? "",
          avatar: user.avatar!,
          isVisible: isVisible ?? true, // 默认为 true
        };
      });
    }),

  // 获取专栏及其用户信息
  getColumnUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          column: column,
          user: {
            id: user.id,
            idType: user.idType,
            name: user.name,
            avatar: user.avatar,
          },
        })
        .from(column)
        .leftJoin(user, eq(column.userId, user.id))
        .where(eq(column.id, input))
        .limit(1);

      if (!result[0] || !result[0].column || !result[0].user) {
        throw new Error(`Column not found: ${input}`);
      }

      return {
        ...result[0].column,
        idType: result[0].user.idType ?? 0,
        userId: result[0].user.id,
        userName: result[0].user.name!,
        avatar: result[0].user.avatar!,
      } satisfies BaseColumnCard;
    }),

  getColumnFilter: publicProcedure
    .input(z.object({
      conditions: z.number(),
      limit: z.number().default(10),
      cursor: z.number().default(0),
      sortOrder: z.boolean().default(true),
      type: z.number().optional(),
    }))
    .query(async ({ ctx, input }): Promise<{
      items: DetailColumnCard[];
      nextCursor: number | undefined;
    }> => {
      const { conditions, limit, cursor, sortOrder, type } = input;
      // 构建查询条件
      const query = ctx.db
        .select()
        .from(column)
        .limit(limit + 1)
        .offset(cursor);

      // 如果指定了类型，添加类型过滤条件
      if (type !== undefined) {
        query.where(eq(column.type, type));
      }

      // 添加排序
      query.orderBy(sortOrder ? asc(column.id) : desc(column.id));

      const allColumn = await query;
      const hasNextPage = allColumn.length > limit;
      const columns = hasNextPage ? allColumn.slice(0, -1) : allColumn;

      const detailColumnsPromise = columns.map(col => getDetailColumnCard(ctx, col.id));

      let items = (await Promise.all(detailColumnsPromise)).filter(item => item !== null);
      // 根据条件排序
      items = items.sort((a, b) => {
        switch (conditions) {
          case 1:
            return sortOrder
              ? b.subscriptionCount - a.subscriptionCount
              : a.subscriptionCount - b.subscriptionCount;
          case 2:
            return sortOrder
              ? b.postCount - a.postCount
              : a.postCount - b.postCount;
          case 3:
            return sortOrder
              ? (b.createdAt > a.createdAt ? 1 : -1)
              : (a.createdAt > b.createdAt ? 1 : -1);
          case 4:
            return sortOrder
              ? (b.updatedAt > a.updatedAt ? 1 : -1)
              : (a.updatedAt > b.updatedAt ? 1 : -1);
          default:
            return 0;
        }
      });

      return {
        items,
        nextCursor: hasNextPage ? cursor + limit : undefined,
      };
    }),
  // 获取作者最近发布一次的专栏Id
  getLatestColumnId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      // 1. 先查询该作者拥有的所有专栏
      const authorColumns = await db
        .select({
          id: column.id
        })
        .from(column)
        .where(eq(column.userId, input));
      if (!authorColumns.length || !authorColumns[0] || authorColumns[0].id === null) {
        return null; // 作者没有专栏
      }

      const columnIds = authorColumns.map(col => col.id);
      // 2. 查询这些专栏下的所有帖子，按更新时间降序排序
      const latestPost = await db
        .select({
          columnId: post.columnId,
          updatedAt: post.updatedAt
        })
        .from(post)
        .where(
          sql`${post.columnId} IN (${sql.join(columnIds.map(id => sql`${id}`), sql`, `)})`
        )
        .orderBy(desc(post.updatedAt))
        .limit(1);
      // 如果作者没有发布过帖子，则返回第一个查到的columnId
      if (!latestPost.length || !latestPost[0] || latestPost[0].columnId === null) {
        return authorColumns[0].id;
      }
      // 3. 返回最近更新的专栏ID
      return latestPost[0].columnId;
    }),
});

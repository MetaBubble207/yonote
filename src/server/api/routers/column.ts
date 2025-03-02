import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  type BaseColumnCard,
  type ColumnSelect,
  column,
  type ColumnOrder,
  type DetailColumnCard,
  order,
  post,
  postRead,
  priceList,
  user,
} from "@/server/db/schema";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { uniqueArray } from "@/tools/uniqueArray";
import { createCaller } from "@/server/api/root";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { getOneUser } from "./user";
import { getPostStats } from "../tools/columnQueries";

const getDetailColumnCard = async (
  ctx: { headers: Headers; db: PostgresJsDatabase<typeof schema> },
  columnId: string,
): Promise<DetailColumnCard | null> => {
  const { db } = ctx;
  const columnData = await db.query.column.findFirst({
    where: eq(column.id, columnId),
  });

  if (!columnData) {
    return null;
  }
  // 获取专栏下的所有帖子
  const posts = await db
    .select()
    .from(post)
    .where(and(eq(post.columnId, columnId), eq(post.status, true)))
    .orderBy(asc(post.chapter));
  // 并行获取所有文章的统计数据并累加
  const postsWithStats = await Promise.all(
    posts.map(async (post) => await getPostStats(db, post.id))
  );

  // 计算总阅读量和点赞量
  const { readCount, likeCount } = postsWithStats.reduce(
    (acc, curr) => ({
      readCount: Number(acc.readCount) + Number(curr.readCount ?? 0),
      likeCount: Number(acc.likeCount) + Number(curr.likeCount ?? 0),
    }),
    { readCount: 0, likeCount: 0 }
  );

  // 获取专栏订阅量
  const subscriptionCount = (
    await db.select().from(order).where(eq(order.columnId, columnId))
  ).length;
  // 获取帖子数量
  const postCount = (
    await db.select().from(post).where(eq(post.columnId, columnId))
  ).length;
  // 获取作者基本信息
  const userData = await getOneUser(ctx.db, columnData!.userId!);
  let detailColumnCard: DetailColumnCard = {
    avatar: "",
    cover: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "",
    isFree: false,
    isTop: false,
    name: "",
    likeCount: 0,
    readCount: 0,
    introduce: '',
    description: '',
    subscriptionCount: 0,
    postCount: 0,
    userId: "",
    userName: "",
    idType: 0,
  };
  if (!userData) return null;
  Object.assign(detailColumnCard, {
    ...columnData,
    readCount,
    likeCount,
    subscriptionCount,
    postCount,
    userId: userData.id,
    userName: userData.name,
    avatar: userData.avatar,
  });
  return detailColumnCard;
};

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
      const res: ColumnSelect[] = [];
      // 遍历作者下的每一个专栏的帖子
      const promises = columns.map(async (column) => {
        const posts = await db
          .select()
          .from(post)
          .where(eq(post.columnId, column.id));
        return Promise.all(
          posts.map(async (item) => {
            // 查看阅读表数据
            const readData = await db.query.postRead.findFirst({
              where: and(
                eq(postRead.postId, post.id),
                eq(postRead.userId, input.visitorId),
              ),
            });
            // 阅读记录的更新时间小于文章的更新时间则说明文章更新了，读者还没读
            if (readData?.updatedAt < item.updatedAt) {
              const isExist = res.find((item) => item.id === column.id);
              if (!isExist) {
                res.push(column);
              }
            }
          }),
        );
      });
      await Promise.all(promises);
      return res;
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
            id: col.id,
            name: col.name,
            introduce: col.introduce ?? undefined,
            description: col.description ?? undefined,
            cover: col.cover ?? "",
            userId: user.id,
            userName: user.name,
            idType: user.idType ?? 0,
            avatar: user.avatar ?? "",
            isVisible: true, // 默认为 true
            createdAt: col.createdAt!,
            updatedAt: col.updatedAt!,
          }));
        })
      );

      // 处理专栏名匹配的结果
      const columnsByName = await Promise.all(
        columnResults.map(async (col) => {
          const userData = await db.query.user.findFirst({
            where: eq(user.id, col.userId!)
          });

          if (!userData) {
            throw new Error(`User not found for column ${col.id}`);
          }

          return {
            id: col.id,
            name: col.name,
            introduce: col.introduce ?? undefined,
            description: col.description ?? undefined,
            cover: col.cover ?? "",
            userId: userData.id,
            userName: userData.name,
            idType: userData.idType ?? 0,
            avatar: userData.avatar ?? "",
            isVisible: true, // 默认为 true
            createdAt: col.createdAt!,
            updatedAt: col.updatedAt!,
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

  getContentNumber: publicProcedure.query(async ({ ctx }) => {
    const columns = await ctx.db
      .select()
      .from(column)
      .orderBy(desc(column.introduce));
    const promises = columns.map(async (item) => {
      const u = await ctx.db.query.user.findFirst({
        where: eq(user.id, item.userId),
      });
      return { ...item, user: u };
    });
    return await Promise.all(promises);
  }),

  getColumnDetail: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const columnDetail = await ctx.db
        .select()
        .from(column)
        .where(and(eq(column.id, input)));
      return columnDetail[0];
    }),

  //订阅量查询
  getColumnOrderNumbers: publicProcedure.query(async ({ ctx }) => {
    const columnIds = await ctx.db
      .select({ columnId: order.columnId, userId: order.ownerId })
      .from(order)
      .groupBy(order.columnId, order.ownerId)
      .orderBy(sql`count(*) DESC`);

    const promises = columnIds.map(async (item) => {
      const col = await ctx.db
        .select()
        .from(column)
        .where(eq(column.id, item.columnId))
        .limit(1);
      const owner = await ctx.db
        .select()
        .from(user)
        .where(eq(user.id, item.userId))
        .limit(1);
      return { ...col[0], user: { ...owner[0] } };
    });
    return await Promise.all(promises);
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
      const result = new Map<string, DetailColumnCard>();

      // 批量获取所有相关文章
      const posts = await db
        .select()
        .from(post)
        .where(sql`${post.columnId} IN ${Array.from(columnIds)}`);

      if (!posts.length) return [];

      // 批量获取阅读记录
      const readRecords = await db
        .select()
        .from(postRead)
        .where(and(
          eq(postRead.userId, input),
          sql`${postRead.postId} IN ${posts.map(p => p.id)}`
        ));

      const readMap = new Map(readRecords.map(r => [r.postId, r]));

      // 检查每篇文章的更新状态
      for (const post of posts) {
        const readRecord = readMap.get(post.id);
        const needsUpdate = !readRecord || readRecord.updatedAt! < post.updatedAt!;

        if (needsUpdate && !result.has(post.columnId!)) {
          const detailColumnCard = await getDetailColumnCard(ctx, post.columnId!);
          result.set(post.columnId!, detailColumnCard);
        }
      }

      return Array.from(result.values());
    }),

  // 获取用户所有可见订阅专栏列表
  getSubscriptColumn: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }): Promise<BaseColumnCard[]> => {
      const { db } = ctx;
      const caller = createCaller(ctx);

      // 获取所有有效订阅记录，增加 isVisible 字段
      const orders = await db
        .select({
          columnId: order.columnId,
          isVisible: order.isVisible
        })
        .from(order)
        .where(and(
          eq(order.buyerId, input),
          eq(order.status, true),
        ));

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
        userIds.map(id => getOneUser(ctx.db, id!))
      );

      // 创建用户信息查找映射
      const userMap = new Map(users.map(user => [user!.id, user]));

      // 组合数据，添加 isVisible 字段
      return columns.map(col => {
        const user = userMap.get(col.userId!);
        const isVisible = orderMap.get(col.id);
        if (!user) throw new Error(`User not found for column ${col.id}`);
        return {
          ...col,
          userId: user.id,
          idType: user.idType,
          userName: user.name,
          avatar: user.avatar,
          isVisible: isVisible ?? true, // 默认为 true
        };
      });
    }),

  getAlreadySubscribedColumns: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // 获取订单
      const orders = await ctx.db
        .select()
        .from(order)
        .where(and(eq(order.buyerId, input.userId), eq(order.status, true)));
      // 获取专栏
      const resTemp: ColumnOrder[] = [];
      const promises = orders.map(async (order) => {
        resTemp.push({
          column: await ctx.db.query.column.findFirst({
            where: eq(column.id, order.columnId),
          }),
          order: order,
        });
      });
      await Promise.all(promises);
      return resTemp.sort((a, b) =>
        a.order.createdAt > b.order.createdAt ? 1 : -1,
      );
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
    }))
    .query(async ({ ctx, input }): Promise<{
      items: DetailColumnCard[];
      nextCursor: number | undefined;
    }> => {
      const { conditions, limit, cursor, sortOrder } = input;

      const allColumn = await ctx.db
        .select()
        .from(column)
        .limit(limit + 1)
        .offset(cursor)
        .orderBy(sortOrder ? asc(column.id) : desc(column.id));

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

  // 更新创作时间
  changeUpdatedAt: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(column)
        .set({
          updatedAt: getCurrentTime(),
        })
        .where(eq(column.id, input.id));
    }),
});

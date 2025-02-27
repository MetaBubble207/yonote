import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, order, post, postRead } from "@/server/db/schema";
import { and, desc, eq, gt, lt, sql } from "drizzle-orm";
import {
  getCurrentTime,
  getLastMonthDates,
  getLastWeekDates,
  getTodayMidnight,
  getYesterdayMidnight,
} from "@/tools/getCurrentTime";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";

export const getColumnsReadFC = async (db: PostgresJsDatabase<typeof schema>, columnId: string) => {
  const result = await db
    .select({
      totalReads: sql<number>`sum(${postRead.readCount})`,
    })
    .from(post)
    .leftJoin(postRead, eq(post.id, postRead.postId))
    .where(eq(post.columnId, columnId))
    .groupBy(post.columnId);

  return result[0]?.totalReads ?? 0;
}

// 在文件开头的工具函数部分添加
interface TimeRange {
  start: Date;
  end: Date;
}

// 统一的阅读量查询函数
async function getColumnReadsInRange(
  db: PostgresJsDatabase<typeof schema>,
  columnId: string,
  timeRange?: TimeRange
): Promise<number> {
  const baseQuery = db
    .select({
      readCount: sql<number>`count(*)`,
    })
    .from(post)
    .leftJoin(postRead, eq(post.id, postRead.postId))
    .where(eq(post.columnId, columnId));

  if (timeRange) {
    return (await baseQuery
      .where(
        and(
          gt(postRead.createdAt, timeRange.start),
          lt(postRead.createdAt, timeRange.end)
        )
      )
      .execute())[0]?.readCount ?? 0;
  }

  return (await baseQuery.execute())[0]?.readCount ?? 0;
}

export const readRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const reads = await ctx.db.query.postRead.findFirst({
        where: and(
          eq(postRead.postId, input.postId),
          eq(postRead.userId, input.userId),
        ),
      });
      console.log(reads);
      if (reads) return;

      return ctx.db
        .insert(postRead)
        .values({
          postId: input.postId,
          userId: input.userId,
          updatedAt: getCurrentTime(),
        })
        .returning({ postId: postRead.postId, userId: postRead.userId });
    }),

  getReadList: publicProcedure
    .input(
      z.object({ id: z.string(), chapter: z.number(), userId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const c = await ctx.db.query.column.findFirst({
        where: eq(column.id, input.id),
      });
      if (!c) {
        throw new Error("Column not found");
      }
      const data = await ctx.db
        .select()
        .from(post)
        .where(eq(post.columnId, input.id));
      if (!data?.length) {
        throw new Error("No data found");
      }
      // const postId = data[input.chapter - 1].id
      const postId = (
        await ctx.db.query.post.findFirst({
          where: and(
            eq(post.columnId, input.id),
            eq(post.chapter, input.chapter),
          ),
        })
      ).id;

      const list = await ctx.db
        .select()
        .from(postRead)
        .where(
          and(eq(postRead.postId, postId), eq(postRead.userId, input.userId)),
        );
      if (!list?.length) {
        return ctx.db
          .insert(postRead)
          .values({
            postId: postId,
            userId: input.userId,
            updatedAt: getCurrentTime(),
            readCount: 1,
          })
          .returning({
            postId: postRead.postId,
            userId: postRead.userId,
            postRead: postRead.readCount,
          });
      } else {
        // return list;
        return ctx.db
          .update(postRead)
          .set({
            updatedAt: getCurrentTime(),
          })
          .where(
            and(eq(postRead.postId, postId), eq(postRead.userId, input.userId)),
          );
      }
    }),

  // 获取文章阅读量
  getPostRead: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          readCount: sql<number>`count(*)`,
        })
        .from(postRead)
        .where(eq(postRead.postId, input.postId))
        .execute();

      return result[0]?.readCount ?? 0;
    }),
    
  // 获取最近阅读
  getRecentRead: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const recent = await ctx.db
        .select({
          postId: postRead.postId,
          post: post
        })
        .from(postRead)
        .leftJoin(post, eq(post.id, postRead.postId))
        .where(eq(postRead.userId, input))
        .orderBy(desc(postRead.updatedAt))
        .limit(1);

      if (!recent.length || !recent[0]?.post) {
        return null;
      }

      return recent[0].post;
    }),

  // 获取专栏昨天阅读量
  getYesterdayReading: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getColumnReadsInRange(ctx.db, input.columnId, {
        start: getYesterdayMidnight(),
        end: getTodayMidnight(),
      });
    }),

  // 获取专栏上周阅读量
  getLastWeekReading: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { lastMonday, lastSunday } = getLastWeekDates();
      return getColumnReadsInRange(ctx.db, input.columnId, {
        start: lastMonday,
        end: lastSunday,
      });
    }),

  // 获取专栏上月阅读量
  getLastMonthReading: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { firstDayOfLastMonth, lastDayOfLastMonth } = getLastMonthDates();
      return getColumnReadsInRange(ctx.db, input.columnId, {
        start: firstDayOfLastMonth,
        end: lastDayOfLastMonth,
      });
    }),

  // 获取昨天、上周、上个月的阅读量
  getReading: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [yesterday, lastWeek, lastMonth] = await Promise.all([
        getColumnReadsInRange(ctx.db, input.columnId, {
          start: getYesterdayMidnight(),
          end: getTodayMidnight(),
        }),
        getColumnReadsInRange(ctx.db, input.columnId, {
          start: getLastWeekDates().lastMonday,
          end: getLastWeekDates().lastSunday,
        }),
        getColumnReadsInRange(ctx.db, input.columnId, {
          start: getLastMonthDates().firstDayOfLastMonth,
          end: getLastMonthDates().lastDayOfLastMonth,
        }),
      ]);

      return [yesterday, lastWeek, lastMonth];
    }),

  getReadingRateOfIncrease: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }): Promise<number> => {
      const yesterdayMidnight = getYesterdayMidnight();
      const todayMidnight = getTodayMidnight();
      const now = getCurrentTime();
      // 查询所有专栏下所有的帖子
      const posts = await ctx.db
        .select()
        .from(post)
        .where(eq(post.columnId, input.columnId));

      let yesterdayReadCount = 0;
      let todayReadCount = 0;
      const readPromises = posts.map(async (item) => {
        const yesterdayReads = await ctx.db
          .select()
          .from(postRead)
          .where(
            and(
              eq(postRead.postId, item.id),
              and(
                gt(postRead.createdAt, yesterdayMidnight),
                lt(postRead.createdAt, todayMidnight),
              ),
            ),
          );
        yesterdayReadCount += yesterdayReads.length;
        const todayReads = await ctx.db
          .select()
          .from(postRead)
          .where(
            and(
              eq(postRead.postId, item.id),
              and(
                gt(postRead.createdAt, todayMidnight),
                lt(postRead.createdAt, now),
              ),
            ),
          );
        todayReadCount += todayReads.length;
      });
      await Promise.all(readPromises);
      if (yesterdayReadCount === 0) {
        return todayReadCount * 100;
      } else if (todayReadCount === 0) {
        return -yesterdayReadCount * 100;
      } else {
        const rate =
          Math.floor((todayReadCount / yesterdayReadCount) * 100) / 100;
        return rate >= 1 ? rate - 1 : -rate;
      }
    }),

  getHomePageDataRange: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        start: z.date().nullable(),
        end: z.date().nullable(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        readCount: number[];
        subscriptionCount: number[];
        speedUpCount: number[];
      }> => {
        if (input.start === null || input.end === null) return null;
        const { db } = ctx;
        // 用于存储每天数据的数组
        const readsData: number[] = [];
        const subscriptionsData: number[] = [];
        const speedUpData: number[] = [];

        // 克隆开始日期，以便我们可以在循环中修改它
        let currentDate = new Date(input.start.getTime() + 8 * 60 * 60 * 1000);
        const endDate = new Date(input.end.getTime() + 31 * 59 * 59 * 1000);
        // 查询所有专栏下所有的帖子
        const posts = await db
          .select()
          .from(post)
          .where(eq(post.columnId, input.columnId));
        // 循环遍历从开始日期到结束日期的每一天
        while (new Date(currentDate.setUTCHours(0, 0, 0, 0)) <= endDate) {
          // 查询阅读量
          let readCount = 0;
          const readPromises = posts.map(async (item) => {
            const todayReads = await db
              .select()
              .from(postRead)
              .where(
                and(
                  eq(postRead.postId, item.id),
                  and(
                    gt(
                      postRead.createdAt,
                      new Date(currentDate.setUTCHours(0, 0, 0, 0)),
                    ),
                    lt(
                      postRead.createdAt,
                      new Date(currentDate.setUTCHours(23, 59, 59, 999)),
                    ),
                  ),
                ),
              );
            readCount += todayReads.length;
          });
          await Promise.all(readPromises);
          // 将当前日期的订单数量添加到数组中
          readsData.push(readCount);

          // 查询订阅量
          const subscriptionCount: number = (
            await db
              .select()
              .from(order)
              .where(
                and(
                  eq(order.columnId, input.columnId),
                  and(
                    gt(
                      order.createdAt,
                      new Date(currentDate.setUTCHours(0, 0, 0, 0)),
                    ),
                    lt(
                      order.createdAt,
                      new Date(currentDate.setUTCHours(23, 59, 59, 999)),
                    ),
                  ),
                ),
              )
          ).length;
          subscriptionsData.push(subscriptionCount);

          // 查询加速计划
          const speedUpCount = 0;
          speedUpData.push(speedUpCount);

          // 将当前日期增加一天
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // 返回每一天的数据
        return {
          readCount: readsData,
          subscriptionCount: subscriptionsData,
          speedUpCount: speedUpData,
        };
      },
    ),
});

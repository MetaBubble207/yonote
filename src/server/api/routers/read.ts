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
import { getAllHomepageData, getColumnReadsInRange, getReads } from "../tools/readQueries";

export const readRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ postId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 查找之前的阅读记录
      const reads = await ctx.db.query.postRead.findFirst({
        where: and(
          eq(postRead.postId, input.postId),
          eq(postRead.userId, input.userId),
        ),
      });

      const now = getCurrentTime();

      if (reads) {
        // 计算时间差（毫秒）
        const timeDiff = now.getTime() - reads.updatedAt.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        // 如果超过24小时
        if (hoursDiff >= 24) {
          return ctx.db
            .update(postRead)
            .set({
              readCount: (reads.readCount ?? 0) + 1,
              updatedAt: now,
            })
            .where(
              and(
                eq(postRead.postId, input.postId),
                eq(postRead.userId, input.userId),
              ),
            );
        }
        // 未超过24小时，不做操作
        return reads;
      }

      // 没有阅读记录，创建新记录
      return ctx.db
        .insert(postRead)
        .values({
          postId: input.postId,
          userId: input.userId,
          readCount: 1,
          updatedAt: now,
        });
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
      const postData = await ctx.db.query.post.findFirst({
        where: and(
          eq(post.columnId, input.id),
          eq(post.chapter, input.chapter),
        ),
      });
      if (!postData?.id) {
        throw new Error("No data found");
      }
      const postId = postData.id;
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

  getHomepageData: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      // 一次性获取所有主页数据
      return getAllHomepageData(db, input);
    }),

  getHomePageDataRange: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        start: z.string().nullable(),
        end: z.string().nullable(),
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
        if (input.start === null || input.end === null) return {
          readCount: [],
          subscriptionCount: [],
          speedUpCount: []
        };
        const { db } = ctx;

        // 调整为东八区时间（UTC+8）
        const startDate = new Date(input.start);
        // 设置为当天的00:00:00（东八区）
        startDate.setHours(0, 0, 0, 0);
        // 调整为UTC时间（加8小时）用于数据库查询
        const startDateUTC = new Date(startDate.getTime() + 8 * 60 * 60 * 1000);

        const endDate = new Date(input.end);
        // 设置为当天的23:59:59（东八区）
        endDate.setHours(23, 59, 59, 999);
        // 调整为UTC时间（加8小时）用于数据库查询
        const endDateUTC = new Date(endDate.getTime() + 8 * 60 * 60 * 1000);
        // 计算日期范围内的天数（使用东八区时间计算）
        const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // 初始化结果数组
        const readsData = Array(dayCount).fill(0);
        const subscriptionsData = Array(dayCount).fill(0);
        const speedUpData = Array(dayCount).fill(0);

        // 1. 获取所有专栏下的帖子 - 只查询一次
        const posts = await db
          .select()
          .from(post)
          .where(eq(post.columnId, input.columnId));

        if (posts.length === 0) {
          return {
            readCount: readsData,
            subscriptionCount: subscriptionsData,
            speedUpCount: speedUpData,
          };
        }

        // 2. 获取日期范围内的所有阅读记录 - 分别查询每个帖子的阅读记录并合并
        const allReadsPromises = posts.map(p =>
          db.select({
            postId: postRead.postId,
            createdAt: postRead.createdAt,
          })
            .from(postRead)
            .where(
              and(
                eq(postRead.postId, p.id),
                and(
                  gt(postRead.createdAt, startDateUTC),
                  lt(postRead.createdAt, endDateUTC)
                )
              )
            )
        );

        // 并行执行所有查询
        const allReadsResults = await Promise.all(allReadsPromises);
        // 合并所有结果
        const allReads = allReadsResults.flat();

        // 3. 获取日期范围内的所有订阅记录 - 只查询一次
        const allSubscriptions = await db
          .select({
            createdAt: order.createdAt,
          })
          .from(order)
          .where(
            and(
              eq(order.columnId, input.columnId),
              and(
                gt(order.createdAt, startDateUTC),
                lt(order.createdAt, endDateUTC)
              )
            )
          );
        // 4. 按日期分组统计数据（转换为东八区时间）
        for (const read of allReads) {
          // 将 UTC 时间转换为东八区时间
          const readDate = new Date(read.createdAt.getTime() + 8 * 60 * 60 * 1000);
          // 计算与起始日期的天数差
          const dayIndex = Math.floor((readDate.getTime() - startDateUTC.getTime()) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < dayCount) {
            readsData[dayIndex]++;
          }
        }

        for (const subscription of allSubscriptions) {
          // 将 UTC 时间转换为东八区时间
          const subDate = new Date(subscription.createdAt.getTime());
          // 计算与起始日期的天数差
          const dayIndex = Math.floor((subDate.getTime() - startDateUTC.getTime()) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < dayCount) {
            subscriptionsData[dayIndex]++;
          }
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

import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {column, order, post, postRead} from "@/server/db/schema";
import {and, desc, eq, gt, lt} from "drizzle-orm";
import {
    getCurrentTime,
    getLastMonthDates,
    getLastWeekDates,
    getTodayMidnight,
    getYesterdayMidnight
} from "@/tools/getCurrentTime";

export const readRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        postId: z.number(),
        userId: z.string(),
    }))
        .mutation(({ctx, input}) => {
            return ctx.db.insert(postRead).values({
                postId: input.postId,
                userId: input.userId,
                updatedAt: getCurrentTime(),
            }).returning({postId: postRead.postId, userId: postRead.userId})
        }),

    getReadList: publicProcedure
        .input(z.object({id: z.string(), chapter: z.number(), userId: z.string()}))
        .mutation(async ({ctx, input}) => {
            const c = await ctx.db.query.column.findFirst({where: eq(column.id, input.id)})
            if (!c) {
                throw new Error("Column not found");
            }
            const data = await ctx.db.select().from(post).where(eq(post.columnId, input.id));
            if (!data?.length) {
                throw new Error("No data found");
            }
            // const postId = data[input.chapter - 1].id
            const postId = (await ctx.db.query.post.findFirst({where: and(eq(post.columnId, input.id), eq(post.chapter, input.chapter))})).id;

            const list = await ctx.db.select().from(postRead).where(and(eq(postRead.postId, postId), eq(postRead.userId, input.userId)));
            if (!list?.length) {
                return ctx.db.insert(postRead).values({
                    postId: postId,
                    userId: input.userId,
                    updatedAt: getCurrentTime(),
                    readCount: 1,
                }).returning({postId: postRead.postId, userId: postRead.userId, postRead: postRead.readCount})
            } else {
                // return list;
                return ctx.db.update(postRead).set({
                    updatedAt: getCurrentTime(),
                }).where(and(eq(postRead.postId, postId), eq(postRead.userId, input.userId)))
            }
        }),

    // 获取专栏阅读量
    getColumnRead: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const readList = await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));
            if (readList?.length === 0) {
                return 0;
            } else {
                let res = 0;
                for (const item of readList) {
                    const postId = item.id;
                    const data = await ctx.db.select().from(postRead).where(eq(postRead.postId, postId));
                    // const data = await ctx.db.query.postRead.findFirst({ where: eq(postRead.postId, postId) })                        
                    data.map((item) => {
                        res += item.readCount;
                    })
                }

                return res;
            }
        }),

    // 获取文章阅读量
    getPostRead: publicProcedure
        .input(z.object({postId: z.number()}))
        .query(async ({ctx, input}) => {
            const data = await ctx.db.select().from(postRead).where(eq(postRead.postId, input.postId));
            return data?.length;
        }),

    // 获取最近阅读
    getRecentRead: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}) => {
            // const recent = await ctx.db.select().from(postRead).where(eq(postRead.userId, input.userId)).orderBy(postRead.updatedAt).limit(1);
            const recent = await ctx.db.select().from(postRead).where(eq(postRead.userId, input.userId)).orderBy(desc(postRead.updatedAt));
            // return recent;
            return await ctx.db.query.post.findFirst({
                where:
                    eq(post.id, recent[0].postId)
            });
        }),

    //获取专栏昨天阅读量
    getYesterdayReading: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const yesterday = getYesterdayMidnight();
            const today = getTodayMidnight();
            // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));

            let readCount: number = 0;
            const readPromises = posts.map(async item => {
                const reads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, yesterday), lt(postRead.createdAt, today))
                        )
                    );
                readCount += reads.length;
            })
            await Promise.all(readPromises);
            return readCount;
        }),

    //获取专栏上周阅读量
    getLastWeekReading: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const {lastMonday, lastSunday} = getLastWeekDates();
            // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));

            let readCount: number = 0;
            const readPromises = posts.map(async item => {
                const reads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, lastMonday), lt(postRead.createdAt, lastSunday))
                        )
                    );
                readCount += reads.length;
            })
            await Promise.all(readPromises);
            return readCount;
        }),

    //获取专栏上周阅读量
    getLastMonthReading: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const {firstDayOfLastMonth, lastDayOfLastMonth} = getLastMonthDates();
            // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));

            let readCount: number = 0;
            const readPromises = posts.map(async item => {
                const reads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, firstDayOfLastMonth), lt(postRead.createdAt, lastDayOfLastMonth))
                        )
                    );
                readCount += reads.length;
            })
            await Promise.all(readPromises);
            return readCount;
        }),

    // 获取昨天、上周、上个月的阅读量
    getReading: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const yesterday = getYesterdayMidnight();
            const today = getTodayMidnight();
            const {lastMonday, lastSunday} = getLastWeekDates();
            const {firstDayOfLastMonth, lastDayOfLastMonth} = getLastMonthDates();
            // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));

            let readCount: number[] = [0, 0, 0];
            const readPromises = posts.map(async (item) => {
                const readsYesterday =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, yesterday), lt(postRead.createdAt, today))
                        )
                    );
                readCount[0] += readsYesterday.length;
                const readsLastWeek =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, lastMonday), lt(postRead.createdAt, lastSunday))
                        )
                    );
                readCount[1] += readsLastWeek.length;
                const readsLastMonth =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, firstDayOfLastMonth), lt(postRead.createdAt, lastDayOfLastMonth))
                        )
                    );
                readCount[2] += readsLastMonth.length;
            })
            await Promise.all(readPromises);
            return readCount;
        }),

    getReadingRateOfIncrease: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}): Promise<number> => {
            const yesterdayMidnight = getYesterdayMidnight();
            const todayMidnight = getTodayMidnight();
            const now = getCurrentTime();
            // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));

            let yesterdayReadCount: number = 0;
            let todayReadCount: number = 0;
            const readPromises = posts.map(async item => {
                const yesterdayReads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, yesterdayMidnight), lt(postRead.createdAt, todayMidnight))
                        )
                    );
                yesterdayReadCount += yesterdayReads.length;
                const todayReads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId, item.id),
                            and(gt(postRead.createdAt, todayMidnight), lt(postRead.createdAt, now))
                        )
                    );
                todayReadCount += todayReads.length;

            })
            await Promise.all(readPromises);
            console.log(yesterdayReadCount,todayReadCount)
            if (yesterdayReadCount === 0) {
                return todayReadCount * 100
            } else if (todayReadCount === 0) {
                return -yesterdayReadCount * 100
            } else {
                const rate = Math.floor(todayReadCount / yesterdayReadCount * 100) / 100;
                return rate >= 1 ? rate - 1 : -rate;
            }
        }),

    getReadRange: publicProcedure
        .input(z.object({columnId: z.string(), start: z.date(), end: z.date()}))
        .query(async ({ctx, input}): Promise<number[]> => {
            // 用于存储每天数据的数组
            let dailyData: number[] = [];

            // 克隆开始日期，以便我们可以在循环中修改它
            let currentDate = new Date(input.start);
            // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));
            // 循环遍历从开始日期到结束日期的每一天
            while (currentDate <= input.end) {
                let readCount: number = 0;
                const readPromises = posts.map(async item => {
                    const todayReads =
                        await ctx.db.select().from(postRead).where(
                            and(
                                eq(postRead.postId, item.id),
                                and(gt(postRead.createdAt, new Date(currentDate.setUTCHours(0, 0, 0, 0))),
                                    lt(postRead.createdAt, new Date(currentDate.setUTCHours(23, 59, 59, 999)))
                                )
                            )
                        );
                    readCount += todayReads.length;

                })
                await Promise.all(readPromises);
                // 将当前日期的订单数量添加到数组中
                dailyData.push(readCount);

                // 将当前日期增加一天
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // 返回每一天的数据
            return dailyData;
        }),
});
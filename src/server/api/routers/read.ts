import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {post, column, postRead} from "@/server/db/schema";
import {eq, desc, lt, gt} from "drizzle-orm";
import {
    getCurrentTime, getLastWeekDates,
    getTodayMidnight,
    getYesterdayMidnight
} from "@/tools/getCurrentTime";
import {and} from "drizzle-orm";

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
            const data = await ctx.db.query.post.findFirst({
                where:
                    eq(post.id, recent[0].postId)
            });
            return data;
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

            let readCount:number = 0;
            const readPromises = posts.map(async item => {
                const reads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId,item.id),
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
            const {lastMonday,lastSunday} = getLastWeekDates();
            // // 查询所有专栏下所有的帖子
            const posts =
                await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));

            let readCount:number = 0;
            const readPromises = posts.map(async item => {
                const reads =
                    await ctx.db.select().from(postRead).where(
                        and(
                            eq(postRead.postId,item.id),
                            and(gt(postRead.createdAt, lastMonday), lt(postRead.createdAt, lastSunday))
                        )
                    );
                readCount += reads.length;
            })
            await Promise.all(readPromises);
            console.log("read====>",readCount);
            return readCount;
        }),
});
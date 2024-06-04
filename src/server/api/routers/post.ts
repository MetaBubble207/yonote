import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, post, user } from "@/server/db/schema";
import {and, eq} from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";

export const postRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    create: publicProcedure
        .input(z.object({
            name: z.string().min(1),
            content: z.string(),
            tag: z.string(),
            status: z.boolean(),
            columnId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {

            await new Promise((resolve) => setTimeout(resolve, 1000));
            const record = ctx.db.select().from(post).where(eq(post.columnId, input.columnId))
            const chapter = (await record).length + 1;
            ctx.db.select().from(post).where(eq(post.name, input.name))
            return ctx.db.insert(post).values({
                name: input.name,
                content: input.content,
                tag: input.tag,
                status: true,
                updatedAt: getCurrentTime(),
                columnId: input.columnId,
                chapter: chapter,
            }).returning({name: post.name, content: post.content, tag: post.tag, status: post.status, columnId: post.columnId, chapter: post.chapter, createdAt: post.createdAt, updatedAt: post.updatedAt, isTop: post.isTop, isFree: post.isFree});
        }),

    updateIsTop: publicProcedure
        .input(z.object({ id: z.number(), isTop: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.update(post).set({ isTop: input.isTop }).where(eq(post.id, input.id));
        }),
    updateIsFree: publicProcedure
        .input(z.object({ id: z.number(), isFree: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.update(post).set({ isFree: input.isFree }).where(eq(post.id, input.id));
        }),
    deletePost: publicProcedure.input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.delete(post).where(eq(post.id, input.id))
        }),
    getLatest: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.post.findFirst({
            orderBy: (post, { desc }) => [desc(post.createdAt)],
        });
    }),

    getAll: publicProcedure
        .input(z.object({ columnId: z.string(), limit: z.number(), offset: z.number() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.post.findMany({
                limit: input.limit,
                offset: input.offset,
                where: eq(post.columnId, input.columnId),
            })
        }),
    // 专栏详情页展示有序的章节数
    getAllInOrder: publicProcedure.input(z.object({ columnId: z.string(), limit: z.number(), offset: z.number() }))
        .query(async ({ ctx, input }) => {
            const postNoTop = ctx.db.select().from(post)
                .where(and(eq(post.columnId, input.columnId),eq(post.isTop,false)))
                .orderBy(post.createdAt);
            const postIsTop = ctx.db.select().from(post)
                .where(and(eq(post.columnId, input.columnId),eq(post.isTop,true)))
                .orderBy(post.createdAt);
            return [...(await postIsTop), ...(await postNoTop)]
        }),
    getAllInUser: publicProcedure
        .input(z.object({ userId: z.string(), limit: z.number(), offset: z.number() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.query.column.findFirst({ where: eq(column.userId, input.userId) })
            return ctx.db.query.post.findMany({
                limit: input.limit,
                offset: input.offset,
                where: eq(post.columnId, data.id),
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.string(), chapter: z.number() }))
        .query(async ({ ctx, input }) => {
            const c = await ctx.db.query.column.findFirst({ where: eq(column.id, input.id) })
            if (!c) {
                throw new Error("Column not found");
            }


            const u = await ctx.db.query.user.findFirst({ where: eq(user.id, c.userId) })

            if (!u) {
                throw new Error("User not found");
            }
            const data = await ctx.db.select().from(post).where(eq(post.columnId, input.id));
            if (!data?.length) {
                throw new Error("No data found");
            }
            //改变排序方式
            let res = [];
            data.map(item => {
                res.push({ ...item, user: u })
            })
            return res[input.chapter - 1]
        }),
    getNumById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.query.post.findMany({
                where: eq(post.columnId, input.id),
            })
            // 返回所有根据 id 查询的数据
            return data.length;
        })
});

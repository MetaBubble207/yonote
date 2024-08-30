import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike, user, post, column } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {getCurrentTime} from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
import { uptime } from "process";
export const postLikeRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
        create: publicProcedure.input(z.object({
            postId: z.number(),
            userId: z.string(),
            isLike: z.boolean(),
        })).mutation(({ctx,input}) => {
            return ctx.db.insert(postLike).values({
            postId: input.postId,
            userId: input.userId,
            isLike: true,
            updatedAt: getCurrentTime(),
            }).returning({postId:postLike.postId,userId:postLike.userId})
        }),

    // 获取当前的postid
    getPostId: publicProcedure
    .input(z.object({id:z.string(),chapter:z.number()}))
    .query(async ({ ctx, input }) => {
        const c = await ctx.db.query.column.findFirst({where:eq(column.id, input.id)})
        if (!c) {
            throw new Error("Column not found");
        }
        const data = await ctx.db.select().from(post).where(eq(post.columnId, input.id));
        if (!data?.length) {
            throw new Error("No data found");
        }
        const postId = data[input.chapter - 1].id
        return postId;
    }),
    // 获取用户点赞的数据
    getLikeList: publicProcedure
        .input(z.object({postId:z.number(),userId:z.string()}))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.select().from(postLike).where(and(eq(postLike.postId, input.postId),eq(postLike.userId,input.userId)));
            return data;
        }),

    // 获取文章点赞数量
    getLikeCount: publicProcedure
        .input(z.object({postId: z.number()}))
        .query(async ({ ctx, input }) => {
            // const data = await ctx.db.query.postLike.findMany.where(and(eq(postLike.postId, input.postId)))
            const data = await ctx.db.select().from(postLike).where(and(eq(postLike.postId, input.postId),eq(postLike.isLike,true)));
            return data.length;
    }),

    // 修改点赞状态
    updateLike: publicProcedure
        .input(z.object({postId:z.number(),userId:z.string(),isLike:z.boolean()}))
        .mutation( async ({ ctx, input }) => {
            // const c = await ctx.db.query.postLike.findMany({ where: { and: [eq(postLike.userId,input.userId), eq(postLike.postId, input.postId)] } });
            // const promises = c.map(async item => {
                return ctx.db.update(postLike).set({isLike:input.isLike}).where(and(eq(postLike.userId, input.userId), eq(postLike.postId, input.postId)))
            }),

    uptime: publicProcedure
        .input(z.object({postId:z.number(),userId:z.string()}))
        .mutation( async ({ ctx, input }) => {
                return ctx.db.update(postLike).set({updatedAt:getCurrentTime()}).where(and(eq(postLike.userId, input.userId), eq(postLike.postId, input.postId)))
            }),

    // 获取专栏点赞量
    getColumnLike: publicProcedure
        .input(z.object({columnId:z.string()}))
        .query( async ({ ctx, input }) => {
            const postList = await ctx.db.select().from(post).where(eq(post.columnId, input.columnId));
            if (postList?.length === 0) {
                return 0;
            } else {
                let res = 0;
                for (const item of postList) {
                    const postId = item.id;
                    const data = await ctx.db.select().from(postLike).where(and(eq(postLike.postId, postId), eq(postLike.isLike, true)));
                    res += data.length;
                }
                return res;
            }

        })
});

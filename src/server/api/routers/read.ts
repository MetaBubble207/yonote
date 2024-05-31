import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike, user, post, column, postRead} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
import { getRedirectStatusCodeFromError } from "next/dist/client/components/redirect";
export const readRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        postId: z.number(),
        userId: z.string(),
    }))
        .mutation(({ ctx, input }) => {
            return ctx.db.insert(postRead).values({
                postId: input.postId,
                userId: input.userId,
                updatedAt: getCurrentTime(),
            }).returning({ postId: postRead.postId, userId: postRead.userId })
        }),
    getReadList: publicProcedure
        .input(z.object({ id: z.string(), chapter: z.number(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const c = await ctx.db.query.column.findFirst({ where: eq(column.id, input.id) })
            if (!c) {
                throw new Error("Column not found");
            }
            const data = await ctx.db.select().from(post).where(eq(post.columnId, input.id));
            if (!data?.length) {
                throw new Error("No data found");
            }
            const postId = data[input.chapter - 1].id
            const list = await ctx.db.select().from(postRead).where(and(eq(postRead.postId, postId), eq(postRead.userId, input.userId)));
            if (!list?.length) {
                return ctx.db.insert(postRead).values({
                    postId: postId,
                    userId: input.userId,
                    updatedAt: getCurrentTime(),
                    readCount: 1,
                }).returning({ postId: postRead.postId, userId: postRead.userId, postRead: postRead.readCount })
            } else {
                return list;
            }
        }),
        // 获取专栏阅读量
        getColumnRead: publicProcedure
            .input(z.object({ columnId:z.string() }))
            .query(async ({ ctx, input }) => {
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
                            res += item.readCount;s
                        })
                    }
                    
                    return res;
                }
            }),
        // 获取文章阅读量
        getPostRead: publicProcedure
            .input(z.object({ postId: z.number()}))
            .query(async ({ ctx, input }) => {
                const data = await ctx.db.select().from(postRead).where(eq(postRead.postId, input.postId));
                return data?.length;
            })

});
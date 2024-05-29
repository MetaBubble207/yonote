import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike, user, post, column, postRead } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
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
});
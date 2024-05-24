import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike, user } from "@/server/db/schema";
export const postLikeRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
    create: publicProcedure.input(z.object({
        id: z.string(),
        postId: z.string(),
        userId: z.string(),
        isLike: z.boolean(),
    }))
        .mutation(({ ctx, input }) => {
            return ctx.db.insert(postLike).values({
                id: input.id,
                postId: input.postId,
                userId: input.userId,
                isLike: true,
            }).returning({ id: postLike.id, postId: postLike.postId, userId: postLike.userId, isLike: postLike.isLike }).then
        })
})
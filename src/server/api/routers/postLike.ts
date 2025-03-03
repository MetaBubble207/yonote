import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentTime } from "@/app/_utils/getCurrentTime";
import { and } from "drizzle-orm";

export const postLikeRouter = createTRPCRouter({
  // 获取用户点赞的数据
  getLikeState: publicProcedure
    .input(z.object({ postId: z.number(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const isLike = await ctx.db
        .select()
        .from(postLike)
        .where(
          and(
            eq(postLike.postId, input.postId),
            eq(postLike.userId, input.userId),
          ),
        );
      const likeCount = (await ctx.db
        .select()
        .from(postLike)
        .where(
          and(eq(postLike.postId, input.postId), eq(postLike.isLike, true)),
        )).length ?? 0;
      return { isLike: isLike[0]?.isLike ?? false, likeCount, };
    }),

  // 获取文章点赞数量
  getLikeCount: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(postLike)
        .where(
          and(eq(postLike.postId, input.postId), eq(postLike.isLike, true)),
        );
      return data.length;
    }),

  // 点赞
  like: publicProcedure
    .input(z.object({ postId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 查询是否已经点赞
      const data = await ctx.db
        .select()
        .from(postLike)
        .where(
          and(
            eq(postLike.postId, input.postId),
            eq(postLike.userId, input.userId),
          ),
        );
      if (data.length) {
        await ctx.db
          .update(postLike)
          .set({ isLike: !data[0]!.isLike, updatedAt: getCurrentTime() })
          .where(
            and(
              eq(postLike.postId, input.postId),
              eq(postLike.userId, input.userId),
            ),
          );
      } else {
        await ctx.db
          .insert(postLike)
          .values({
            postId: input.postId,
            userId: input.userId,
            isLike: true,
          });
      }
      return {
        status: 200,
        message: "success",
      };
    }),
});

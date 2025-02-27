import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike, user, post, column } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";

// 获取专栏点赞量
export const getColumnsLikeFC = async (
  db: PostgresJsDatabase<typeof schema>,
  columnId: string,
) => {
  const result = await db
    .select({
      likeCount: sql<number>`count(${postLike.id})`,
    })
    .from(post)
    .leftJoin(
      postLike,
      and(
        eq(post.id, postLike.postId),
        eq(postLike.isLike, true)
      )
    )
    .where(eq(post.columnId, columnId))
    .groupBy(post.columnId);

  return result[0]?.likeCount ?? 0;
};

export const postLikeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  // 获取当前的postid
  getPostId: publicProcedure
    .input(z.object({ id: z.string(), chapter: z.number() }))
    .query(async ({ ctx, input }) => {
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
      const postId = data[input.chapter - 1].id;
      return postId;
    }),

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

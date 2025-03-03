// 导入Next.js API路由需要的依赖
import { NextApiRequest, NextApiResponse } from "next";
import { post } from "@/server/db/schema"; // 导入数据库连接函数
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { getCurrentTime } from "@/app/_utils/getCurrentTime";

export const draftRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        tag: z.string(),
        status: z.boolean(),
        columnId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(post)
        .values({
          name: input.name,
          content: input.content,
          tag: input.tag,
          columnId: input.columnId,
          status: false,
          updatedAt: getCurrentTime(),
        })
        .returning({
          name: post.name,
          content: post.content,
          tag: post.tag,
          status: post.status,
        });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(post).where(eq(post.status, false));
  }),

  delete: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      ctx.db.delete(post).where(eq(post.name, input.name));
    }),
});

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { post } from "@/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation( async ({ ctx, input }) => {

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return await ctx.db.insert(post).values({
        name: input.name,
      }).returning({name: post.name});
    }),

  getLatest: publicProcedure.query(async({ ctx }) => {
    return await ctx.db.query.post.findFirst({
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });
  }),
});

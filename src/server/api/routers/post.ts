import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { post } from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1),   
      content: z.string(),
      tag: z.string(),
      status: z.boolean(),}))
    .mutation( async ({ ctx, input }) => {

      await new Promise((resolve) => setTimeout(resolve, 1000));
      ctx.db.select().from(post).where(eq(post.name, input.name))
      return await ctx.db.insert(post).values({
        name: input.name,
        content: input.content,
        tag: input.tag,
        status: true,
      }).returning({name: post.name,content:post.content,tag:post.tag,status:post.status});
    }),


  deletePost:publicProcedure.input(z.object({id:z.number()}))
      .mutation(({ctx,input})=>{
          ctx.db.delete(post).where(eq(post.id,input.id))
      }),
  getLatest: publicProcedure.query(async({ ctx }) => {
    return await ctx.db.query.post.findFirst({
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });
  }),

  getAll: publicProcedure
  .query(({ ctx})=>{
  return ctx.db.select().from(post)
  }),

});

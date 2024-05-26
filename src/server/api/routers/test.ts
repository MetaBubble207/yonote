import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { post } from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const testRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({id:z.number(),name:z.string(),content:z.string()})).mutation(
        async ({ctx,input}) => {

            const data = await ctx.db.insert(post).values({
                name:input.name,
                content:input.content,
            }).returning({name:post.name})
            //
            // ctx.db.update(post).set({
            //
            // }).where(eq(post.id,input.id))
            //
            // ctx.db.delete(post).where(eq())
            //
            // ctx.db.select().from(post).where(eq())
        }
    ),
    getAll: publicProcedure.query(({ctx}) => {
      return ctx.db.select().from(post)
    })
});

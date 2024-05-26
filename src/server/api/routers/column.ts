import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {column} from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const columnRouter = createTRPCRouter({

  create: publicProcedure.input(z.object({
    id:z.number(),
    name: z.string()
  })).mutation(({ctx,input}) => {

   return  ctx.db.insert(column).values({
      id: input.id,
      name: input.name
    }).returning({id:column.id,name:column.name})
  }),

    getAll: publicProcedure
        .input(z.object({id:z.number()}))
        .query(({ctx,input})=>{
            console.log(input.id)
        return ctx.db.select().from(column).where(eq(column.id,input.id))
    })
});

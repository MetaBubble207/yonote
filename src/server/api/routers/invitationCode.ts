import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {column, invitationCode, post} from "@/server/db/schema";
import {eq} from "drizzle-orm";
import { z } from "zod";
export const invitationCodeRouter = createTRPCRouter({

    create: publicProcedure
        .input(z.object({id:z.string(),name:z.string(),price:z.number(),userId:z.string()}))
        .mutation(async ({ ctx,input})=>{
            const code = await ctx.db.select().from(invitationCode).where(eq(invitationCode.value, input.id))
            if(code.length < 1){
                return false;
            }
            const col = await ctx.db.select().from(column).where(eq(column.id, input.id))
            console.log(col.length)
            if(!col || col.length > 1){
               return false
            }
            return ctx.db.insert(column).values({
                id: input.id,
                name: input.name,
                price: input.price,
                userId: input.userId,
            })
        }),
})

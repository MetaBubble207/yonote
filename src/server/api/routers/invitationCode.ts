import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {invitationCode, post} from "@/server/db/schema";
import {eq} from "drizzle-orm";
import { z } from "zod";
export const invitationCodeRouter = createTRPCRouter({

    getAll: publicProcedure
        .input(z.object({id:z.string()}))
        .query(({ ctx,input})=>{
            return ctx.db.select().from(invitationCode).where(eq(invitationCode.value, input.id))
        }),
})
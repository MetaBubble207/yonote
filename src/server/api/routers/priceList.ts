import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {priceList} from "@/server/db/schema";
import {eq} from "drizzle-orm";


export const priceListRouter = createTRPCRouter({
    getByColumnId: publicProcedure
        .input(z.object({ columnId: z.string() }))
        .query(({ ctx ,input}) => {
            return ctx.db.select().from(priceList).where(eq(priceList.columnId, input.columnId));
        }),
    delById: publicProcedure
        .input(z.object({id:z.number()}))
        .mutation(({ ctx, input }) => {
            return ctx.db.delete(priceList).where(eq(priceList.id, input.id));
        })
});

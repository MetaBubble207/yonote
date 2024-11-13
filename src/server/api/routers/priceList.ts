import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {type PriceList, priceList} from "@/server/db/schema";
import {eq} from "drizzle-orm";


export const priceListRouter = createTRPCRouter({
    getByColumnId: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query( async ({ctx, input}): Promise<PriceList[]> => {
            let res:PriceList[] = [];
            const data = await ctx.db.select().from(priceList).where(eq(priceList.columnId, input.columnId));
            if(data.length !== 0 ){
                res.push(...data);
                return res;
            }else{
                return res;
            }
        }),
    delById: publicProcedure
        .input(z.object({id: z.number()}))
        .mutation(({ctx, input}) => {
            return ctx.db.delete(priceList).where(eq(priceList.id, input.id));
        })
});

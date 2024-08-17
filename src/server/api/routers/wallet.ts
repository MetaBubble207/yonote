import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {runningWater, wallet} from "@/server/db/schema";
import {eq} from "drizzle-orm";


export const walletRouter = createTRPCRouter({
    getByUserId: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            return ctx.db.query.wallet.findFirst({
                where: eq(wallet.userId, input.id)
            });
        }),
    withdraw: publicProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ctx, input}) => {
            const walletData = await ctx.db.query.wallet.findFirst({where: eq(wallet.userId, input.id)});
            await ctx.db.update(wallet).set({
                amountWithdraw: 0
            });
            await ctx.db.update(runningWater).set({
                userId: input.id,
                price: walletData.amountWithdraw,
                name: '',
                expenditureOrIncome: 0
            })
            return walletData;
        })
});

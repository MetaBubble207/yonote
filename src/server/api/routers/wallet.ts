import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {wallet} from "@/server/db/schema";
import {eq} from "drizzle-orm";


export const walletRouter = createTRPCRouter({
    getByUserId: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            return ctx.db.query.wallet.findFirst({
                where: eq(wallet.userId, input.id)
            });
        })
});

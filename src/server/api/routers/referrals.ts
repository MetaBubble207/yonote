import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {eq} from "drizzle-orm";
import {referrals} from "@/server/db/schema";

export const referralsRouter = createTRPCRouter({
    getByColumnId: publicProcedure
        .input(z.string())
        .query(({ctx, input}) => {
            return ctx.db.query.referrals.findMany({
                where: eq(referrals.columnId, input)
            })
        }),
    add: publicProcedure
        .input(z.object({columnId: z.string(), userId: z.string(), referredUserId: z.string()}))
        .mutation(({ctx, input}) => {
            return ctx.db.insert(referrals).values({
                columnId: input.columnId,
                userId: input.userId,
                referredUserId: input.referredUserId
            })
        }),
});

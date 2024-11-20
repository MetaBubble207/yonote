import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {and, eq} from "drizzle-orm";
import {referrals, SpeedUp} from "@/server/db/schema";
import {createCaller} from "@/server/api/root";

export const referralsRouter = createTRPCRouter({
    getByColumnId: publicProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            const caller = createCaller(ctx);
            const res: SpeedUp[] = [];
            const referralsList = await ctx.db.query.referrals.findMany({
                where: eq(referrals.columnId, input),
            });
            // 使用 Map 按照 referredUserId 去重
            const uniqueReferrals = Array.from(
                new Map(referralsList.map(item => [item.referredUserId, item])).values()
            );
            const promise = uniqueReferrals.map(async (referral, index) => {
                const price = await caller.order.getTotalPriceByReferralId(referral.referredUserId);
                const user = await caller.users.getOne({id: referral.referredUserId});
                res.push({
                    id: index + 1,
                    avatar: user.avatar,
                    username: user.name,
                    userId: user.id,
                    acceleratedTotal: price.length,
                    totalPrice: price.reduce((acc, curr) => acc + curr, 0)
                })
            })
            await Promise.all(promise);
            return res;
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

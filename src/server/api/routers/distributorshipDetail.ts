import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";
import {distributorshipDetail} from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const distributorshipDetailRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.object({columnId: z.number()}))
        .query(({input, ctx}) => {
            return ctx.db.query.distributorshipDetail.findFirst({
                where: eq(distributorshipDetail.columnId, input.columnId),
            })
        }),
    update: publicProcedure
        .input(z.object({columnId: z.number(), distributorship: z.number(), extend: z.number(), isVip: z.boolean()}))
        .mutation(async ({input, ctx}) => {
            const {columnId, distributorship, extend, isVip} = input;
            const platDistributorship = isVip ? 0.09 : 0.15;
            if (distributorship + extend > 70) {
                throw new Error('经销分成加推广分成比例超过百分之70');
            }
            return ctx.db.update(distributorshipDetail).set({
                platDistributorship: platDistributorship,
                distributorship: distributorship,
                extend: extend,
            }).where(eq(distributorshipDetail.columnId, columnId));
        })
});

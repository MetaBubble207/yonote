import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { runningWater } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const runningWaterRouter = createTRPCRouter({
  getRunningWaterByExpenditureOrIncome: publicProcedure
    .input(z.object({ id: z.string(), expenditureOrIncome: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(runningWater)
        .where(
          and(
            eq(runningWater.userId, input.id),
            eq(runningWater.expenditureOrIncome, input.expenditureOrIncome),
          ),
        );
    }),
  getRunningWater: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(runningWater)
        .where(eq(runningWater.userId, input.id));
    }),
  addRunningWater: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        price: z.number(),
        expenditureOrIncome: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      ctx.db.insert(runningWater).values({
        userId: input.userId,
        price: input.price,
        expenditureOrIncome: input.expenditureOrIncome,
      });
    }),
});

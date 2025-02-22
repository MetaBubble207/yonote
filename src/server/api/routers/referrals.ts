import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, eq } from "drizzle-orm";
import { referrals, type SpeedUp } from "@/server/db/schema";
import { createCaller } from "@/server/api/root";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";

export const getOneByUserIdAndColumnId = (
  db: PostgresJsDatabase<typeof schema>,
  id: string,
  columnId: string,
) => {
  return db.query.referrals.findFirst({
    where: and(eq(referrals.userId, id), eq(referrals.columnId, columnId)),
  });
};

export const referralsRouter = createTRPCRouter({
  getByColumnId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const caller = createCaller(ctx);
      const res: SpeedUp[] = [];
      const referralsList = await ctx.db.query.referrals.findMany({
        where: eq(referrals.columnId, input),
      });
      // 使用 Map 按照 referredUserId 去重
      const uniqueReferrals = Array.from(
        new Map(
          referralsList.map((item) => [item.referredUserId, item]),
        ).values(),
      );
      const promise = uniqueReferrals.map(async (referral, index) => {
        const price = await caller.order.getTotalPriceByReferralId(
          referral.referredUserId,
        );
        const user = await caller.users.getOne({ id: referral.referredUserId });
        res.push({
          id: index + 1,
          avatar: user.avatar,
          username: user.name,
          userId: user.id,
          acceleratedTotal: price.length,
          totalPrice: price.reduce((acc, curr) => acc + curr, 0),
        });
      });
      await Promise.all(promise);
      return res;
    }),

  add: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        userId: z.string(),
        referredUserId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.query.referrals.findFirst({
        where: and(
          eq(referrals.userId, input.userId),
          eq(referrals.columnId, input.columnId),
        ),
      });
      if (data) {
        return ctx.db
          .update(referrals)
          .set({
            referredUserId: input.referredUserId,
          })
          .where(
            and(
              eq(referrals.userId, input.userId),
              eq(referrals.columnId, input.columnId),
            ),
          );
      } else {
        return ctx.db.insert(referrals).values({
          columnId: input.columnId,
          userId: input.userId,
          referredUserId: input.referredUserId,
        });
      }
    }),

  getOneByUserIdAndColumnId: publicProcedure
    .input(z.object({ columnId: z.string(), userId: z.string() }))
    .query(({ ctx, input }) => {
      return getOneByUserIdAndColumnId(ctx.db, input.userId, input.columnId);
    }),
});

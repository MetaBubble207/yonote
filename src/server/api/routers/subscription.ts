import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { user, post, column, subscription } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
export const subscriptionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        columnId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(subscription).values({
        userId: input.userId,
        columnId: input.columnId,
        status: true,
        createdAt: getCurrentTime(),
        updatedAt: getCurrentTime(),
      });
    }),
  // 获取当前专栏所有订阅者
  getAllBuyers: publicProcedure
    // .input(z.object({limit: z.number().optional(),offset: z.number().optional(),columnId: z.string()}))
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      // return  await ctx.db.query.subscription.findMany({where: eq(subscription.columnId,input.columnId)})
      return await ctx.db
        .select()
        .from(subscription)
        .where(eq(subscription.columnId, input.columnId));
    }),
});

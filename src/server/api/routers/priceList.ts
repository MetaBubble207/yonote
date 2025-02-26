import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, priceList, wallet } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const priceListRouter = createTRPCRouter({
  getReservedData: publicProcedure
    .input(z.object({ columnId: z.string(), buyerId: z.string()}))
    .query(async ({ ctx, input }) => {
      const priceListData =  await ctx.db
      .select()
      .from(priceList)
      .where(eq(priceList.columnId, input.columnId))
      .orderBy(priceList.price)
      const columnData = await ctx.db.query.column.findFirst({ where: eq(column.id, input.columnId) });
      const walletData = await ctx.db.query.wallet.findFirst({ where: eq(wallet.userId, input.buyerId) });
      return {priceListData, columnData, walletData};
    }),
  delById: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(priceList).where(eq(priceList.id, input.id));
    }),
});

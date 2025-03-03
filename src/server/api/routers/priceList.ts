import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, priceList, wallet } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const priceListRouter = createTRPCRouter({
  getReservedData: publicProcedure
    .input(z.object({ columnId: z.string(), buyerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const priceListData = await ctx.db
        .select()
        .from(priceList)
        .where(eq(priceList.columnId, input.columnId))
        .orderBy(priceList.price)
      const columnData = await ctx.db.query.column.findFirst({ where: eq(column.id, input.columnId) });
      const walletData = await ctx.db.query.wallet.findFirst({ where: eq(wallet.userId, input.buyerId) });
      return { priceListData, columnData, walletData };
    }),
  getByColumnId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.priceList.findMany({ where: eq(priceList.columnId, input) });
    }),
});

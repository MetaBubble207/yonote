import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { wallet } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";



export const walletRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
  }),


  // 查询账户余额信息
  getBalance: publicProcedure.query(async ({ ctx }) => {
    const walletData = await ctx.db.query.wallet.findFirst();
    if (walletData) {
      const cashableAmount = (walletData.regularIncome as number) - (walletData.freezeIncome as number);

      return {
        balance: walletData.regularIncome,
        frozenAmount: walletData.freezeIncome,
        cashableAmount: cashableAmount
      };
    } else {
      return {
        balance: 0,
        frozenAmount: 0,
        cashableAmount: 0
      };
    }
  }),

  

  
});

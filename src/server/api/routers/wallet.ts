import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {wallet} from "@/server/db/schema";
import {eq} from "drizzle-orm";


export const walletRouter = createTRPCRouter({
  // 查询账户余额信息 // 错误方法
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
  getByUserId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async({ ctx ,input}) => {
        const res = await ctx.db.query.wallet.findFirst({
          where: eq(wallet.userId, input.id)
        })
        console.log("res ===>",res)
        return res;

  })
});

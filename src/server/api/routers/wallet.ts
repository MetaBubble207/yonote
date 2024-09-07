import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {runningWater, user, wallet} from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const walletRouter = createTRPCRouter({
    getByUserId: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            return ctx.db.query.wallet.findFirst({
                where: eq(wallet.userId, input.id)
            });
        }),
    withdraw: publicProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ctx, input}) => {
            const walletData = await ctx.db.query.wallet.findFirst({where: eq(wallet.userId, input.id)});
            await ctx.db.update(wallet).set({
                amountWithdraw: 0
            });
            await ctx.db.insert(runningWater).values({
                userId: input.id,
                price: walletData.amountWithdraw,
                name: '提现',
                expenditureOrIncome: 0
            })
            return walletData;
        }),

    // 充值接口
    recharge: publicProcedure
        .input(z.object({
            userId: z.string(),
            amount: z.number().min(1),   // 充值金额
        }))
        .mutation(async ({ctx, input}) => {
            try {
                const {db} = ctx;
                // // 创建微信支付订单
                // const order = await wechatPay.getJsapiSignature({
                //     description: "钱包充值",              // 订单描述
                //     out_trade_no: `order_${Date.now()}`,  // 订单号
                //     amount: {
                //         total: input.amount * 100,         // 金额单位为分
                //         currency: "CNY"
                //     },
                //     payer: {
                //         openid: input.userId            // 微信用户的openid
                //     },
                //     notify_url: "https://your-domain.com/wechat/notify"  // 支付回调地址
                // });

                // 记录流水到数据库
                await db.insert(runningWater).values({
                    userId: input.userId,
                    price: input.amount,
                    name: '充值',
                    expenditureOrIncome: 1  // 1表示收入
                });

                // return {success: true, order};  // 返回微信支付订单信息给前端
            } catch (error) {
                console.error("WeChat Pay Error:", error);
                return {success: false, message: "支付失败"};
            }
        }),
});

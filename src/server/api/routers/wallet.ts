import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {runningWater, user, wallet} from "@/server/db/schema";
import {eq} from "drizzle-orm";
import * as fs from "node:fs";
import process from "process";

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
            notifyUrl: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            try {
                const {db} = ctx;

                const Payment = require('wxpay-v3');
                const paymnet = new Payment({
                    appid: process.env.NEXT_PUBLIC_APP_ID,
                    mchid: process.env.NEXT_PUBLIC_MCH_ID,
                    private_key: require('fs').readFileSync('*_key.pem证书文件路径').toString(),//或者直接复制证书文件内容
                    serial_no:process.env.NEXT_PUBLIC_SERIAL_NO,
                    apiv3_private_key:process.env.NEXT_PUBLIC_APIV3_PRIVATE_KEY,
                    notify_url: input.notifyUrl,
                })
                let result = await paymnet.jsapi({
                    description:'充值',
                    out_trade_no:Date.now().toString(),
                    amount:{
                        total: input.amount * 100
                    },
                    payer:{
                        openid: input.userId
                    },

                })
                console.log(result);
                const sign = paymnet.paysign(result.prepay_id);
                console.log(sign)
                // 记录流水到数据库
                await db.insert(runningWater).values({
                    userId: input.userId,
                    price: input.amount,
                    name: '充值',
                    expenditureOrIncome: 1  // 1表示收入
                });

                return {success: true, data:result};  // 返回微信支付订单信息给前端
            } catch (error) {
                console.error("WeChat Pay Error:", error);
                return {success: false, message: "支付失败"};
            }
        }),
});

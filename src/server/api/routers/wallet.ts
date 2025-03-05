import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { runningWater, wallet } from "@/server/db/schema";
import { and, eq, lt, ne } from "drizzle-orm";
import crypto from "crypto";
import process from "process";
import { getCurrentTime } from "@/app/_utils/getCurrentTime";

export const walletRouter = createTRPCRouter({
  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.wallet.findFirst({
        where: eq(wallet.userId, input.id),
      });
    }),
  withdraw: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const walletData = await ctx.db.query.wallet.findFirst({
        where: eq(wallet.userId, input),
      });

      await ctx.db.update(wallet).set({
        amountWithdraw: 0,
      }).where(eq(wallet.userId, input));

      if (!walletData) return null;
      await ctx.db.insert(runningWater).values({
        userId: input,
        price: walletData.amountWithdraw,
        name: "提现",
        expenditureOrIncome: 0,
      });
      return walletData;
    }),

  // 充值接口
  recharge: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        amount: z.number().min(0.01), // 充值金额
        notifyUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Payment = require("wxpay-v3");
        const paymnet = new Payment({
          appid: process.env.NEXT_PUBLIC_APP_ID,
          mchid: process.env.NEXT_PUBLIC_MCH_ID,
          // private_key: require('fs').readFileSync('./public/apiclient_key.pem').toString(),//或者直接复制证书文件内容
          private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY, //或者直接复制证书文件内容
          serial_no: process.env.NEXT_PUBLIC_SERIAL_NO,
          apiv3_private_key: process.env.NEXT_PUBLIC_APIV3_PRIVATE_KEY,
          notify_url: input.notifyUrl,
        });
        let result = await paymnet.jsapi({
          description: "充值",
          out_trade_no: Date.now().toString(),
          amount: {
            total: input.amount * 100,
          },
          payer: {
            openid: input.userId,
          },
        });
        // 解析JSON字符串为JSON对象
        let prepayData = JSON.parse(result.data);
        // 微信支付签名相关参数
        const appId = process.env.NEXT_PUBLIC_APP_ID;
        const timeStamp = Math.floor(Date.now() / 1000).toString(); // 时间戳
        const nonceStr = crypto.randomBytes(16).toString("hex"); // 生成随机字符串
        const packageStr = `prepay_id=${prepayData.prepay_id}`; // 订单详情扩展字符串

        // 构造签名串
        const signStr = `${appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`;
        const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!.replace(
          /\\n/g,
          "\n",
        );
        // 使用私钥进行签名
        const paySign = crypto
          .createSign("RSA-SHA256")
          .update(signStr)
          .sign(privateKey, "base64"); // 签名结果
        return {
          success: true,
          message: "支付成功",
          data: {
            appId,
            timeStamp,
            nonceStr,
            package: packageStr,
            signType: "RSA",
            paySign,
          },
        };
      } catch (error) {
        console.error("WeChat Pay Error:", error);
        return { success: false, message: "支付失败", data: {} };
      }
    }),

  // 充值后增加流水和余额
  afterRecharge: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        amount: z.number().min(0.01), // 充值金额
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      // 记录流水到数据库
      await db.insert(runningWater).values({
        userId: input.userId,
        price: input.amount,
        name: "充值",
        expenditureOrIncome: 1, // 1表示收入
      });
      // 获取钱包金额
      const walletData = await db.query.wallet.findFirst({
        where: eq(wallet.userId, input.userId),
      });
      if (!walletData) return;
      // 钱包可提现金额增加
      await db
        .update(wallet)
        .set({
          amountWithdraw: walletData.amountWithdraw + input.amount,
        })
        .where(eq(wallet.userId, input.userId));
    }),

  // 检测冻结金额是否需要解冻
  checkFreezeIncome: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      // 获取流水中收入的部分，且时间超过了 24 小时的
      const twentyFourHoursAgo = new Date(getCurrentTime().getTime() - 24 * 60 * 60 * 1000);
      const runningWaterData = await db.query.runningWater.findMany({
        where: and(
          eq(runningWater.userId, input),
          eq(runningWater.expenditureOrIncome, 1),
          eq(runningWater.isFreezed, true),
          ne(runningWater.name, '充值'),
          lt(runningWater.createdAt, twentyFourHoursAgo),
        ),
      });

      // 获取钱包金额
      const walletData = await db.query.wallet.findFirst({
        where: eq(wallet.userId, input),
      });
      if (!walletData) return;
      // 检查当前冻结金额是否足够解冻，如果够，则正常操作，如果不够，则冻结金额清0，可提现金额新增冻结金额的全部
      const totalPrice = runningWaterData.reduce((acc, cur) => acc + cur.price, 0);
      if (walletData.freezeIncome > totalPrice) {
        await db
          .update(wallet)
          .set({
            freezeIncome: walletData.freezeIncome - totalPrice,
            amountWithdraw: walletData.amountWithdraw + totalPrice,
          })
          .where(eq(wallet.userId, input));
      } else {
        await db
          .update(wallet)
          .set({
            freezeIncome: 0,
            amountWithdraw: walletData.amountWithdraw + walletData.freezeIncome,
          })
          .where(eq(wallet.userId, input));
      }

      // 更新流水中的 isFreezed 字段
      await Promise.all(runningWaterData.map(async item => {
        await db
          .update(runningWater)
          .set({
            isFreezed: false,
          })
          .where(eq(runningWater.id, item.id));
      }))
    }),
});

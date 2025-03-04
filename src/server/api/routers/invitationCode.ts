import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, invitationCode, priceList } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// 定义价格策略的类型
const priceStrategySchema = z.object({
  price: z.number(),
  timeLimit: z.number(),
});

export const invitationCodeRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        userId: z.string(),
        type: z.number(),
        paymentMode: z.enum(['permanent', 'subscription']),
        permanentPrice: z.number().optional(),
        priceStrategies: z.array(priceStrategySchema).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // 验证邀请码
      const code = await db
        .select()
        .from(invitationCode)
        .where(eq(invitationCode.value, input.id));
      if (code.length < 1) {
        return false;
      }

      // 验证专栏是否已存在
      const col = await db
        .select()
        .from(column)
        .where(eq(column.id, input.id));
      if (!col || col.length > 1) {
        return false;
      }

      // 开始事务
      // TODO: 需要添加事务支持
      try {
        // 1. 创建专栏
        await db.insert(column).values({
          id: input.id,
          name: input.name,
          userId: input.userId,
          type: input.type,
        });

        // 2. 创建价格策略
        if (input.paymentMode === 'permanent' && input.permanentPrice) {
          // 永久买断模式
          await db.insert(priceList).values({
            columnId: input.id,
            price: input.permanentPrice,
            timeLimit: 999999, // 永久买断使用最大天数
          });
        } else if (input.paymentMode === 'subscription' && input.priceStrategies) {
          // 限时订阅模式
          const priceStrategies = input.priceStrategies.map(strategy => ({
            columnId: input.id,
            price: strategy.price,
            timeLimit: strategy.timeLimit,
          }));
          
          // 批量插入价格策略
          await db.insert(priceList).values(priceStrategies);
        }

        return true;
      } catch (error) {
        console.error('Create column error:', error);
        return false;
      }
    }),
});

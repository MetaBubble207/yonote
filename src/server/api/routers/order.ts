import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { order } from "@/server/db/schema"; 
import { eq } from "drizzle-orm";

export const orderRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // 获取订单信息
  getOrderById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const orderData = await ctx.db.query.order.findFirst({
        where: eq(order.id, input.id),
      });
      if (!orderData) {
        throw new Error("Order not found");
      }
      return orderData;
    }),

  // 获取所有订单
  getAllOrders: publicProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.query.order.findMany({
        limit: input.limit,
        offset: input.offset,
      });
      return orders;
    }),

 
});

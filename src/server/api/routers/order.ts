import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, order } from "@/server/db/schema";
import { eq , and} from "drizzle-orm";

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
  getOrder: publicProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.query.order.findMany({
        limit: input.limit,
        offset: input.offset,
      });
      return orders;
    }),

// 创建订单
  createOrder: publicProcedure
    .input(z.object({
      ownerID: z.string(),
      columnID: z.string(),
      price: z.number(),
      payment: z.string(),
      status: z.boolean(),
      buyerID: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 查询订单是否已存在
        const existingOrder = await ctx.db.select().from(order).where(and(eq(order.name, input.name),eq(order.buyerID,input.buyerID)));

        // 如果订单不存在，则插入新订单
        if (existingOrder.length === 0) {
          const insertedOrder = await ctx.db.insert(order).values({
            ownerID: input.ownerID,
            name: input.name,
            columnID: input.columnID,
            price: input.price,
            payment: input.payment,
            status: input.status,
            buyerID: input.buyerID,
          }).returning({
            id: order.id,
            ownerID: order.ownerID,
            name: order.name,
            price: order.price,
            payment: order.payment,
            status: order.status,
            buyerID: order.buyerID,
            columnID: order.columnID,
          });

          return insertedOrder[0]; // 返回插入的订单对象
        } else {
          throw new Error("Order already exists!"); // 如果订单已存在，则抛出异常
        }
      } catch (error) {
        console.error("Error creating order:", error);
        throw error; // 抛出异常，让上层处理
      }
    }),

    // 同一订单的信息
    getColumnOrder: publicProcedure
    .input(z.object({
      columnID: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const orderData = await ctx.db.query.order.findMany({
        where:  eq(order.name, input.columnID ),
      });
      return orderData;
    }),

    getUserOrder: publicProcedure
    .input(z.object({
      userID: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const orderData = await ctx.db.select().from(order).where(and(eq(order.buyerID, input.userID), eq(order.status, true)))
      return orderData;
    })

});

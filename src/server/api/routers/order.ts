import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {column, order, subscription, user} from "@/server/db/schema";

;
import {eq, and, inArray} from "drizzle-orm";

export const orderRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({text: z.string()}))
        .query(({input}) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    // 获取订单信息
    getOrderById: publicProcedure
        .input(z.object({id: z.number()}))
        .query(async ({ctx, input}) => {
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
        .input(z.object({limit: z.number().optional(), offset: z.number().optional()}))
        .query(async ({ctx, input}) => {
            const orders = await ctx.db.query.order.findMany({
                limit: input.limit,
                offset: input.offset,
            });
            return orders;
        }),
    // 通过用户ID跟ColumnID查询订单
    getOrderByUCId: publicProcedure
        .input(z.object({buyerId: z.string(), columnId: z.string()}))
        .query(async ({ctx, input}) => {
                const orders = await ctx.db.query.order.findMany(
                    {where: and(eq(order.buyerId, input.buyerId), eq(order.columnId, input.columnId))}
                );
                return orders
            }
        ),
    // 通过ColumnID查询订单表中的用户
    getOrderByColumnId: publicProcedure.input(z.object({ columnId: z.string() }))
        .query(async ({ ctx, input }) => {
            // 查询订单表中的匹配记录
            const orders = await ctx.db.query.order.findMany({
                where: eq(order.columnId, input.columnId)
            });

            const buyerIds = orders.map(order => order.buyerId);

            // 查询用户信息
            const users = await ctx.db.select({
                id: user.id,
                avatar: user.avatar,
                name: user.name,
                idNumber: user.idNumber
            }).from(user).where(inArray(user.id, buyerIds));

            // 创建用户字典
            const userMap = users.reduce((acc, usr) => {
                acc[usr.id] = usr;
                return acc;
            }, {});

            // 查询订阅信息
            const subscriptions = await ctx.db.select({
                buyerId: order.buyerId,
                status: order.status,
                createdAt: order.createdAt,
                endDate: order.endDate
            }).from(order).where(and(
                inArray(order.buyerId, buyerIds),
                eq(order.columnId, input.columnId)
            ));

            // 合并用户信息和订阅信息
            const combinedResults = subscriptions.map(subscription => ({
                ...subscription,
                user: userMap[subscription.buyerId]
            }));

            return combinedResults;
        }),




// 创建订单
    createOrder: publicProcedure
        .input(z.object({
            ownerId: z.string(),
            columnId: z.string(),
            price: z.number(),
            payment: z.string(),
            status: z.boolean(),
            buyerId: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // 查询订单是否已存在
                const existingOrder = await ctx.db.select().from(order).where(and(eq(order.columnId, input.columnId), eq(order.buyerId, input.buyerId)));

                // 如果订单不存在，则插入新订单
                if (existingOrder.length === 0) {
                    const insertedOrder = await ctx.db.insert(order).values({
                        ownerId: input.ownerId,
                        columnId: input.columnId,
                        price: input.price,
                        payment: input.payment,
                        status: input.status,
                        buyerId: input.buyerId,
                    }).returning({
                        id: order.id,
                        ownerId: order.ownerId,
                        price: order.price,
                        payment: order.payment,
                        status: order.status,
                        buyerId: order.buyerId,
                        columnId: order.columnId,
                    });

                    // 创建订单时向订阅表写入数据
                    const insertSubscription = await ctx.db.insert(subscription).values({
                        userId: input.buyerId,
                        columnId: input.columnId,
                        status: input.status
                    })


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
            columnId: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const orderData = await ctx.db.query.order.findMany({
                where: eq(order.columnId, input.columnId),
            });
            return orderData;
        }),

    getUserOrder: publicProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const orderData = await ctx.db.select().from(order).where(and(eq(order.buyerId, input.userId), eq(order.status, true)))
            return orderData;
        }),

    // 更新订阅状态
    updateStatus: publicProcedure
        .input(z.object({
            userId: z.string(),
            status: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.update(order)
                .set({ status: !input.status })
                .where(eq(order.buyerId, input.userId))
                .returning({
                    buyerId: order.buyerId,
                    status: order.status,
                });

            return result[0]; // 确保只返回更新后的单个对象
        }),

    // 查看用户是否购买专栏
    getUserStatus: publicProcedure
        .input(z.object({
            userId: z.string(),
            columnId: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const MyColumn = await ctx.db.query.column.findFirst({
                where: and(eq(column.id, input.columnId), eq(column.userId, input.userId))
            })
            if (MyColumn) {
                return true
            } else {
                const list = await ctx.db.query.order.findFirst({
                    where: and(eq(order.columnId, input.columnId), eq(order.buyerId, input.userId))
                })
                if (list) {
                    const status = list.status
                    return status;
                } else {
                    return false;
                }
            }


        }),

});

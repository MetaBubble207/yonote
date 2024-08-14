import {z} from "zod";
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {column, order, priceList, referrals, subscription, user, wallet} from "@/server/db/schema";

;
import {eq, and, inArray, gte, lte, between, like, sql} from "drizzle-orm";
import {addDays, format} from "date-fns";

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
        .input(z.object({
            buyerId: z.string(),
            columnId: z.string(),
            status: z.boolean().optional(),
            startPick: z.string().optional(),
            endPick: z.string().optional()
        }))
        .query(async ({ctx, input}) => {
                const orders = await ctx.db.query.order.findMany(
                    {where: and(eq(order.buyerId, input.buyerId), eq(order.columnId, input.columnId))}
                );
                return orders
            }
        ),

    // 测试用例
    getOrderByUCIdTest: publicProcedure
        .input(z.object({
            buyerId: z.string(),
            columnId: z.string(),
            status: z.boolean().optional(),
            startPick: z.string().optional(),
            endPick: z.string().optional()
        }))
        .query(async ({ctx, input}) => {
                // 初始化where条件数组
                const conditions = [
                    eq(order.buyerId, input.buyerId),
                    eq(order.columnId, input.columnId)
                ];

                // 根据可选参数动态添加条件
                if (input.status !== undefined) {
                    conditions.push(eq(order.status, input.status));
                }

                if (input.startPick) {
                    conditions.push(gte(order.createdAt, new Date(input.startPick)));
                }

                if (input.endPick) {
                    conditions.push(lte(order.createdAt, new Date(input.endPick)));
                }

                const orders = await ctx.db.query.order.findMany(
                    {where: and(eq(order.buyerId, input.buyerId), eq(order.columnId, input.columnId))}
                );
                return orders
            }
        ),


    // 通过ColumnID查询订单表中的用户
    getOrderByColumnId: publicProcedure.input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
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


    // Test
    getOrderByColumnIdTest: publicProcedure.input(z.object({
        columnId: z.string(),
        buyerId: z.string().optional(),
        status: z.boolean().optional(),
        startPick: z.string().optional(),
        endPick: z.string().optional(),
        pageSize: z.number().default(10),
        currentPage: z.number().default(1),
    }))
        .query(async ({ctx, input}) => {
            const conditions = [
                eq(order.columnId, input.columnId)
            ];

            if (input.status !== undefined && input.status !== null) {
                conditions.push(eq(order.status, input.status));
            }

            if (input.buyerId) {
                const selectedUserIdNum = await ctx.db.select({id: user.id}).from(user).where(like(user.idNumber, `${input.buyerId}%`));
                if (selectedUserIdNum.length > 0) {
                    conditions.push(inArray(order.buyerId, selectedUserIdNum.map(u => u.id)));
                } else {
                    // 如果没有匹配的用户，返回空结果
                    return {data: [], total: 0};
                }
            }

            if (input.startPick && input.endPick) {
                const startDate = new Date(input.startPick);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(input.endPick);
                endDate.setHours(23, 59, 59, 999);

                conditions.push(between(order.createdAt, startDate, endDate));
            }

            const pageSize = input.pageSize;
            const currentPage = input.currentPage;
            const offset = (currentPage - 1) * pageSize;

            const totalOrdersCountResult = await ctx.db.select({
                count: sql<number>`count(*)`.as('count')
            }).from(order).where(and(...conditions));

            const totalOrdersCount = totalOrdersCountResult[0]?.count || 0;

            const orders = await ctx.db.query.order.findMany({
                where: and(...conditions),
                limit: pageSize,
                offset: offset
            });

            const buyerIds = orders.map(order => order.buyerId);
            if (buyerIds.length === 0) {
                return {data: [], total: totalOrdersCount};
            }

            const users = await ctx.db.select({
                id: user.id,
                avatar: user.avatar,
                name: user.name,
                idNumber: user.idNumber
            }).from(user).where(inArray(user.id, buyerIds));

            const userMap = users.reduce((acc, usr) => {
                acc[usr.id] = usr;
                return acc;
            }, {});

            const subscriptions = await ctx.db.select({
                buyerId: order.buyerId,
                status: order.status,
                createdAt: order.createdAt,
                endDate: order.endDate
            }).from(order).where(and(
                inArray(order.buyerId, buyerIds),
                eq(order.columnId, input.columnId)
            ));

            const combinedResults = subscriptions.map(subscription => ({
                ...subscription,
                user: userMap[subscription.buyerId]
            }));

            return {data: combinedResults, total: totalOrdersCount};
        }),


    // 创建订单
    createOrder: publicProcedure
        .input(z.object({
            ownerId: z.string(),
            columnId: z.string(),
            priceListId: z.number(),
            payment: z.string(),
            status: z.boolean(),
            buyerId: z.string(),
            referrerId: z.union([z.string(),z.null(),z.undefined()])
        }))
        .mutation(async ({ctx, input}) => {
            try {
                // 查询专栏信息
                const columnData = await ctx.db.query.column
                    .findFirst({where: eq(column.id, input.columnId)});
                // 获取作者钱包
                const authorWalletData = await ctx.db.query.wallet
                    .findFirst({where: eq(wallet.userId, columnData.userId)});
                // 查询专栏价目表
                const priceListData = await ctx.db.query.priceList
                    .findFirst({where: eq(priceList.id, input.priceListId)});
                const endDate = addDays(new Date(), priceListData.timeLimit);

                // 钱包减少，优先扣除冻结金额，如果不够，就从可提现金额里面去扣除剩余的
                // 先查询购买者冻结金额和可提现金额
                const buyerWalletData = await ctx.db.query.wallet
                    .findFirst({where: eq(wallet.userId, input.buyerId)});
                // 如果冻结金额大于专栏价格，直接就扣除冻结金额的
                if (buyerWalletData.freezeIncome > priceListData.price) {
                    await ctx.db.update(wallet).set({
                        freezeIncome: buyerWalletData.freezeIncome - priceListData.price,
                    }).where(eq(wallet.userId, input.buyerId))
                } else if (buyerWalletData.freezeIncome + buyerWalletData.amountWithdraw > priceListData.price) {
                    await ctx.db.update(wallet).set({
                        freezeIncome: 0,
                        amountWithdraw: buyerWalletData.amountWithdraw - buyerWalletData.freezeIncome - priceListData.price,
                    }).where(eq(wallet.userId, input.buyerId))
                } else {
                    return {status: "fail", meg: "余额不足"}
                }
                // 推荐表新增推荐人
                if (input.referrerId && input.referrerId !== "") {
                    await ctx.db.insert(referrals).values({
                        userId: input.buyerId,
                        columnId: input.columnId,
                        referredUserId: input.referrerId
                    })
                    // 推荐人钱包增加
                    // 查找一级分销的人的钱包
                    const firstClassReferrerWalletData = await ctx.db.query.wallet
                        .findFirst({where: eq(wallet.userId, input.referrerId)});
                    // 查看有无二级分销
                    const referralsData = await ctx.db.query.referrals
                        .findFirst({where: and(eq(referrals.userId, input.referrerId), eq(referrals.columnId, input.columnId))});
                    if (referralsData) {
                        // 有二级分销
                        // 查找二级推荐人的钱包
                        const secondClassReferrerWalletData = await ctx.db.query.wallet
                            .findFirst({where: eq(wallet.userId, referralsData.userId)});
                        // 作者拿30%的钱
                        await ctx.db.update(wallet).set({
                            freezeIncome: authorWalletData.freezeIncome + priceListData.price * 0.3
                        }).where(eq(wallet.userId, columnData.userId))
                        // 一级分销拿50%
                        await ctx.db.update(wallet).set({
                            freezeIncome: firstClassReferrerWalletData.freezeIncome + priceListData.price * 0.5
                        }).where(eq(wallet.userId, firstClassReferrerWalletData.userId))
                        // 二级分销拿20%
                        await ctx.db.update(wallet).set({
                            freezeIncome: secondClassReferrerWalletData.freezeIncome + priceListData.price * 0.2
                        }).where(eq(wallet.userId, secondClassReferrerWalletData.userId))
                        // 新建订单
                        const insertedOrder = await ctx.db.insert(order).values({
                            ownerId: input.ownerId,
                            columnId: input.columnId,
                            price: priceListData.price,
                            endDate: endDate,
                            payment: input.payment,
                            status: input.status,
                            buyerId: input.buyerId,
                            recommendationId: input.referrerId,
                            referralLevel: 2,
                        });
                        return insertedOrder;
                    } else {
                        // 只有一级分销
                        // 作者拿50%的钱
                        await ctx.db.update(wallet).set({
                            freezeIncome: authorWalletData.freezeIncome + priceListData.price * 0.5
                        }).where(eq(wallet.userId, columnData.userId));
                        // 一级分销拿50%
                        await ctx.db.update(wallet).set({
                            freezeIncome: firstClassReferrerWalletData.freezeIncome + priceListData.price * 0.5
                        }).where(eq(wallet.userId, firstClassReferrerWalletData.userId));

                        const insertedOrder = await ctx.db.insert(order).values({
                            ownerId: input.ownerId,
                            columnId: input.columnId,
                            price: priceListData.price,
                            endDate: endDate,
                            payment: input.payment,
                            status: input.status,
                            buyerId: input.buyerId,
                            recommendationId: input.referrerId,
                            referralLevel: 1,
                        });
                        return insertedOrder;
                    }
                } else {
                    // 没有人推荐，单独购买
                    // 作者拿100%的钱
                    await ctx.db.update(wallet).set({
                        freezeIncome: authorWalletData.freezeIncome + priceListData.price
                    }).where(eq(wallet.userId, columnData.userId));
                    // 插入到新表
                    const insertedOrder = await ctx.db.insert(order).values({
                        ownerId: input.ownerId,
                        columnId: input.columnId,
                        price: priceListData.price,
                        endDate: endDate,
                        payment: input.payment,
                        status: input.status,
                        buyerId: input.buyerId,
                        referralLevel: 0,
                    });
                    return insertedOrder;
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

    // 根据用户ID 查询订单
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
            columnId: z.string()
        }))
        .mutation(async ({ctx, input}) => {
            const result = await ctx.db.update(order)
                .set({status: !input.status})
                .where(and(eq(order.buyerId, input.userId), eq(order.columnId, input.columnId)))
                .returning({
                    buyerId: order.buyerId,
                    status: order.status,
                    columnId: order.columnId
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

    changeStatus: publicProcedure
        .input(z.object({columnId: z.string(), isVisable: z.boolean(), userId: z.string()}))
        .mutation(async ({ctx, input}) => {
            const orders = await ctx.db.select().from(order).where(and(eq(order.columnId, input.columnId), eq(order.buyerId, input.userId)));
            if (orders.length === 0) {
                throw new Error("该columnId在order表中不存在");
            }

            return ctx.db.update(order).set({
                isVisable: input.isVisable,
            }).where(eq(order.columnId, input.columnId));
        }),

    getUserOrderDefault: publicProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const orderData = await ctx.db.select().from(order).where(eq(order.buyerId, input.userId))
            return orderData;
        }),

});

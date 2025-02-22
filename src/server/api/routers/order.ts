import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
    column,
    order, type OrderBuyer, post, type PostDetail, postLike, postRead,
    priceList,
    referrals,
    runningWater,
    user,
    wallet
} from "@/server/db/schema";
import type * as schema from "../../db/schema";
import { and, between, eq, gt, inArray, like, lt, sql } from "drizzle-orm";
import { addDays } from "date-fns";
import {
    getCurrentTime,
    getLastMonthDates,
    getLastWeekDates,
    getTodayMidnight,
    getYesterdayMidnight
} from "@/tools/getCurrentTime";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { createCaller } from "@/server/api/root";
import { getOneUser } from "@/server/api/routers/user";
import { getOneByUserIdAndColumnId } from "@/server/api/routers/referrals";
import { getOneDistributorshipDetail } from "@/server/api/routers/distributorshipDetail";
// 检查该订阅状态是否需要更新，即过期日期已经截止了，但是状态还是true
const checkSubscriptionStatus = async (db: PostgresJsDatabase<typeof schema>, id: number): Promise<boolean> => {
    const o = await db.query.order.findFirst({
        where: and(
            eq(order.id, id),
            eq(order.status, true)
        )
    })
    console.log(o)
    if (!o?.endDate) {
        return false;
    }

    return o.endDate < getCurrentTime();

};

// 让该订阅过期
const expireSubscription = (db: PostgresJsDatabase<typeof schema>, id: number) => {
    return db.update(order).set({
        status: false
    }).where(eq(order.id, id))
}
export const orderRouter = createTRPCRouter({
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
        .query(async ({ ctx, input }) => {
            const conditions = [
                eq(order.columnId, input.columnId)
            ];

            if (input.status !== undefined && input.status !== null) {
                conditions.push(eq(order.status, input.status));
            }

            if (input.buyerId) {
                const selectedUserIdNum = await ctx.db.select({ id: user.id }).from(user).where(like(user.idNumber, `${input.buyerId}%`));
                if (selectedUserIdNum.length > 0) {
                    conditions.push(inArray(order.buyerId, selectedUserIdNum.map(u => u.id)));
                } else {
                    // 如果没有匹配的用户，返回空结果
                    return { data: [], total: 0 };
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
                return { data: [], total: totalOrdersCount };
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

            return { data: combinedResults, total: totalOrdersCount };
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
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                // 查询专栏信息
                const columnData = await ctx.db.query.column
                    .findFirst({ where: eq(column.id, input.columnId) });
                if (!columnData) return { status: "fail", meg: "没有找到该专栏" }
                // 获取作者钱包
                const authorWalletData = await ctx.db.query.wallet
                    .findFirst({ where: eq(wallet.userId, columnData.userId!) });
                if (!authorWalletData) return { status: "fail", meg: "没有找到该作者钱包" }
                // 获取作者身份，是否是vip
                const author = await getOneUser(ctx.db, authorWalletData.userId);
                if (!author) return { status: "fail", meg: "没有找到该作者" }
                const isVip = author.idType === 1;
                // 查询专栏价目表
                const priceListData = await ctx.db.query.priceList
                    .findFirst({ where: eq(priceList.id, input.priceListId) });
                if (!priceListData) return { status: "fail", meg: "没有找到该专栏价目表" }
                const endDate = addDays(new Date(), priceListData.timeLimit!);

                // 钱包减少，优先扣除冻结金额，如果不够，就从可提现金额里面去扣除剩余的
                // 先查询购买者冻结金额和可提现金额
                const buyerWalletData = await ctx.db.query.wallet
                    .findFirst({ where: eq(wallet.userId, input.buyerId) });
                if (!buyerWalletData) return { status: "fail", meg: "没有找到该购买者钱包" }
                // 如果冻结金额大于专栏价格，直接就扣除冻结金额的
                if (buyerWalletData.freezeIncome! > priceListData.price!) {
                    await ctx.db.update(wallet).set({
                        freezeIncome: buyerWalletData.freezeIncome! - priceListData.price!,
                    }).where(eq(wallet.userId, input.buyerId));

                } else if (buyerWalletData.freezeIncome! + buyerWalletData.amountWithdraw! > priceListData.price!) {
                    await ctx.db.update(wallet).set({
                        freezeIncome: 0,
                        amountWithdraw: buyerWalletData.amountWithdraw! + buyerWalletData.freezeIncome! - priceListData.price!,
                    }).where(eq(wallet.userId, input.buyerId))
                } else {
                    return { status: "fail", meg: "余额不足" }
                }

                // 支出购买专栏
                await ctx.db.insert(runningWater).values(
                    {
                        userId: input.buyerId,
                        price: priceListData.price,
                        name: `购买专栏${columnData.name}`,
                        expenditureOrIncome: 0
                    }
                )
                // 查找有没有推荐人
                const referrerData = await getOneByUserIdAndColumnId(ctx.db, input.columnId, input.buyerId);

                // 推荐表新增推荐人
                if (referrerData?.referredUserId) {
                    // 推荐人钱包增加
                    // 查找一级分销的人的钱包
                    const firstClassReferrerWalletData = await ctx.db.query.wallet
                        .findFirst({ where: eq(wallet.userId, referrerData.referredUserId) });
                    if (!firstClassReferrerWalletData) return { status: "fail", meg: "没有找到该推荐人钱包" }
                    // 查看有无二级分销
                    const referralsData = await ctx.db.query.referrals
                        .findFirst({ where: and(eq(referrals.userId, referrerData.referredUserId), eq(referrals.columnId, input.columnId)) });
                    // 获取分销表数据
                    const distributorshipDetail = await getOneDistributorshipDetail(ctx.db, columnData.id);
                    if (referralsData && distributorshipDetail) {
                        // 有二级分销
                        // 查找二级推荐人的钱包
                        const secondClassReferrerWalletData = await ctx.db.query.wallet
                            .findFirst({ where: eq(wallet.userId, referralsData.userId!) });
                        if (!secondClassReferrerWalletData) return { status: "fail", meg: "没有找到该二级推荐人钱包" }
                        // 作者拿30%的钱 一级分销拿50% 二级分销拿20%
                        const authorRate = 1 - distributorshipDetail.platDistributorship! - distributorshipDetail.extend!
                            - (isVip ? 0.06 : 0.15);
                        const income = {
                            author: priceListData.price! * authorRate,
                            firstClassReferrer: priceListData.price! * distributorshipDetail.platDistributorship!,
                            secondClassReferrer: priceListData.price! * distributorshipDetail.extend!
                        };
                        await ctx.db.update(wallet).set({
                            freezeIncome: authorWalletData.freezeIncome! + income.author
                        }).where(eq(wallet.userId, columnData.userId!))
                        await ctx.db.update(wallet).set({
                            freezeIncome: firstClassReferrerWalletData.freezeIncome! + income.firstClassReferrer,
                        }).where(eq(wallet.userId, firstClassReferrerWalletData.userId))
                        await ctx.db.update(wallet).set({
                            freezeIncome: secondClassReferrerWalletData.freezeIncome! + income.secondClassReferrer,
                        }).where(eq(wallet.userId, secondClassReferrerWalletData.userId))

                        // 作者收入
                        await ctx.db.insert(runningWater).values(
                            {
                                userId: input.buyerId,
                                price: income.author,
                                name: `专栏《${columnData.name}》收益`,
                                expenditureOrIncome: 1
                            }
                        )
                        // 一级推荐收入
                        await ctx.db.insert(runningWater).values(
                            {
                                userId: firstClassReferrerWalletData.userId,
                                price: income.firstClassReferrer,
                                name: `专栏《${columnData.name}》分销`,
                                expenditureOrIncome: 1
                            }
                        )
                        // 二级推荐收入
                        await ctx.db.insert(runningWater).values(
                            {
                                userId: secondClassReferrerWalletData.userId,
                                price: income.secondClassReferrer,
                                name: `专栏《${columnData.name}》分销`,
                                expenditureOrIncome: 1
                            }
                        )
                        // 新建订单
                        return await ctx.db.insert(order).values({
                            ownerId: input.ownerId,
                            columnId: input.columnId,
                            price: priceListData.price,
                            endDate: endDate,
                            payment: input.payment,
                            status: input.status,
                            buyerId: input.buyerId,
                            recommendationId: referrerData.referredUserId,
                            referralLevel: 2,
                        });
                    } else {
                        // 只有一级分销
                        // 作者和一级分销拿钱
                        const authorRate = 1 - distributorshipDetail.platDistributorship - (isVip ? 0.06 : 0.15);
                        const income = {
                            author: priceListData.price! * authorRate,
                            firstClassReferrer: priceListData.price! * distributorshipDetail.platDistributorship,
                        };
                        await ctx.db.update(wallet).set({
                            freezeIncome: authorWalletData.freezeIncome! + income.author
                        }).where(eq(wallet.userId, columnData.userId!));
                        await ctx.db.update(wallet).set({
                            freezeIncome: firstClassReferrerWalletData.freezeIncome! + income.firstClassReferrer
                        }).where(eq(wallet.userId, firstClassReferrerWalletData.userId));

                        // 作者收入
                        await ctx.db.insert(runningWater).values(
                            {
                                userId: input.buyerId,
                                price: income.author,
                                name: `专栏《${columnData.name}》收益`,
                                expenditureOrIncome: 1
                            }
                        )
                        // 一级推荐收入
                        await ctx.db.insert(runningWater).values(
                            {
                                userId: firstClassReferrerWalletData.userId,
                                price: income.firstClassReferrer,
                                name: `专栏《${columnData.name}》分销`,
                                expenditureOrIncome: 1
                            }
                        )
                        return await ctx.db.insert(order).values({
                            ownerId: input.ownerId,
                            columnId: input.columnId,
                            price: priceListData.price,
                            endDate: endDate,
                            payment: input.payment,
                            status: input.status,
                            buyerId: input.buyerId,
                            recommendationId: referrerData.referredUserId,
                            referralLevel: 1,
                        });
                    }
                } else {
                    // 没有人推荐，单独购买
                    // 只有作者拿钱
                    await ctx.db.update(wallet).set({
                        freezeIncome: authorWalletData.freezeIncome! + priceListData.price! * (1 - (isVip ? 0.06 : 0.15))
                    }).where(eq(wallet.userId, columnData.userId!));
                    // 作者收入
                    await ctx.db.insert(runningWater).values(
                        {
                            userId: input.buyerId,
                            price: priceListData.price,
                            name: `专栏《${columnData.name}》收益`,
                            expenditureOrIncome: 1
                        }
                    )
                    // 插入到新表
                    return await ctx.db.insert(order).values({
                        ownerId: input.ownerId,
                        columnId: input.columnId,
                        price: priceListData.price,
                        endDate: endDate,
                        payment: input.payment,
                        status: input.status,
                        buyerId: input.buyerId,
                        referralLevel: 0,
                    });
                }
            } catch (error) {
                console.error("Error creating order:", error);
                throw error; // 抛出异常，让上层处理
            }
        }),

    getColumnOrder: publicProcedure
        .input(z.object({
            columnId: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<PostDetail> => {
            const { db } = ctx;
            const { columnId } = input;
            // 获取专栏信息
            const columnData = await db.query.column.findFirst({ where: eq(column.id, columnId) })
            // 获取订阅数量
            const subscription = await db.select().from(order)
                .where(eq(order.columnId, columnId));
            // 获取用户数据
            const userData = await db.query.user.findFirst({
                where: eq(user.id, columnData.userId)
            })
            // 获取文章信息
            const posts = await db.select().from(post).where(eq(post.columnId, columnId));
            const detailPostPromise = posts.map(async post => {
                const likes = await db.select().from(postLike).where(eq(postLike.postId, post.id));
                const reads = await db.select().from(postRead).where(eq(postRead.postId, post.id));
                return {
                    ...post,
                    likeCount: likes.length,
                    readCount: reads.length,
                }
            })
            const detailPost = await Promise.all(detailPostPromise)
            return {
                detailPostCard: detailPost.map(item => ({
                    ...item,
                    userName: userData.name,
                    idType: userData.idType,
                    avatar: userData.avatar,
                    userId: userData.id,
                })),
                subscriptCount: subscription.length
            };
        }),

    // 根据用户ID 查询订单
    getUserOrder: publicProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(({ ctx, input }) => {
            return ctx.db.select().from(order).where(and(eq(order.buyerId, input.userId), eq(order.status, true)));
        }),

    // 更新订阅状态
    updateStatus: publicProcedure
        .input(z.object({
            userId: z.string(),
            status: z.boolean(),
            columnId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.update(order)
                .set({ status: !input.status })
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
        .query(async ({ ctx, input }) => {
            // 假设是自己专栏的，就直接返回
            const myColumn = await ctx.db.query.column.findFirst({
                where: and(eq(column.id, input.columnId), eq(column.userId, input.userId))
            })
            if (myColumn) return true
            const orderData = await ctx.db.query.order.findFirst({
                where: and(eq(order.columnId, input.columnId), eq(order.buyerId, input.userId))
            })

            return orderData.status;

        }),

    changeStatus: publicProcedure
        .input(z.object({ columnId: z.string(), isVisible: z.boolean(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const orders = await ctx.db.select().from(order).where(and(eq(order.columnId, input.columnId), eq(order.buyerId, input.userId)));
            if (orders.length === 0) {
                throw new Error("该columnId在order表中不存在");
            }

            return ctx.db.update(order).set({
                isVisible: input.isVisible,
            }).where(eq(order.columnId, input.columnId));
        }),

    changeStatusBatch: publicProcedure
        .input(z.object({ orders: z.array(z.object({ orderId: z.number(), isVisible: z.boolean() })) }))
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            input.orders.map(async item => {
                await db.update(order).set({
                    isVisible: item.isVisible,
                }).where(eq(order.id, item.orderId))
            })
        }),

    getSubscriptionVolume: publicProcedure
        .input(z.object({ columnId: z.string() }))
        .query(async ({ ctx, input }): Promise<number[]> => {
            const yesterday = getYesterdayMidnight();
            const today = getTodayMidnight();
            const { lastMonday, lastSunday } = getLastWeekDates();
            const { firstDayOfLastMonth, lastDayOfLastMonth } = getLastMonthDates();
            const yesterdayData =
                await ctx.db.select().from(order).where(
                    and(
                        eq(order.columnId, input.columnId),
                        and(gt(order.createdAt, yesterday), lt(order.createdAt, today))
                    )
                );
            const lastWeekData =
                await ctx.db.select().from(order).where(
                    and(
                        eq(order.columnId, input.columnId),
                        and(gt(order.createdAt, lastMonday), lt(order.createdAt, lastSunday))
                    )
                );
            const lastMonthData =
                await ctx.db.select().from(order).where(
                    and(
                        eq(order.columnId, input.columnId),
                        and(gt(order.createdAt, firstDayOfLastMonth), lt(order.createdAt, lastDayOfLastMonth))
                    )
                );
            return [yesterdayData.length, lastWeekData.length, lastMonthData.length];
        }),

    getSubscriptionRateOfIncrease: publicProcedure
        .input(z.object({ columnId: z.string() }))
        .query(async ({ ctx, input }): Promise<number> => {
            const yesterdayMidnight = getYesterdayMidnight();
            const todayMidnight = getTodayMidnight();
            const now = getCurrentTime();
            const yesterdayData =
                await ctx.db.select().from(order).where(
                    and(
                        eq(order.columnId, input.columnId),
                        and(gt(order.createdAt, yesterdayMidnight), lt(order.createdAt, todayMidnight))
                    )
                );
            const todayData =
                await ctx.db.select().from(order).where(
                    and(
                        eq(order.columnId, input.columnId),
                        and(gt(order.createdAt, todayMidnight), lt(order.createdAt, now))
                    )
                );
            if (yesterdayData.length === 0) {
                return todayData.length * 100;
            } else if (todayData.length === 0) {
                return -yesterdayData.length * 100;
            } else {
                const rate = Math.floor(todayData.length / yesterdayData.length * 100) / 100;
                return rate >= 1 ? rate - 1 : -rate;
            }
        }),

    getSubscriptionRange: publicProcedure
        .input(z.object({ columnId: z.string(), start: z.date(), end: z.date() }))
        .query(async ({ ctx, input }): Promise<number[]> => {
            // 用于存储每天数据的数组
            let dailyData: number[] = [];

            // 克隆开始日期，以便我们可以在循环中修改它
            let currentDate = new Date(input.start);

            // 循环遍历从开始日期到结束日期的每一天
            while (currentDate <= input.end) {
                // 获取当前日期的订单数量
                const ordersForCurrentDate = await ctx.db.select().from(order).where(
                    and(
                        eq(order.columnId, input.columnId),
                        and(
                            gt(order.createdAt, new Date(currentDate.setUTCHours(0, 0, 0, 0))),
                            lt(order.createdAt, new Date(currentDate.setUTCHours(23, 59, 59, 999))
                            )
                        )
                    )
                );
                // 将当前日期的订单数量添加到数组中
                dailyData.push(ordersForCurrentDate.length);
                // 将当前日期增加一天
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // 返回每一天的数据
            return dailyData;
        }),

    // 获取订阅列表
    getSubscriptionFilter: publicProcedure
        .input(z.object({
            columnId: z.string(),
            userId: z.string().nullable(),
            status: z.boolean().nullable(),
            startDate: z.date().nullable(),
            endDate: z.date().nullable()
        }))
        .query(async ({ ctx, input }): Promise<OrderBuyer[]> => {
            const { db } = ctx;

            // 构建查询条件
            const whereConditions = [
                eq(order.columnId, input.columnId),
                ...(input.userId ? [eq(order.buyerId, input.userId)] : []),
                ...(input.status !== null ? [eq(order.status, input.status)] : []),
                ...(input.startDate ? [gt(order.createdAt, input.startDate)] : []),
                ...(input.endDate ? [lt(order.endDate, input.endDate)] : []),
            ];
            // 执行查询
            const orders = await db.select().from(order).where(and(...whereConditions)).orderBy(order.createdAt);
            console.log(input.status)
            const promises = orders?.map(async item => {
                if (await checkSubscriptionStatus(db, item.id)) {
                    await expireSubscription(db, item.id);
                    item.status = false;
                }
                const u = await db.query.user.findFirst({ where: eq(user.id, item.buyerId) });
                return { ...item, userName: u.name };
            })
            return Promise.all(promises);
        }),

    endSubscription: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(({ ctx, input }) => {
            return expireSubscription(ctx.db, input.id)
        }),

    getTotalPriceByReferralId: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const list = await ctx.db.query.order.findMany({ where: eq(order.recommendationId, input) });
            return list.map(item => item.price);
        }),
});

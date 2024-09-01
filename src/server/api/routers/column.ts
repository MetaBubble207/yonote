import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {
    type BaseColumnCard,
    type Column,
    column,
    type ColumnOrder,
    type DetailColumnCard,
    order,
    post,
    postRead,
    priceList,
    user
} from "@/server/db/schema";
import {and, desc, eq, like, sql} from "drizzle-orm";
import {uniqueArray} from "@/tools/uniqueArray";
import {createCaller} from "@/server/api/root";
import type {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";
import {getCurrentTime} from "@/tools/getCurrentTime";

const getDetailColumnCard = async (
    ctx: { headers: Headers, db: PostgresJsDatabase<typeof schema> },
    columnId: string
): Promise<DetailColumnCard> => {
    const {db} = ctx;
    const caller = createCaller(ctx);
    const columnData = await db.query.column.findFirst({where: eq(column.id, columnId)});
    // 获取专栏下的所有帖子的阅读量
    const readCount = await caller.read.getColumnRead({columnId: columnData.id});
    // 获取专栏下的所有帖子的点赞量
    const likeCount = await caller.like.getColumnLike({columnId: columnData.id});
    // 获取专栏订阅量
    const subscriptionCount = (await db.select().from(order).where(eq(order.columnId, columnId))).length;
    // 获取帖子数量
    const postCount = (await db.select().from(post).where(eq(post.columnId, columnId))).length
    // 获取作者基本信息
    const userData = await caller.users.getOne({id: columnData.userId});
    let detailColumnCard: DetailColumnCard = {
        avatar: "",
        cover: "",
        createdAt: null,
        updatedAt: null,
        id: "",
        isFree: false,
        isTop: false,
        name: "",
        likeCount: 0,
        readCount: 0,
        subscriptionCount: 0,
        postCount: 0,
        userId: "",
        userName: "",
    };

    Object.assign(detailColumnCard, {
        ...columnData,
        readCount,
        likeCount,
        subscriptionCount,
        postCount,
        userId: userData.id,
        userName: userData.name,
        avatar: userData.avatar,
    });
    return detailColumnCard;
}

export const columnRouter = createTRPCRouter({
    update: publicProcedure
        .input(z.object({
            id: z.string(),
            name: z.string(),
            priceList: z.array(z.object({
                id: z.union([z.number(), z.undefined()]),
                price: z.number(),
                timeLimit: z.number()
            })),
            introduce: z.string(),
            description: z.string()
        }))
        .mutation(async ({ctx, input}) => {
            const oldPriceList = await ctx.db.select().from(priceList).where(eq(priceList.columnId, input.id));
            const oldIds = input.priceList.map((item) => item.id);
            oldPriceList.map(async item => {
                if (!oldIds.includes(item.id)) {
                    await ctx.db.delete(priceList).where(eq(priceList.id, item.id));
                }
            });
            const sortedOldPriceList = oldPriceList.sort((item, pre) => item.id - pre.id);
            input.priceList.map(async (item, index) => {
                if (sortedOldPriceList?.[index] && (sortedOldPriceList?.[index]?.price !== input.priceList[index].price || sortedOldPriceList?.[index]?.timeLimit !== input.priceList[index].timeLimit)) {
                    await ctx.db.update(priceList).set({
                        price: item.price,
                        timeLimit: item.timeLimit
                    }).where(eq(priceList.id, sortedOldPriceList[index].id))
                }
                // 判断是否是新加入的策略
                const isNew = !sortedOldPriceList?.map(item => item.id).includes(item.id);

                if (isNew || !sortedOldPriceList) {
                    await ctx.db.insert(priceList).values({
                        columnId: input.id,
                        price: item.price,
                        timeLimit: item.timeLimit
                    })
                }

            })
            return ctx.db.update(column).set({
                name: input.name,
                introduce: input.introduce,
                description: input.description,
            }).where(eq(column.id, input.id));
        }),

    updateCover: publicProcedure
        .input(z.object({id: z.string(), cover: z.string()}))
        .mutation(({ctx, input}) => {
            return ctx.db.update(column).set({
                cover: input.cover,
            }).where(eq(column.id, input.id))
        }),

    getAll: publicProcedure
        .query(async ({ctx}) => {
            const columns = await ctx.db.select().from(column)
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({where: eq(user.id, item.userId)});
                return {...item, user: u};
            });
            return await Promise.all(promises);
        }),

    getAllByUserId: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}) => {
            return ctx.db.query.column.findMany({where: eq(column.userId, input.userId)});
        }),

    getUpdate: publicProcedure
        .input(z.object({visitorId: z.string(), writerId: z.string()}))
        .query(async ({ctx, input}) => {
            const {db} = ctx;
            // 查找作者下所有的专栏
            const columns = await db.select().from(column).where(eq(column.userId, input.writerId));
            const res: Column[] = [];
            // 遍历作者下的每一个专栏的帖子
            const promises = columns.map(async (column) => {
                const posts = await db.select().from(post).where(eq(post.columnId, column.id));
                return Promise.all(posts.map(async item => {
                    // 查看阅读表数据
                    const readData = await db.query.postRead.findFirst({
                        where: and(
                            eq(postRead.postId, post.id),
                            eq(postRead.userId, input.visitorId)
                        )
                    });
                    // 阅读记录的更新时间小于文章的更新时间则说明文章更新了，读者还没读
                    if (readData?.updatedAt < item.updatedAt) {
                        const isExist = res.find(item => item.id === column.id);
                        if (!isExist) {
                            res.push(column);
                        }
                    }
                }))
            })
            await Promise.all(promises)
            return res;
        }),

    getColumnName: publicProcedure
        .input(z.object({searchValue: z.string()}))
        .query(async ({ctx, input}) => {
            let res = [];

            const userData = await ctx.db.query.user.findMany({where: like(user.name, `%${input.searchValue}%`)}); // 假设 user 表中包含了 name 字段
            if (userData) {
                const promises = userData.map(async (item) => {
                    const columnInfo = await ctx.db.select().from(column).where(eq(column.userId, item.id))
                    return {...columnInfo[0], user: {...item}}
                })
                res.push(await Promise.all(promises));
            } else {
                throw new Error('Column not found');
            }

            const columnData = await ctx.db.select().from(column).where(like(column.name, `%${input.searchValue}%`))
            if (columnData) {
                const promises = columnData.map(async (item) => {
                    const userInfo = await ctx.db.select().from(user).where(eq(user.id, item.userId))
                    return {...item, user: userInfo[0]}
                })
                res.push(await Promise.all(promises));
            } else {
                throw new Error('Column not found');
            }
            res = res[0].concat(res[1])
            res = uniqueArray(res, "id")
            return res;

        }),

    getCreateAt: publicProcedure
        .query(async ({ctx}) => {
            const columns = await ctx.db.select().from(column).orderBy(desc(column.createdAt))
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({where: eq(user.id, item.userId)});
                return {...item, user: u};
            });
            return await Promise.all(promises);

        }),

    getContentNumber: publicProcedure
        .query(async ({ctx}) => {
            const columns = await ctx.db.select().from(column).orderBy(desc(column.introduce))
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({where: eq(user.id, item.userId)});
                return {...item, user: u};
            });
            return await Promise.all(promises);

        }),

    getUserId: publicProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ctx, input}) => {
            const userId = await ctx.db.select().from(column).where(eq(column.id, input.id))
            return userId[0].userId;
        }),

    getColumnDetail: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const columnDetail = await ctx.db.select().from(column).where(and(eq(column.id, input.columnId)))
            return columnDetail[0];
        }),

    //订阅量查询
    getColumnOrderNumbers: publicProcedure
        .query(async ({ctx}) => {

            const columnIds = await ctx.db
                .select({columnId: order.columnId, userId: order.ownerId})
                .from(order)
                .groupBy(order.columnId, order.ownerId)
                .orderBy(sql`count(*) DESC`)

            const promises = columnIds.map(async item => {
                const col = await ctx.db.select().from(column).where(eq(column.id, item.columnId)).limit(1)
                const owner = await ctx.db.select().from(user).where(eq(user.id, item.userId)).limit(1)
                return {...col[0], user: {...owner[0]}}
            })
            return await Promise.all(promises);
        }),

    // 获取用户更新了帖子还未读的专栏列表
    getUpdateColumn: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}): Promise<DetailColumnCard[]> => {
            const {db} = ctx;
            // 获取该用户所有订阅记录
            const orders =
                await db.select().from(order)
                    .where(and(eq(order.buyerId, input.userId), eq(order.isVisible, true), eq(order.status, true)));
            const res: DetailColumnCard[] = [];
            // 查看所有的订阅专栏的帖子
            const ordersPromises = orders.map(async (order) => {
                const postsData = await db.select().from(post).where(eq(post.columnId, order.columnId));

                return Promise.all(postsData.map(async (post) => {

                    // 查看阅读表数据
                    const readData = await db.query.postRead.findFirst({
                        where: and(
                            eq(postRead.postId, post.id),
                            eq(postRead.userId, input.userId)
                        )
                    });

                    // 情况1，读者从来没看过文章
                    if (!readData) {
                        const detailColumnCard = await getDetailColumnCard(ctx, order.columnId)
                        const isExist = res.find(item => item.id === detailColumnCard.id);
                        if (!isExist) {
                            res.push(detailColumnCard);
                        }
                    }
                    // 阅读记录的更新时间小于文章的更新时间则说明文章更新了，读者还没读
                    if (readData?.updatedAt < post.updatedAt) {
                        const detailColumnCard = await getDetailColumnCard(ctx, order.columnId)
                        const isExist = res.find(item => item.id === detailColumnCard.id);
                        if (!isExist) {
                            res.push(detailColumnCard);
                        }
                    }
                }));
            });

            await Promise.all(ordersPromises);

            return res;
        }),

    // 获取用户所有可见订阅专栏列表
    getSubscriptColumn: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}) => {
            const caller = createCaller(ctx);
            const {db} = ctx;
            // 获取所有订阅记录
            const orders =
                await ctx.db.select().from(order)
                    .where(and(eq(order.buyerId, input.userId), eq(order.isVisible, true), eq(order.status, true)));
            const ordersPromises = orders.map(async (order) => {
                // 获取所有订阅的专栏
                const columnData = await db.query.column.findFirst({where: eq(column.id, order.columnId)});
                // 获取作者基本信息
                const userData = await caller.users.getOne({id: columnData.userId});
                return {
                    ...columnData,
                    userId: userData.id,
                    userName: userData.name,
                    avatar: userData.avatar,
                }
            });
            const res: BaseColumnCard[] = [];
            Object.assign(res, await Promise.all(ordersPromises))
            return res;
        }),

    getAlreadySubscribedColumns: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}) => {
            // 获取订单
            const orders =
                await ctx.db.select().from(order).where(and(eq(order.buyerId, input.userId), eq(order.status, true)));
            // 获取专栏
            const resTemp: ColumnOrder[] = [];
            const promises = orders.map(async order => {
                resTemp.push({
                    column: await ctx.db.query.column.findFirst({where: eq(column.id, order.columnId)}),
                    order: order
                });
            })
            await Promise.all(promises);
            return resTemp.sort((a, b) => a.order.createdAt > b.order.createdAt ? 1 : -1);
        }),

    // 获取专栏及其用户信息
    getColumnUser: publicProcedure
        .input(z.object({columnId: z.string()}))
        .query(async ({ctx, input}) => {
            const columnData = await ctx.db.query.column.findFirst({where: eq(column.id, input.columnId)});
            const userData = await ctx.db.query.user.findFirst({where: eq(user.id, columnData.userId)});
            const res: BaseColumnCard = {
                ...columnData,
                userId: userData.id,
                userName: userData.name,
                avatar: userData.avatar,
            };
            return res;
        }),

    getColumnFilter: publicProcedure
        .input(z.object({conditions: z.number()}))
        .query(async ({ctx, input}): Promise<DetailColumnCard[]> => {
            const {db} = ctx;
            // 获取所有专栏
            const allColumn = await db.select().from(column);
            const detailColumnsPromise = allColumn.map(async column => {
                return await getDetailColumnCard(ctx, column.id)
            });

            const detailColumns = await Promise.all(detailColumnsPromise);
            let res: DetailColumnCard[] = [];
            const {conditions} = input;

            switch (conditions) {
                // 0 全部
                case 0:
                    res = detailColumns;
                    break;
                // 1 订阅量
                case 1:
                    res = detailColumns.sort((a, b) => a.subscriptionCount - b.subscriptionCount);
                    break;
                // 2 内容量
                case 2:
                    res = detailColumns.sort((a, b) => a.postCount - b.postCount);
                    break;
                // 3 发布时间
                case 3:
                    res = detailColumns.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
                    break;
                // 4 创作时间
                case 4:
                    res = detailColumns.sort((a, b) => a.updatedAt > b.updatedAt ? 1 : -1);
                    break;
            }
            return res;
        }),

    // 更新创作时间
    changeUpdatedAt: publicProcedure
        .input(z.object({id: z.string()}))
        .mutation(({ctx, input}) => {
            return ctx.db.update(column).set({
                updatedAt: getCurrentTime()
            }).where(eq(column.id, input.id))
        })
});

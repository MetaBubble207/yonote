import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {
    type Column,
    column,
    type ColumnOrder,
    type ColumnUser,
    order,
    post,
    postRead,
    priceList,
    user
} from "@/server/db/schema";
import {and, desc, eq, like, sql} from "drizzle-orm";
import {uniqueArray} from "@/tools/uniqueArray";
import {createCaller} from "@/server/api/root";

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
            // 查找作者下所有的专栏
            const columns = await ctx.db.select().from(column).where(eq(column.userId, input.writerId));
            // 查找拜访者的观看记录
            const readRecords = await ctx.db.select().from(postRead).where(eq(postRead.userId, input.visitorId));
            const visitorPosts = readRecords.map(item => item.postId);
            const res: Column[] = [];
            // 遍历作者下的每一个专栏的帖子
            const promises = columns.map(async (column) => {
                const posts = await ctx.db.select().from(post).where(eq(post.columnId, column.id));
                const flag = posts.every(item => visitorPosts.includes(item.id))
                if (!flag) {
                    res.push(column);
                }
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
        .query(async ({ctx, input}) => {
            const caller = createCaller(ctx);
            const {db} = ctx;
            // 获取所有订阅记录
            const orders =
                await db.select().from(order)
                    .where(and(eq(order.buyerId, input.userId), eq(order.isVisible, true)));
            // 获取所有订阅的专栏
            const subscribeColumns: Column[] = [];
            const ordersPromises = orders.map(async (order) => {
                subscribeColumns.push(await db.query.column.findFirst({where: eq(column.id, order.columnId)}));
            });
            await Promise.all(ordersPromises);
            // 获取所有观看记录
            const readRecords = await db.select().from(postRead).where(eq(postRead.userId, input.userId));
            const ownerPosts = readRecords.map(item => item.postId);
            const res: Column[] = [];
            // 遍历作者下的每一个专栏的帖子
            const subscribeColumnsPromises = subscribeColumns.map(async (column) => {
                const writerPosts = await db.select().from(post).where(eq(post.columnId, column.id));
                const flag = writerPosts.every(item => ownerPosts.includes(item.id))
                if (!flag) {
                    res.push(column);
                }
            })
            await Promise.all(subscribeColumnsPromises);

            caller.users.getOne()
            return res;
        }),

    // 获取用户所有可见订阅专栏列表
    getVisibleColumn: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}) => {
            // 获取所有订阅记录
            const orders =
                await ctx.db.select().from(order)
                    .where(and(eq(order.buyerId, input.userId), eq(order.isVisible, true)));
            // 获取所有订阅的专栏
            const subscribeColumnsTemp: any[] = [];
            const ordersPromises = orders.map(async (order) => {
                const columnTemp = await ctx.db.query.column.findFirst({where: eq(column.id, order.columnId)});

                subscribeColumnsTemp.push({
                    ...columnTemp,
                    subscriptionTime: order.createdAt
                });
            });
            await Promise.all(ordersPromises);
            const res: Column[] = subscribeColumnsTemp.sort((a, b) => a.subscriptionTime > b.subscriptionTime ? 1 : -1);
            return res;
        }),

    getAlreadySubscribedColumns: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx, input}) => {
            // 获取订单
            const orders = await ctx.db.select().from(order).where(eq(order.buyerId, input.userId));
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
            const columnData = await ctx.db.query.column.findFirst({where: eq(column.id, input.columnId)})
            const userData = await ctx.db.query.user.findFirst({where: eq(user.id, column.id)})
            const res: ColumnUser = {
                column: columnData, user: userData
            };
            return res;
        }),
});

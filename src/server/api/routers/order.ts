import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  column,
  order,
  type OrderBuyer,
  OrderSelect,
  type PostDetail,
  priceList,
  referrals,
  runningWater,
  user,
  wallet,
} from "@/server/db/schema";
import type * as schema from "../../db/schema";
import { and, desc, eq, gt, inArray, lt, sql } from "drizzle-orm";
import { addDays } from "date-fns";
import { getCurrentTime, } from "@/app/_utils/getCurrentTime";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { getColumnBasicInfo, getPostStats, getUserData } from "../tools/columnQueries";
import { getOneUser } from "../tools/userQueries";
import { getOneDistributorshipDetail } from "../tools/distributorshipDetailQueries";
import { handleIncomeDistribution, handleWalletDeduction } from "../tools/orderMutations";
// 检查该订阅状态是否需要更新，即过期日期已经截止了，但是状态还是true
const checkSubscriptionStatus = async (
  db: PostgresJsDatabase<typeof schema>,
  id: number,
): Promise<boolean> => {
  const o = await db.query.order.findFirst({
    where: and(eq(order.id, id), eq(order.status, true)),
  });
  if (!o?.endDate) {
    return false;
  }

  return o.endDate < getCurrentTime();
};
export const orderRouter = createTRPCRouter({
  // 创建订单
  createOrder: publicProcedure
    .input(
      z.object({
        ownerId: z.string(),
        columnId: z.string(),
        priceListId: z.number(),
        payment: z.string(),
        status: z.boolean(),
        buyerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      return await db.transaction(async (tx) => {
        try {
          // 并行查询基础数据
          const [
            columnData,
            priceListData,
            buyerWallet,
            referrerData,
          ] = await Promise.all([
            tx.query.column.findFirst({
              where: eq(column.id, input.columnId),
            }),
            tx.query.priceList.findFirst({
              where: eq(priceList.id, input.priceListId),
            }),
            tx.query.wallet.findFirst({
              where: eq(wallet.userId, input.buyerId),
            }),
            tx.query.referrals.findFirst({
              where: and(
                eq(referrals.userId, input.buyerId),
                eq(referrals.columnId, input.columnId)
              ),
            }),
          ]);

          // 验证基础数据
          if (!columnData) return { status: "fail", meg: "没有找到该专栏" };
          if (!priceListData) return { status: "fail", meg: "没有找到该专栏价目表" };
          if (!buyerWallet) return { status: "fail", meg: "没有找到该购买者钱包" };

          // 获取作者相关信息
          const [authorWallet, author] = await Promise.all([
            tx.query.wallet.findFirst({
              where: eq(wallet.userId, columnData.userId),
            }),
            getOneUser(tx, columnData.userId!),
          ]);

          if (!authorWallet) return { status: "fail", meg: "没有找到该作者钱包" };
          if (!author) return { status: "fail", meg: "没有找到该作者" };

          // 处理钱包扣款
          const deductionSuccess = await handleWalletDeduction(
            tx,
            buyerWallet,
            priceListData.price,
          );
          if (!deductionSuccess) return { status: "fail", meg: "余额不足" };

          // 记录购买流水
          await tx.insert(runningWater).values({
            userId: input.buyerId,
            price: priceListData.price,
            name: `购买专栏《${columnData.name}》`,
            expenditureOrIncome: 0,
          });

          const endDate = addDays(new Date(), priceListData.timeLimit!);
          let orderData: OrderSelect = {
            ownerId: input.ownerId,
            columnId: input.columnId,
            price: priceListData.price,
            endDate,
            payment: input.payment,
            status: input.status,
            buyerId: input.buyerId,
            referralLevel: 0,
            id: 0,
            createdAt: getCurrentTime(),
            updatedAt: getCurrentTime(),
            recommendationId: null,
            isVisible: true
          };

          // 处理分销逻辑
          if (referrerData?.referredUserId) {
            const [firstClassReferrerWallet, distributorshipDetail] = await Promise.all([
              tx.query.wallet.findFirst({
                where: eq(wallet.userId, referrerData.referredUserId),
              }),
              getOneDistributorshipDetail(tx, columnData.id),
            ]);

            if (!firstClassReferrerWallet)
              return { status: "fail", meg: "没有找到该推荐人钱包" };
            if (!distributorshipDetail)
              return { status: "fail", meg: "分销表不存在" };

            const actualIncome = priceListData.price * (1 - distributorshipDetail.platDistributorship);

            // 查询二级分销
            const extendUserData = await tx.query.referrals.findFirst({
              where: and(
                eq(referrals.userId, referrerData.referredUserId),
                eq(referrals.columnId, input.columnId),
              ),
            });

            if (extendUserData) {
              const secondClassReferrerWallet = await tx.query.wallet.findFirst({
                where: eq(wallet.userId, extendUserData.referredUserId),
              });
              if (!secondClassReferrerWallet)
                return { status: "fail", meg: "没有找到该二级推荐人钱包" };

              const authorRate = 1 - (distributorshipDetail.extend + distributorshipDetail.distributorship);
              await handleIncomeDistribution(
                tx,
                columnData.name,
                actualIncome,
                authorRate,
                authorWallet,
                firstClassReferrerWallet,
                secondClassReferrerWallet,
                distributorshipDetail.distributorship,
                distributorshipDetail.extend,
              );

              orderData = {
                ...orderData,
                recommendationId: referrerData.referredUserId,
                referralLevel: 2,
              };
            } else {
              const authorRate = 1 - distributorshipDetail.distributorship;
              await handleIncomeDistribution(
                tx,
                columnData.name,
                actualIncome,
                authorRate,
                authorWallet,
                firstClassReferrerWallet,
                undefined,
                distributorshipDetail.distributorship,
              );

              orderData = {
                ...orderData,
                recommendationId: referrerData.referredUserId,
                referralLevel: 1,
              };
            }
          } else {
            // 无分销情况
            const actualIncome = priceListData.price * (1 - (author.idType === 1 ? 0.06 : 0.15));
            await handleIncomeDistribution(
              tx,
              columnData.name,
              actualIncome,
              1,
              authorWallet,
            );
          }

          // 创建订单
          return await tx.insert(order).values({ ...orderData, id: undefined });
        } catch (error) {
          console.error("Error creating order:", error);
          throw error;
        }
      });
    }),

  getColumnOrder: publicProcedure
    .input(z.object({
      columnId: z.string(),
      search: z.string().optional(),
      isDesc: z.boolean().optional().default(false),
      tag: z.string().optional().default('all')
    }))
    .query(async ({ ctx, input }): Promise<PostDetail> => {
      const { db } = ctx;
      const { columnId, search, isDesc, tag } = input;
      try {
        // 获取基础数据
        const { columnData, subscription, posts } = await getColumnBasicInfo(db, columnId, search, isDesc, tag);

        // 获取用户数据
        const userData = await getUserData(db, columnData.userId);

        // 并行获取所有文章的统计数据
        const postsWithStats = await Promise.all(
          posts.map(async (post) => {
            const stats = await getPostStats(db, post.id);

            return {
              ...post,
              ...stats,
              userName: userData.name,
              idType: userData.idType,
              avatar: userData.avatar,
              userId: userData.id,
            };
          }),
        );

        return {
          detailPostCard: postsWithStats.map(post => ({
            ...post,
            tag: post.tag || '',
            idType: post.idType ?? 0,
            userName: post.userName ?? '',
            avatar: post.avatar ?? '',
          })),
          subscriptCount: subscription.length,
        };
      } catch (error) {
        console.error("Error in getColumnOrder:", error);
        throw error;
      }
    }),

  // 根据用户ID 查询订单
  getUserOrder: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(order)
        .where(and(eq(order.buyerId, input.userId), eq(order.status, true)));
    }),

  // 查看用户是否购买专栏
  getUserStatus: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "用户ID不能为空"),
        columnId: z.string().min(1, "专栏ID不能为空"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { userId, columnId } = input;

      try {
        // 1. 检查是否是作者本人的专栏
        const isAuthor = await db.query.column.findFirst({
          where: and(
            eq(column.id, columnId),
            eq(column.userId, userId),
          ),
          columns: { id: true }, // 只查询需要的字段
        });

        if (isAuthor) return true;

        // 2. 检查订阅状态
        const subscription = await db.query.order.findFirst({
          where: and(
            eq(order.columnId, columnId),
            eq(order.buyerId, userId),
            eq(order.status, true), // 只查询有效订阅
          ),
          columns: {
            status: true,
            endDate: true
          },
        });

        // 3. 检查订阅是否过期
        if (subscription?.endDate && subscription.endDate < new Date()) {
          await db.update(order)
            .set({ status: false })
            .where(and(
              eq(order.columnId, columnId),
              eq(order.buyerId, userId),
            ));
          return false;
        }

        return Boolean(subscription?.status);
      } catch (error) {
        console.error('Error checking user subscription status:', error);
        return false;
      }
    }),
  // 获取订阅列表
  getSubscriptionFilter: publicProcedure
    .input(
      z.object({
        columnId: z.string().optional(),
        userId: z.string().nullable().optional(),
        status: z.number().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
        pageSize: z.number().optional().default(10),
        currentPage: z.number().optional().default(1),
      }),
    )
    .query(async ({ ctx, input }): Promise<{ data: OrderBuyer[], total: number }> => {
      const { db } = ctx;
      const { columnId, userId, startDate, endDate, pageSize, currentPage } = input;
      const status = input.status === 0 ? null : (input.status === 1 ? true : false);
      // 构建查询条件
      const whereConditions = [
        columnId ? eq(order.columnId, columnId) : undefined,
        userId ? eq(order.buyerId, userId) : undefined,
        status !== null ? eq(order.status, status) : undefined,
        startDate ? gt(order.createdAt, new Date(startDate)) : undefined,
        endDate ? lt(order.createdAt, new Date(endDate)) : undefined,
      ].filter(Boolean);

      // 计算总数
      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(order)
        .where(and(...whereConditions))
        .then(result => Number(result[0]?.count) || 0);

      // 分页查询订单
      const orders = await db
        .select({
          id: order.id,
          columnId: order.columnId,
          buyerId: order.buyerId,
          status: order.status,
          createdAt: order.createdAt,
          endDate: order.endDate,
          price: order.price,
          payment: order.payment,
          referralLevel: order.referralLevel,
        })
        .from(order)
        .where(and(...whereConditions))
        .orderBy(desc(order.createdAt))
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize);

      if (!orders.length) {
        return { data: [], total: 0 };
      }

      // 批量获取用户信息
      const userIds = [...new Set(orders.map(order => order.buyerId))];
      const users = await db
        .select({
          id: user.id,
          name: user.name,
        })
        .from(user)
        .where(inArray(user.id, userIds));

      const userMap = new Map(users.map(user => [user.id, user]));

      // 批量检查并更新订阅状态
      const ordersWithUserInfo = await Promise.all(
        orders.map(async (item) => {
          const needsUpdate = await checkSubscriptionStatus(db, item.id);
          if (needsUpdate) {
            await db
              .update(order)
              .set({
                status: false,
              })
              .where(eq(order.id, item.id))
            item.status = false;
          }

          return {
            ...item,
            userName: userMap.get(item.buyerId)?.name || '未知用户',
          };
        })
      );

      return {
        data: ordersWithUserInfo as OrderBuyer[],
        total: totalCount,
      };
    }),

  endSubscription: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.update(order).set({ status: false, }).where(eq(order.id, input.id));;
    }),

  // 批量更新订单可视状态(前端订阅管理部分使用)
  updateOrderVisible: publicProcedure
    .input(z.array(z.object({
      userId: z.string(),
      columnId: z.string(),
      isVisible: z.boolean()
    })))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // 批量处理所有更新操作
      const updatePromises = input.map(async (item) => {
        return db
          .update(order)
          .set({ isVisible: item.isVisible })
          .where(and(
            eq(order.buyerId, item.userId),
            eq(order.columnId, item.columnId),
          ));
      });

      // 并行执行所有更新操作
      await Promise.all(updatePromises);
      return { success: true };
    }),
});

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  column,
  order,
  type OrderBuyer,
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
      try {
        // 查询专栏信息
        const columnData = await ctx.db.query.column.findFirst({
          where: eq(column.id, input.columnId),
        });
        if (!columnData) return { status: "fail", meg: "没有找到该专栏" };
        // 获取作者钱包
        const authorWalletData = await ctx.db.query.wallet.findFirst({
          where: eq(wallet.userId, columnData.userId!),
        });
        if (!authorWalletData)
          return { status: "fail", meg: "没有找到该作者钱包" };
        // 获取作者身份，是否是vip
        const author = await getOneUser(ctx.db, authorWalletData.userId);
        if (!author) return { status: "fail", meg: "没有找到该作者" };
        const isVip = author.idType === 1;
        // 查询专栏价目表
        const priceListData = await ctx.db.query.priceList.findFirst({
          where: eq(priceList.id, input.priceListId),
        });
        if (!priceListData)
          return { status: "fail", meg: "没有找到该专栏价目表" };
        const endDate = addDays(new Date(), priceListData.timeLimit!);

        // 钱包减少，优先扣除冻结金额，如果不够，就从可提现金额里面去扣除剩余的
        // 先查询购买者冻结金额和可提现金额
        const buyerWalletData = await ctx.db.query.wallet.findFirst({
          where: eq(wallet.userId, input.buyerId),
        });
        if (!buyerWalletData)
          return { status: "fail", meg: "没有找到该购买者钱包" };
        // 如果冻结金额大于专栏价格，直接就扣除冻结金额的
        if (buyerWalletData.freezeIncome >= priceListData.price) {
          await ctx.db
            .update(wallet)
            .set({
              freezeIncome:
                buyerWalletData.freezeIncome - priceListData.price,
            })
            .where(eq(wallet.userId, input.buyerId));
        } else if (
          (buyerWalletData.freezeIncome + buyerWalletData.amountWithdraw) >=
          priceListData.price
        ) {
          // 冻结金额+可提现金额大于专栏价格的，则冻结金额清0，可提现金额减去剩下的东西
          await ctx.db
            .update(wallet)
            .set({
              freezeIncome: 0,
              amountWithdraw:
                buyerWalletData.amountWithdraw +
                buyerWalletData.freezeIncome -
                priceListData.price,
            })
            .where(eq(wallet.userId, input.buyerId));
        } else {
          return { status: "fail", meg: "余额不足" };
        }

        // 购买者流水增加
        await ctx.db.insert(runningWater).values({
          userId: input.buyerId,
          price: priceListData.price,
          name: `购买专栏《${columnData.name}》`,
          expenditureOrIncome: 0,
        });

        // 查找有没有推荐人
        const referrerData = await ctx.db.query.referrals.findFirst({
          where: and(eq(referrals.userId, input.buyerId), eq(referrals.columnId, input.columnId)),
        });
        // 计算实际上的收入（有分销表则按照分销表的倍率乘，没有则根据作者是否Vip来抽成）
        let actualIncome = priceListData.price * (1 - (isVip ? 0.06 : 0.15));

        // 推荐表新增推荐人
        if (referrerData?.referredUserId) {
          // 推荐人钱包增加
          // 查找一级分销的人的钱包
          const firstClassReferrerWalletData =
            await ctx.db.query.wallet.findFirst({
              where: eq(wallet.userId, referrerData.referredUserId),
            });
          if (!firstClassReferrerWalletData)
            return { status: "fail", meg: "没有找到该推荐人钱包" };
          // 通过一级分销的userId去查看分销表有无二级分销
          const extendUserData = await ctx.db.query.referrals.findFirst({
            where: and(
              eq(referrals.userId, referrerData.referredUserId),
              eq(referrals.columnId, input.columnId),
            ),
          });
          // 获取分销表数据
          const distributorshipDetail = await getOneDistributorshipDetail(
            ctx.db,
            columnData.id,
          );
          if (!distributorshipDetail) {
            return { status: "fail", meg: "分销表不存在" }
          }
          actualIncome = priceListData.price * (1 - distributorshipDetail.platDistributorship);
          if (extendUserData) {
            // 有二级分销
            // 查找二级推荐人的钱包
            const secondClassReferrerWalletData =
              await ctx.db.query.wallet.findFirst({
                where: eq(wallet.userId, extendUserData.referredUserId),
              });
            if (!secondClassReferrerWalletData) return { status: "fail", meg: "没有找到该二级推荐人钱包" };
            // 计算作者倍率，一减去 一级分销和二级分销的和
            const authorRate = 1 - (distributorshipDetail.extend + distributorshipDetail.distributorship);
            const income = {
              author: actualIncome * authorRate,
              firstClassReferrer: actualIncome * distributorshipDetail.distributorship,
              secondClassReferrer: actualIncome * distributorshipDetail.extend,
            };
            await ctx.db
              .update(wallet)
              .set({
                freezeIncome: authorWalletData.freezeIncome + income.author,
              })
              .where(eq(wallet.userId, columnData.userId!));
            await ctx.db
              .update(wallet)
              .set({
                freezeIncome:
                  firstClassReferrerWalletData.freezeIncome +
                  income.firstClassReferrer,
              })
              .where(eq(wallet.userId, firstClassReferrerWalletData.userId));
            await ctx.db
              .update(wallet)
              .set({
                freezeIncome:
                  secondClassReferrerWalletData.freezeIncome! +
                  income.secondClassReferrer,
              })
              .where(eq(wallet.userId, secondClassReferrerWalletData.userId));

            // 作者收入
            await ctx.db.insert(runningWater).values({
              userId: authorWalletData.userId,
              price: income.author,
              name: `专栏《${columnData.name}》收益`,
              expenditureOrIncome: 1,
            });
            // 一级推荐收入
            await ctx.db.insert(runningWater).values({
              userId: firstClassReferrerWalletData.userId,
              price: income.firstClassReferrer,
              name: `专栏《${columnData.name}》分销奖励`,
              expenditureOrIncome: 1,
            });
            // 二级推荐收入
            await ctx.db.insert(runningWater).values({
              userId: secondClassReferrerWalletData.userId,
              price: income.secondClassReferrer,
              name: `专栏《${columnData.name}》推广奖励`,
              expenditureOrIncome: 1,
            });
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
          } else if (distributorshipDetail) {
            // 只有一级分销
            // 作者和一级分销拿钱
            const authorRate = 1 - distributorshipDetail.distributorship;
            const income = {
              author: actualIncome * authorRate,
              firstClassReferrer: actualIncome * distributorshipDetail.distributorship,
            };
            await ctx.db
              .update(wallet)
              .set({
                freezeIncome: authorWalletData.freezeIncome + income.author,
              })
              .where(eq(wallet.userId, columnData.userId));
            await ctx.db
              .update(wallet)
              .set({
                freezeIncome:
                  firstClassReferrerWalletData.freezeIncome +
                  income.firstClassReferrer,
              })
              .where(eq(wallet.userId, firstClassReferrerWalletData.userId));

            // 作者收入
            await ctx.db.insert(runningWater).values({
              userId: authorWalletData.userId,
              price: income.author,
              name: `专栏《${columnData.name}》收益`,
              expenditureOrIncome: 1,
            });
            // 一级推荐收入
            await ctx.db.insert(runningWater).values({
              userId: firstClassReferrerWalletData.userId,
              price: income.firstClassReferrer,
              name: `专栏《${columnData.name}》分销奖励`,
              expenditureOrIncome: 1,
            });
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
          await ctx.db
            .update(wallet)
            .set({ freezeIncome: authorWalletData.freezeIncome + actualIncome, })
            .where(eq(wallet.userId, authorWalletData.userId));
          // 作者收入
          await ctx.db.insert(runningWater).values({
            userId: authorWalletData.userId,
            price: actualIncome,
            name: `专栏《${columnData.name}》收益`,
            expenditureOrIncome: 1,
          });
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
        endDate ? lt(order.endDate, new Date(endDate)) : undefined,
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

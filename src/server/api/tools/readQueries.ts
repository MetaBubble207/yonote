import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/server/db/schema";
import { sql, eq, gt, lt, and } from "drizzle-orm";
import { order, post, postRead, } from "@/server/db/schema";
import { getCurrentTime, getLastMonthDates, getLastWeekDates, getTodayMidnight, getYesterdayMidnight } from "@/app/_utils/getCurrentTime";
interface TimeRange {
    start: Date;
    end: Date;
}

// 统一的阅读量查询函数
export async function getColumnReadsInRange(
    db: PostgresJsDatabase<typeof schema>,
    columnId: string,
    timeRange?: TimeRange
): Promise<number> {
    // 创建基础条件数组
    const conditions = [eq(post.columnId, columnId)];

    // 如果有时间范围，添加时间条件
    if (timeRange) {
        conditions.push(
            gt(postRead.createdAt, timeRange.start),
            lt(postRead.createdAt, timeRange.end)
        );
    }

    // 执行查询
    const result = await db
        .select({
            readCount: sql<number>`count(*)`,
        })
        .from(post)
        .leftJoin(postRead, eq(post.id, postRead.postId))
        .where(and(...conditions))
        .execute();

    return result[0]?.readCount ?? 0;
}
// 获取昨天、上周、上个月的阅读量
export const getReads = async (db: PostgresJsDatabase<typeof schema>, columnId: string) => {
    // 获取昨天、上周、上个月的阅读量
    const [yesterday, lastWeek, lastMonth] = await Promise.all([
        getColumnReadsInRange(db, columnId, {
            start: getYesterdayMidnight(),
            end: getTodayMidnight(),
        }),
        getColumnReadsInRange(db, columnId, {
            start: getLastWeekDates().lastMonday,
            end: getLastWeekDates().lastSunday,
        }),
        getColumnReadsInRange(db, columnId, {
            start: getLastMonthDates().firstDayOfLastMonth,
            end: getLastMonthDates().lastDayOfLastMonth,
        }),
    ]);
    return {
        yesterday,
        lastWeek,
        lastMonth,
    }
}

// 
export const getReadingRateOfIncrease = async (db: PostgresJsDatabase<typeof schema>, columnId: string) => {
    const yesterdayMidnight = getYesterdayMidnight();
    const todayMidnight = getTodayMidnight();
    const now = getCurrentTime();
    // 查询所有专栏下所有的帖子
    const posts = await db
        .select()
        .from(post)
        .where(eq(post.columnId, columnId));

    let yesterdayReadCount = 0;
    let todayReadCount = 0;
    const readPromises = posts.map(async (item) => {
        const yesterdayReads = await db
            .select()
            .from(postRead)
            .where(
                and(
                    eq(postRead.postId, item.id),
                    and(
                        gt(postRead.createdAt, yesterdayMidnight),
                        lt(postRead.createdAt, todayMidnight),
                    ),
                ),
            );
        yesterdayReadCount += yesterdayReads.length;
        const todayReads = await db
            .select()
            .from(postRead)
            .where(
                and(
                    eq(postRead.postId, item.id),
                    and(
                        gt(postRead.createdAt, todayMidnight),
                        lt(postRead.createdAt, now),
                    ),
                ),
            );
        todayReadCount += todayReads.length;
    });
    await Promise.all(readPromises);
    if (yesterdayReadCount === 0) {
        return todayReadCount * 100;
    } else if (todayReadCount === 0) {
        return -yesterdayReadCount * 100;
    } else {
        const rate =
            Math.floor((todayReadCount / yesterdayReadCount) * 100) / 100;
        return rate >= 1 ? rate - 1 : -rate;
    }
}

export const getSubscriptionVolume = async (db: PostgresJsDatabase<typeof schema>, columnId: string) => {
    const yesterday = getYesterdayMidnight();
    const today = getTodayMidnight();
    const { lastMonday, lastSunday } = getLastWeekDates();
    const { firstDayOfLastMonth, lastDayOfLastMonth } = getLastMonthDates();
    const yesterdayData = await db
        .select()
        .from(order)
        .where(
            and(
                eq(order.columnId, columnId),
                and(gt(order.createdAt, yesterday), lt(order.createdAt, today)),
            ),
        );
    const lastWeekData = await db
        .select()
        .from(order)
        .where(
            and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, lastMonday),
                    lt(order.createdAt, lastSunday),
                ),
            ),
        );
    const lastMonthData = await db
        .select()
        .from(order)
        .where(
            and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, firstDayOfLastMonth),
                    lt(order.createdAt, lastDayOfLastMonth),
                ),
            ),
        );
    return [yesterdayData.length, lastWeekData.length, lastMonthData.length];
}

export const getSubscriptionRateOfIncrease = async (db: PostgresJsDatabase<typeof schema>, columnId: string) => {
    const yesterdayMidnight = getYesterdayMidnight();
    const todayMidnight = getTodayMidnight();
    const now = getCurrentTime();
    const yesterdayData = await db
        .select()
        .from(order)
        .where(
            and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, yesterdayMidnight),
                    lt(order.createdAt, todayMidnight),
                ),
            ),
        );
    const todayData = await db
        .select()
        .from(order)
        .where(
            and(
                eq(order.columnId, columnId),
                and(gt(order.createdAt, todayMidnight), lt(order.createdAt, now)),
            ),
        );
    if (yesterdayData.length === 0) {
        return todayData.length * 100;
    } else if (todayData.length === 0) {
        return -yesterdayData.length * 100;
    } else {
        const rate =
            Math.floor((todayData.length / yesterdayData.length) * 100) / 100;
        return rate >= 1 ? rate - 1 : -rate;
    }
}

// 新增综合方法，一次性获取所有主页数据
export const getAllHomepageData = async (db: PostgresJsDatabase<typeof schema>, columnId: string) => {
    // 获取时间范围常量，避免重复计算
    const yesterdayMidnight = getYesterdayMidnight();
    const todayMidnight = getTodayMidnight();
    const now = getCurrentTime();
    const { lastMonday, lastSunday } = getLastWeekDates();
    const { firstDayOfLastMonth, lastDayOfLastMonth } = getLastMonthDates();

    // 1. 获取所有专栏下的帖子 - 只查询一次
    const posts = await db
        .select()
        .from(post)
        .where(eq(post.columnId, columnId));

    // 2. 并行获取所有需要的数据
    const [
        // 阅读量数据
        yesterdayReads,
        lastWeekReads,
        lastMonthReads,
        // 今日阅读量数据（用于计算增长率）
        todayReads,
        // 订阅量数据
        yesterdaySubscriptions,
        lastWeekSubscriptions,
        lastMonthSubscriptions,
        // 今日订阅量数据（用于计算增长率）
        todaySubscriptions
    ] = await Promise.all([
        // 阅读量查询
        Promise.all(posts.map(p =>
            db.select()
                .from(postRead)
                .where(and(
                    eq(postRead.postId, p.id),
                    and(
                        gt(postRead.createdAt, yesterdayMidnight),
                        lt(postRead.createdAt, todayMidnight)
                    )
                ))
        )),
        Promise.all(posts.map(p =>
            db.select()
                .from(postRead)
                .where(and(
                    eq(postRead.postId, p.id),
                    and(
                        gt(postRead.createdAt, lastMonday),
                        lt(postRead.createdAt, lastSunday)
                    )
                ))
        )),
        Promise.all(posts.map(p =>
            db.select()
                .from(postRead)
                .where(and(
                    eq(postRead.postId, p.id),
                    and(
                        gt(postRead.createdAt, firstDayOfLastMonth),
                        lt(postRead.createdAt, lastDayOfLastMonth)
                    )
                ))
        )),
        Promise.all(posts.map(p =>
            db.select()
                .from(postRead)
                .where(and(
                    eq(postRead.postId, p.id),
                    and(
                        gt(postRead.createdAt, todayMidnight),
                        lt(postRead.createdAt, now)
                    )
                ))
        )),
        // 订阅量查询
        db.select()
            .from(order)
            .where(and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, yesterdayMidnight),
                    lt(order.createdAt, todayMidnight)
                )
            )),
        db.select()
            .from(order)
            .where(and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, lastMonday),
                    lt(order.createdAt, lastSunday)
                )
            )),
        db.select()
            .from(order)
            .where(and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, firstDayOfLastMonth),
                    lt(order.createdAt, lastDayOfLastMonth)
                )
            )),
        db.select()
            .from(order)
            .where(and(
                eq(order.columnId, columnId),
                and(
                    gt(order.createdAt, todayMidnight),
                    lt(order.createdAt, now)
                )
            ))
    ]);

    // 3. 计算阅读量总数
    const yesterdayReadCount = yesterdayReads.flat().length;
    const lastWeekReadCount = lastWeekReads.flat().length;
    const lastMonthReadCount = lastMonthReads.flat().length;
    const todayReadCount = todayReads.flat().length;

    // 4. 计算订阅量总数
    const yesterdaySubscriptionCount = yesterdaySubscriptions.length;
    const lastWeekSubscriptionCount = lastWeekSubscriptions.length;
    const lastMonthSubscriptionCount = lastMonthSubscriptions.length;
    const todaySubscriptionCount = todaySubscriptions.length;

    // 5. 计算阅读量增长率
    let readingRate = 0;
    if (yesterdayReadCount === 0) {
        readingRate = todayReadCount * 100;
    } else if (todayReadCount === 0) {
        readingRate = -yesterdayReadCount * 100;
    } else {
        const rate = Math.floor((todayReadCount / yesterdayReadCount) * 100) / 100;
        readingRate = rate >= 1 ? rate - 1 : -rate;
    }

    // 6. 计算订阅量增长率
    let subscriptionRate = 0;
    if (yesterdaySubscriptionCount === 0) {
        subscriptionRate = todaySubscriptionCount * 100;
    } else if (todaySubscriptionCount === 0) {
        subscriptionRate = -yesterdaySubscriptionCount * 100;
    } else {
        const rate = Math.floor((todaySubscriptionCount / yesterdaySubscriptionCount) * 100) / 100;
        subscriptionRate = rate >= 1 ? rate - 1 : -rate;
    }

    // 7. 返回所有数据
    return {
        reads: [yesterdayReadCount, lastWeekReadCount, lastMonthReadCount],
        readingRate,
        subscriptions: [yesterdaySubscriptionCount, lastWeekSubscriptionCount, lastMonthSubscriptionCount],
        subscriptionRate,
    };
}
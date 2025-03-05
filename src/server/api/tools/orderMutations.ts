import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq, } from "drizzle-orm";
import type * as schema from "../../db/schema";
import { runningWater, wallet } from "../../db/schema";
// 处理钱包扣款
export const handleWalletDeduction = async (
    db: PostgresJsDatabase<typeof schema>,
    buyerWallet: typeof wallet.$inferSelect,
    price: number,
) => {
    if (buyerWallet.freezeIncome >= price) {
        await db.update(wallet).set({
            freezeIncome: buyerWallet.freezeIncome - price,
        }).where(eq(wallet.userId, buyerWallet.userId));
        return true;
    }

    const totalBalance = buyerWallet.freezeIncome + buyerWallet.amountWithdraw;
    if (totalBalance >= price) {
        await db.update(wallet).set({
            freezeIncome: 0,
            amountWithdraw: buyerWallet.amountWithdraw + buyerWallet.freezeIncome - price,
        }).where(eq(wallet.userId, buyerWallet.userId));
        return true;
    }

    return false;
};

// 处理收入分配
export const handleIncomeDistribution = async (
    db: PostgresJsDatabase<typeof schema>,
    columnName: string,
    actualIncome: number,
    authorRate: number,
    authorWallet: typeof wallet.$inferSelect,
    firstClassReferrerWallet?: typeof wallet.$inferSelect,
    secondClassReferrerWallet?: typeof wallet.$inferSelect,
    distributorshipRate?: number,
    extendRate?: number,
) => {
    const updates: Promise<any>[] = [];
    const waterRecords: Promise<any>[] = [];

    // 作者收入
    const authorIncome = actualIncome * authorRate;
    updates.push(
        db.update(wallet)
            .set({ freezeIncome: authorWallet.freezeIncome + authorIncome })
            .where(eq(wallet.userId, authorWallet.userId))
    );
    waterRecords.push(
        db.insert(runningWater).values({
            userId: authorWallet.userId,
            price: authorIncome,
            name: `专栏《${columnName}》收益`,
            expenditureOrIncome: 1,
        })
    );

    // 一级分销收入
    if (firstClassReferrerWallet && distributorshipRate) {
        const firstClassIncome = actualIncome * distributorshipRate;
        updates.push(
            db.update(wallet)
                .set({ freezeIncome: firstClassReferrerWallet.freezeIncome + firstClassIncome })
                .where(eq(wallet.userId, firstClassReferrerWallet.userId))
        );
        waterRecords.push(
            db.insert(runningWater).values({
                userId: firstClassReferrerWallet.userId,
                price: firstClassIncome,
                name: `专栏《${columnName}》分销奖励`,
                expenditureOrIncome: 1,
            })
        );
    }

    // 二级分销收入
    if (secondClassReferrerWallet && extendRate) {
        const secondClassIncome = actualIncome * extendRate;
        updates.push(
            db.update(wallet)
                .set({ freezeIncome: secondClassReferrerWallet.freezeIncome + secondClassIncome })
                .where(eq(wallet.userId, secondClassReferrerWallet.userId))
        );
        waterRecords.push(
            db.insert(runningWater).values({
                userId: secondClassReferrerWallet.userId,
                price: secondClassIncome,
                name: `专栏《${columnName}》推广奖励`,
                expenditureOrIncome: 1,
            })
        );
    }

    await Promise.all([...updates, ...waterRecords]);
};
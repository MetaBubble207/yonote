import { RunningWaterSelect } from "@/server/db/schema";

export interface WalletData {
    amountWithdraw: number | null;
    freezeIncome: number | null;
}

export interface TransactionListProps {
    data: RunningWaterSelect[];
    currentType: number;
}

export type WeixinPayData = {
    appId: string;
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
    paySign: string;
}
export interface WalletData {
    amountWithdraw: number | null;
    freezeIncome: number | null;
}

export interface RunningWaterItem {
    id: string;
    name: string;
    price: number;
    createdAt: string;
    expenditureOrIncome: number;
}

export interface WeixinPayData {
    appId: string;
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
    paySign: string;
}

export interface TransactionListProps {
    data: RunningWaterItem[];
    currentType: number;
}
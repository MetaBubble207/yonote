export type PaymentState = {
    showTopUp: boolean;
    showConfirm: boolean;
    showOrder: boolean;
    rechargeAmount: number;
};

export type PaymentInfo = {
    shouldShow: boolean;
    needRecharge: boolean;
    buttonText: string;
    handleClick: () => void;
    rechargeAmount: number;
    price?: number;
    timeLimit?: number;
};
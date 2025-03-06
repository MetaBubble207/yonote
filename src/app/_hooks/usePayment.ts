import { useCallback, useMemo, useState, useEffect } from 'react';
import { api } from "@/trpc/react";
import { isPriceListValid } from "@/app/_utils/isValid";
import type { ColumnSelect, PriceListSelect } from "@/server/db/schema";
import { PaymentInfo, PaymentState } from '../_types/payment';
import { MessageInstance } from 'antd/lib/message/interface';

export const usePayment = (
    selectedItem: PriceListSelect | undefined,
    balance: number,
    token: string | null,
    columnData: ColumnSelect | undefined,
    onClose: () => void,
    messageApi: MessageInstance,
    refetch: () => void
) => {
    const [state, setState] = useState<PaymentState>({
        showTopUp: false,
        showConfirm: false,
        showOrder: false,
        showShare: false,
        rechargeAmount: 0,
    });

    // 确保所有必要的数据都存在
    const isReady = Boolean(token && columnData);

    const subscribeOrder = api.order.createOrder.useMutation({
        onSuccess: () => {
            messageApi.success("订阅成功", 1).then(() => {
                refetch();
                setState(prev => ({...prev, showOrder: false, showShare: true }) )
            });
        },
        onError: () => messageApi.error("订阅失败"),
    });

    const recharge = api.wallet.recharge.useMutation({
        onSuccess: (r) => {
            if (r.success) {
                messageApi.success("充值成功");
                handleWeixinPay(r.data);
            } else {
                messageApi.error("充值失败");
                setState(prev => ({ ...prev, showTopUp: false }));
            }
        },
        onError: () => {
            messageApi.error("充值失败");
            setState(prev => ({ ...prev, showTopUp: false }));
        },
    });

    const handlePay = useCallback(() => {
        if (!isReady || !columnData || !selectedItem || !token) return;

        if (balance < selectedItem.price) {
            messageApi.error("钱包余额不足，请先充值噢~😁");
            setState(prev => ({ ...prev, showTopUp: true, showConfirm: false }));
            return;
        }

        subscribeOrder.mutate({
            ownerId: columnData.userId,
            columnId: columnData.id,
            priceListId: selectedItem.id,
            payment: "wallet",
            status: true,
            buyerId: token,
        });
    }, [isReady, selectedItem, balance, token, columnData, messageApi, subscribeOrder]);

    const handleWeixinPay = useCallback((payData: any) => {
        if (!isReady) return;

        window.WeixinJSBridge?.invoke(
            "getBrandWCPayRequest",
            {
                appId: payData.appId,
                timeStamp: payData.timeStamp,
                nonceStr: payData.nonceStr,
                package: payData.package,
                signType: payData.signType,
                paySign: payData.paySign,
            },
            (res: { err_msg: string }) => {
                if (res.err_msg === "get_brand_wcpay_request:ok") {
                    handlePay();
                }
                setState(prev => ({ ...prev, showTopUp: false }));
            }
        );
    }, [isReady, handlePay]);

    const handleRecharge = useCallback((amount: number) => {
        if (!isReady || !columnData || !token) return;

        recharge.mutate({
            userId: token,
            amount,
            notifyUrl: window?.location?.origin + `/dashboard/special-column?id=${columnData.id}`,
        });
    }, [isReady, token, columnData, recharge]);

    const handleNeedRecharge = useCallback((amount: number) => {
        setState(prev => ({
            ...prev,
            rechargeAmount: amount,
            showTopUp: true,
            showOrder: false
        }));
    }, []);

    const paymentInfo = useMemo((): PaymentInfo => {
        if (!isReady || !isPriceListValid(selectedItem)) {
            return {
                shouldShow: false,
                needRecharge: false,
                buttonText: "支付",
                handleClick: () => { },
                rechargeAmount: 0,
            };
        }

        const needRecharge = balance < selectedItem.price;
        const rechargeAmount = selectedItem.price - balance;

        return {
            shouldShow: true,
            needRecharge,
            buttonText: needRecharge ? `充值并支付（¥${rechargeAmount}）` : "支付",
            handleClick: needRecharge
                ? () => handleNeedRecharge(rechargeAmount)
                : handlePay,
            rechargeAmount,
            price: selectedItem.price,
            timeLimit: selectedItem.timeLimit,
        };
    }, [isReady, selectedItem, balance, handlePay, handleNeedRecharge]);

    // 当数据未准备好时，重置状态
    useEffect(() => {
        if (!isReady) {
            setState({
                showTopUp: false,
                showConfirm: false,
                showOrder: false,
                showShare: false,
                rechargeAmount: 0,
            });
        }
    }, [isReady]);

    return {
        state,
        setState,
        paymentInfo,
        handlePay,
        handleRecharge,
        isReady,
    };
};
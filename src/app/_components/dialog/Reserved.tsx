"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { message } from "antd";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import Loading from "@/app/_components/common/Loading";
import { type PriceList } from "@/server/db/schema";
import { ConfirmPayModal, OrderModal, TopUpModal } from "../dashboard/special-column/modals/Modals";
import { PriceItem } from "../dashboard/special-column/PriceItem";
import { ReservedProps } from "@/app/dashboard/special-column/types";

type WeixinJSBridgeResponse = {
  err_msg: "get_brand_wcpay_request:ok" | "get_brand_wcpay_request:cancel" | "get_brand_wcpay_request:fail";
  err_desc?: string;
};

const Reserved: React.FC<ReservedProps> = ({ onClose, check, columnId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [token] = useLocalStorage("token", null);
  const [selectedItem, setSelectedItem] = useState<PriceList>();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showConfirmPayModal, setConfirmPayModal] = useState(false);
  const [showOrderModel, setShowOrderModel] = useState(false);

  const { data, isLoading } = api.priceList.getReservedData.useQuery(
    { columnId, buyerId: token },
    { enabled: !!columnId && !!token }
  );

  // 初始化选中项
  useEffect(() => {
    if (data && data?.priceListData?.length > 0) {
      setSelectedItem(data.priceListData[0]);
    }
  }, [data?.priceListData]);

  // 支付相关处理
  const subscribeOrder = api.order.createOrder.useMutation({
    onSuccess: () => {
      messageApi.success("订阅成功", 1).then(() => {
        onClose();
        window?.location?.reload();
      });
    },
    onError: (e) => {
      console.error(e);
      messageApi.error("订阅失败");
    },
  });

  const handlePay = useCallback(async () => {
    if (!data?.walletData || !data?.columnData) return;

    if (!selectedItem) {
      messageApi.error("请先选择支付策略噢~😁");
      setConfirmPayModal(false);
      return;
    }

    const balance = data.walletData.freezeIncome ?? 0 + (data.walletData.amountWithdraw ?? 0);
    if (balance < selectedItem.price) {
      messageApi.error("钱包余额不足，请先充值噢~😁");
      setShowTopUpModal(true);
      setConfirmPayModal(false);
      return;
    }

    if (check) {
      subscribeOrder.mutate({
        ownerId: data.columnData.userId,
        columnId,
        priceListId: selectedItem.id,
        payment: "wallet",
        status: check,
        buyerId: token,
      });
    }
  }, [selectedItem, data, check, columnId, token, messageApi, subscribeOrder]);

  const handleRecharge = useCallback((amount: number) => {
    recharge.mutate({
      userId: token,
      amount,
      notifyUrl: window?.location?.origin + `/dashboard/special-column?id=${columnId}`,
    });
  }, [token, columnId]);

  const onBridgeReady = useCallback((payData: any) => {
    window.WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      {
        appId: payData.appId,
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.package,
        signType: payData.signType,
        paySign: payData.paySign,
      },
      function (res: WeixinJSBridgeResponse) {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          setShowOrderModel(false);
          handlePay();
        }
      },
    );
  }, [handlePay]);

  const recharge = api.wallet.recharge.useMutation({
    onSuccess: (r) => {
      if (typeof window.WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", () => onBridgeReady(r.data), false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", () => onBridgeReady(r.data));
          document.attachEvent("onWeixinJSBridgeReady", () => onBridgeReady(r.data));
        }
      } else if (r.success) {
        onBridgeReady(r.data);
      } else {
        messageApi.error("充值失败");
        setShowOrderModel(false);
      }
    },
    onError: () => {
      messageApi.error("充值失败");
      setShowOrderModel(false);
    },
  });

  if (isLoading) {
    return <Loading className="mt-50" />;
  }

  if (!data || !data.columnData || !data.priceListData || !data.walletData) {
    messageApi.error("获取数据失败😣");
    return null;
  }

  const balance = data.walletData.freezeIncome ?? 0 + (data.walletData.amountWithdraw ?? 0);

  return (
    <div className="fixed z-100 bottom-0 w-full h-screen bg-#000 bg-op-70">
      <div className="absolute bottom-0 w-full">
        {contextHolder}
        {showTopUpModal && (
          <TopUpModal
            onClose={() => setShowTopUpModal(false)}
            onConfirm={() => {
              setShowTopUpModal(false);
              setConfirmPayModal(true);
            }}
          />
        )}
        {showConfirmPayModal && (
          <ConfirmPayModal
            onClose={() => setConfirmPayModal(false)}
            onConfirm={() => {
              setConfirmPayModal(false);
              if (!selectedItem) {
                messageApi.error("请先选择支付策略噢~😁");
                return;
              }
              setShowOrderModel(true);
            }}
          />
        )}
        {showOrderModel && selectedItem && (
          <OrderModal
            onClose={() => setShowOrderModel(false)}
            onConfirm={handlePay}
            columnName={data.columnData.name || ''}
            selectedItem={selectedItem}
            balance={balance}
            onTopUp={handleRecharge}
          />
        )}

        <div className="b-white bg-#fff rounded-t-30px flex w-full flex-col items-center justify-center border-t-2 pb-10 pt-2">
          <Image
            src="/images/dialog/Close-small.png"
            alt="close"
            width={20}
            height={20}
            className="w-20px h-20px ml-335px"
            onClick={onClose}
          />
          <div className="text-3.75 font-500 lh-6 mt-2 items-center justify-center text-[#252525]">
            「{data.columnData.name?.length >= 18 ? `${data.columnData.name.substring(0, 18)}...` : data.columnData.name}」
          </div>
          <div className="mt-6 pl-5 space-y-2">
            {data.priceListData.map((strategy) => (
              <PriceItem
                key={strategy.id}
                strategy={strategy}
                isSelected={selectedItem?.id === strategy.id}
                onSelect={setSelectedItem}
              />
            ))}
            {data.priceListData.length === 0 && (
              <span>该专栏还没设置定价策略噢~</span>
            )}
          </div>
          <div className="w-85 text-2.5 font-500 lh-6 m-auto mt-4 text-[#666]">
            *内容为第三方个人创建，购买前请知晓内容，服务及相关风险，购买后 24 小时内可申请退款
          </div>
          <div className="w-85.75 mt-8 h-10">
            <button
              onClick={() => setConfirmPayModal(true)}
              className="w-full h-full bg-#5CE5C1 rounded-full flex items-center justify-center"
            >
              <span className="fw-500">支付</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reserved;
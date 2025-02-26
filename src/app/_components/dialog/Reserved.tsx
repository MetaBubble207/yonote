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

const Reserved: React.FC<ReservedProps> = ({ onClose, check, columnId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [token] = useLocalStorage("token", null);

  // API 查询
  const { data: columnUserId } = api.column.getUserId.useQuery({ id: columnId });
  const { data: column, isLoading: isColumnLoading } = api.column.getColumnDetail.useQuery(columnId);
  const { data: priceListData = [] } = api.priceList.getByColumnId.useQuery(
    { columnId: columnId },
    { enabled: !!columnId }
  );
  const { data: walletData } = api.wallet.getByUserId.useQuery(
    { id: token },
    { enabled: !!token }
  );

  // 状态管理
  const [selectedItem, setSelectedItem] = useState<PriceList>();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showConfirmPayModal, setConfirmPayModal] = useState(false);
  const [showOrderModel, setShowOrderModel] = useState(false);

  // 初始化选中项
  useEffect(() => {
    if (priceListData?.length > 0) {
      setSelectedItem(priceListData[0]);
    }
  }, [priceListData]);

  // 支付相关处理
  const subscribeOrder = api.order.createOrder.useMutation({
    onSuccess: () => {
      message.success("订阅成功", 1).then(() => {
        onClose();
        window?.location?.reload();
      });
    },
    onError: (e) => {
      console.error(e);
      message.error("订阅失败");
    },
  });

  const handlePay = useCallback(async () => {
    if (!selectedItem) {
      messageApi.error("请先选择支付策略噢~😁");
      setConfirmPayModal(false);
      return;
    }

    const balance = walletData?.freezeIncome ?? 0 + (walletData?.amountWithdraw ?? 0);
    if (!walletData || balance < selectedItem.price) {
      messageApi.error("钱包余额不足，请先充值噢~😁");
      setShowTopUpModal(true);
      setConfirmPayModal(false);
      return;
    }

    if (check) {
      subscribeOrder.mutate({
        ownerId: columnUserId,
        columnId,
        priceListId: selectedItem.id,
        payment: "wallet",
        status: check,
        buyerId: token,
      });
    }
  }, [selectedItem, walletData, check, columnUserId, columnId, token, messageApi, subscribeOrder]);

  function onBridgeReady(data) {
    console.log("data ==>", data);
    window.WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      {
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
      },
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          setShowOrderModel(false);
          pay();
        }
      },
    );
  }

  const recharge = api.wallet.recharge.useMutation({
    onSuccess: (r) => {
      if (typeof window.WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false,
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        if (r.success) {
          onBridgeReady(r.data);
        } else {
          messageApi.error("充值失败");
          setShowOrderModel(false);
        }
      }
    },
    onError: (e) => {
      messageApi.error("充值失败");
      setShowOrderModel(false);
    },
  });

  // 渲染加载状态
  if (isColumnLoading) {
    return <Loading className="mt-50"/>;
  }

  // 计算余额
  const balance = walletData ? walletData?.freezeIncome ?? 0 + (walletData?.amountWithdraw ?? 0) : 0;


  return (
    <div className="fixed z-100 bottom-0 w-full h-screen bg-#000 bg-op-70">
      <div className="absolute bottom-0 w-full">
        {contextHolder}

        {/* 模态框组件 */}
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
              setShowOrderModel(true);
              if (!selectedItem) {
                messageApi.error("请先选择支付策略噢~😁");
              }
            }}
          />
        )}
        {showOrderModel && selectedItem && (
          <OrderModal
            onClose={() => setShowOrderModel(false)}
            onConfirm={handlePay}
            columnName={column?.name || ''}
            selectedItem={selectedItem}
            balance={balance}
            onTopUp={(amount) => {
              recharge.mutate({
                userId: token,
                amount: amount,
                notifyUrl:
                  window?.location?.origin + `/dashboard/special-column?id=${columnId}`,
              });
            }}
          />
        )}

        {/* 主内容 */}
        <div className="b-white bg-#fff rounded-t-30px flex w-full flex-col items-center justify-center border-t-2 pb-10 pt-2">
          <Image
            src="/images/dialog/Close-small.png"
            alt="close"
            width={20}
            height={20}
            className="w-20px h-20px ml-335px"
            onClick={onClose}
          />

          {/* 标题 */}
          <div className="text-3.75 font-500 lh-6 mt-2 items-center justify-center text-[#252525]">
            「{column?.name?.length >= 18 ? `${column.name.substring(0, 18)}...` : column.name}」
          </div>

          {/* 价格列表 */}
          <div className="mt-6 pl-5 space-y-2">
            {priceListData.map((strategy) => (
              <PriceItem
                key={strategy.id}
                strategy={strategy}
                isSelected={selectedItem?.id === strategy.id}
                onSelect={setSelectedItem}
              />
            ))}
            {priceListData.length === 0 && (
              <span>该专栏还没设置定价策略噢~</span>
            )}
          </div>

          {/* 提示信息 */}
          <div className="w-85 text-2.5 font-500 lh-6 m-auto mt-4 text-[#666]">
            *内容为第三方个人创建，购买前请知晓内容，服务及相关风险，购买后 24 小时内可申请退款
          </div>

          {/* 支付按钮 */}
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
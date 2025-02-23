"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { useSearchParams } from "next/navigation";
import { Button, message, Modal } from "antd";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import Loading from "@/app/_components/common/Loading";
import { type PriceList } from "@/server/db/schema";

const Reserved = ({ onClose, check }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const params = useSearchParams();
  const columnId = params.get("id");
  const [token] = useLocalStorage("token", null);
  const columnUserId = api.column.getUserId.useQuery({ id: columnId });
  const { data: column, isLoading: isColumnLoading } =
    api.column.getColumnDetail.useQuery(columnId);
  const priceListData = api.priceList.getByColumnId
    .useQuery({ columnId: columnId }, { enabled: !!columnId })
    .data?.sort((a, b) => a.id - b.id);
  const walletData = api.wallet.getByUserId.useQuery(
    { id: token },
    { enabled: !!token },
  ).data;
  const subscribeOrder = api.order.createOrder.useMutation({
    onSuccess: (r) => {
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

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showConfirmPayModal, setConfirmPayModal] = useState(false);
  const [showOrderModel, setShowOrderModel] = useState(false);
  const handleClickPay = () => {
    setShowTopUpModal(false);
    setConfirmPayModal(true);
  };
  const handleCancelPay = () => {
    setConfirmPayModal(false);
  };

  const [selectedItem, setSelectedItem] = useState<PriceList>(); // 追踪选中的item

  useEffect(() => {
    if (priceListData?.length === 0) return;
    // @ts-ignore
    setSelectedItem({ ...priceListData?.[0] });
  }, [priceListData]);

  const handleButtonClick = (item) => {
    if (selectedItem === item) {
      // 如果点击的是当前选中的item，则取消选中状态
      setSelectedItem(null);
    } else {
      // 否则设置点击的item为选中状态
      setSelectedItem(item);
    }
  };

  const popUpConfirmPayModal = () => {
    setShowTopUpModal(false);
    setConfirmPayModal(true);
  };
  const popUpOrderModal = () => {
    setConfirmPayModal(false);
    setShowOrderModel(true);
  };

  const pay = async () => {
    if (!selectedItem) {
      messageApi.error("请先选择支付策略噢~😁");
      setConfirmPayModal(false);
      return false;
    }
    if (
      !walletData ||
      walletData.freezeIncome + walletData.amountWithdraw < selectedItem.price
    ) {
      messageApi.error("钱包余额不足，请先充值噢~😁");
      setShowTopUpModal(true);
      setConfirmPayModal(false);
      return false;
    }
    // 支付
    if (check) {
      // 在组件渲染完成后执行订阅订单操作
      subscribeOrder.mutate({
        ownerId: columnUserId.data,
        columnId: columnId,
        priceListId: selectedItem.id,
        payment: "wallet",
        status: check,
        buyerId: token,
      });
    }
  };

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

  const topUp = (money: number) => {
    recharge.mutate({
      userId: token,
      amount: money,
      notifyUrl:
        window?.location?.origin + `/dashboard/special-column?id=${columnId}`,
    });
  };

  const TopUpModal = () => {
    return (
      <W100H50Modal>
        <div>
          <label htmlFor="">输入充值金额</label>
          <input type="text" />
        </div>
        <button onClick={() => popUpConfirmPayModal()}>充值</button>
      </W100H50Modal>
    );
  };

  const ConfirmPayModal = () => {
    return (
      <W100H50Modal>
        <div>确定是否购买该专栏</div>
        <div className={"mt-5 flex space-x-10"}>
          <Button onClick={popUpOrderModal}>确认</Button>
          <Button onClick={handleCancelPay}>取消</Button>
        </div>
      </W100H50Modal>
    );
  };

  const OrderModel = () => {
    const { amountWithdraw, freezeIncome } = walletData;
    const balance = amountWithdraw + freezeIncome;
    const needTopUp = balance < selectedItem.price;
    return (
      <Modal
        title="确认订单"
        centered
        open={showOrderModel}
        onCancel={() => setShowOrderModel(false)}
        footer={null}
      >
        <div className={"mt-6 flex w-full items-center justify-between"}>
          <div className={"h-10 w-40 overflow-scroll"}>{column.name}</div>
          <div>
            {selectedItem.timeLimit >= 99999
              ? `${selectedItem.price}/永久`
              : `${selectedItem.price}/${selectedItem.timeLimit}天`}
          </div>
        </div>
        <div className={"my-6"}>
          <span>余额: ¥{balance}</span>
          {needTopUp && (
            <span className={"text-red"}>
              （还需充值¥{selectedItem.price - balance}~😁）
            </span>
          )}
        </div>
        {needTopUp ? (
          <Button
            style={{ width: "20rem" }}
            type="primary"
            onClick={() => topUp(selectedItem.price - balance)}
          >
            充值并支付（¥{selectedItem.price - balance}）
          </Button>
        ) : (
          <Button style={{ width: "20rem" }} type="primary" onClick={pay}>
            支付
          </Button>
        )}
      </Modal>
    );
  };
  if (isColumnLoading)
    return (
      <div
        className={
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        }
      >
        <Loading />
      </div>
    );
  return (
    <div className="fixed bottom-0 w-full">
      {contextHolder}
      {showTopUpModal && <TopUpModal />}
      {showConfirmPayModal && <ConfirmPayModal />}
      {showOrderModel && <OrderModel />}
      <div className="b-white bg-#fff rounded-t-30px border-t-primary flex w-full flex-col items-center justify-center border-t-2 pb-10 pt-2">
        <Image
          src={"/images/dialog/Close-small.png"}
          alt="close"
          width={20}
          height={20}
          className="w-20px h-20px ml-335px"
          onClick={onClose}
        ></Image>
        <div className="text-3.75 font-500 lh-6 mt-2 items-center justify-center text-[#252525]">
          「
          {column?.name?.length >= 18
            ? column?.name?.substring(0, 18) + "..."
            : column.name}
          」
        </div>
        <div className="mt-6 pl-5">
          {priceListData?.map((strategy, index) => (
            <button
              key={index}
              className={`w-84.25 border-rd-1.25 border-1 h-10 shrink-0 justify-center border-solid bg-[#F5F7FB] ${selectedItem?.id === strategy?.id ? "border-[#45E1B8]" : ""} ${index > 0 ? "mt-2" : ""}`}
              onClick={() => handleButtonClick(strategy)}
            >
              <div className="relative ml-2.5 flex items-center">
                <div className="font-700 lh-6 shrink-0 text-[#252525]">
                  ¥{strategy.price}
                </div>
                <div className="text-3 font-500 lh-6 ml-1 text-[#B5B5B5]">
                  {strategy.timeLimit >= 99999
                    ? "一次购买，永久有效"
                    : `限时购买，有效期${strategy.timeLimit}天`}
                </div>
                {selectedItem?.id === strategy?.id && (
                  <Image
                    src="/images/dialog/check.png"
                    alt="check"
                    width={24}
                    height={24}
                    className="absolute right-2.5"
                  />
                )}
              </div>
            </button>
          ))}
          {(!priceListData || priceListData?.length < 1) && (
            <span>该专栏还没设置定价策略噢~</span>
          )}
        </div>
        <div className="w-85 text-2.5 font-not-italic font-500 lh-6 m-auto mt-4 text-[#666]">
          *内容为第三方个人创建，购买前请知晓内容，服务及相关风险，购买后 24
          小时内可申请退款
        </div>
        <div className="w-85.75 mt-8 h-10 shrink-0">
          <Button
            onClick={handleClickPay}
            style={{
              backgroundColor: "#5CE5C1",
              width: "21.4375rem",
              height: "2.5rem",
              borderRadius: "9999px",
            }}
          >
            {/* 支付跳转 */}
            <span className={"fw-500"}>支付</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reserved;

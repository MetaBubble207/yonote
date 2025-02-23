"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { api } from "@/trpc/react";
import Loading from "../../../_components/common/Loading";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { time2DateTimeStringMinutes } from "@/tools/timeToString";
import { message, Modal } from "antd";
import withTheme from "@/theme";
import NoData from "@/app/_components/common/NoData";

const Wallet = function () {
  const [token] = useLocalStorage("token", null);
  const {
    data: walletData,
    isLoading: isWalletLoading,
    refetch: walletDataRefetch,
  } = api.wallet.getByUserId.useQuery(
    { id: token },
    { enabled: Boolean(token) },
  );
  const { data: runningWaterData, isLoading: isRunningWaterLoading } =
    api.runningWater.getRunningWater.useQuery({ id: token });

  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [payOpen, setPayOpen] = useState(false);
  const payRef = useRef<HTMLInputElement | null>(null);
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
        }
      }
    },
  });
  const afterRecharge = api.wallet.afterRecharge.useMutation({
    onSuccess: (r) => {
      walletDataRefetch();
    },
  });
  const withdraw = api.wallet.withdraw.useMutation({
    onSuccess: (r) => {
      setOpen(false);
      messageApi
        .open({
          type: "success",
          content: `提现成功${r?.amountWithdraw}`,
        })
        .then(() => {
          window?.location?.reload();
        });
    },
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    if (walletData?.amountWithdraw <= 0) {
      messageApi.open({
        type: "error",
        content: "可提现的余额不足",
      });
    } else {
      setOpen(true);
    }
  };

  const handleOk = () => {
    setConfirmLoading(true);
    withdraw.mutate({
      id: token,
    });
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePayOk = () => {
    const amount = payRef.current?.value;
    if (!amount) {
      setPayOpen(false);
      return;
    }
    recharge.mutate({
      userId: token,
      notifyUrl: window?.location?.origin + "/dashboard/user/wallet",
      amount: parseFloat(amount),
    });
    setPayOpen(false);
  };

  const handlePayCancel = () => {
    setPayOpen(false);
  };
  const [currentType, setCurrentType] = useState(0);

  const changeType = (type: number) => {
    if (currentType !== type) {
      // 如果点击的是当前选中的按钮，则取消选中状态
      setCurrentType(type);
    }
  };

  function onBridgeReady(data) {
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
          const amount = payRef.current?.value;
          if (!amount) {
            setPayOpen(false);
            return;
          }
          afterRecharge.mutate({
            userId: token,
            amount: parseFloat(amount),
          });
          setPayOpen(false);
        }
      },
    );
  }

  if (isWalletLoading || isRunningWaterLoading) return <Loading />;

  const List = () => {
    const data = runningWaterData.filter(
      (item) => item.expenditureOrIncome === currentType,
    );
    if (!data || data.length === 0)
      return (
        <NoData
          title={`当前还没有${currentType === 0 ? "支出" : "收入"}噢😯`}
        />
      );
    return data.map((item) => (
      <div key={item.id}>
        <div className="ml-0">
          <div className="w-27 text-3.25 font-not-italic font-400 lh-6 text-[#252525]">
            {item.name}
          </div>
          <div className="w-26.5 h-6.25 text-2.75 font-not-italic font-400 lh-6 mt--1 shrink-0 text-[#999]">
            {time2DateTimeStringMinutes(item.createdAt)}
          </div>
        </div>
        <div className="w-20.75 h-5.5 text-3.75 font-700 lh-6 ml-60 mt--11 shrink-0 text-right text-[#252525]">
          {item.expenditureOrIncome === 0 ? "-" : "+"}￥{item.price}
        </div>
        <div className="border-1 mt-5"></div>
        <div className="mt-4"></div>
      </div>
    ));
  };

  const Card = () => {
    return (
      <div className="w-85.75 h-41 relative">
        <Image
          src={"/images/wallet/bg.svg"}
          alt={"bg"}
          width={343}
          height={164}
          className="w-85.75 h-41 shrink-0"
        ></Image>
        <div className="w-85.75 h-41 absolute top-0 shrink-0">
          <div className="flex flex-col">
            <div className="text-4 font-not-italic font-400 lh-6 ml-6 mt-6 w-16 text-[#FFF]">
              账户余额
            </div>
            <div className="w-25 font-D-DIN text-6 font-not-italic font-700 lh-6 ml-6 mt-2 text-[#FFF]">
              ¥{walletData?.amountWithdraw + walletData?.freezeIncome}
            </div>
            <div className="flex h-6 shrink-0 flex-wrap text-[#FFF]">
              <div className="ml-6 mt-9">
                冻结中 <span>¥{walletData?.freezeIncome}</span>
              </div>
              <div className="ml-11.75 mt-9">
                可提现 <span>¥{walletData?.amountWithdraw}</span>
              </div>
            </div>
            <div className="w-7.5 text-3 font-500 lh-6 ml-73.75 mt--8 text-[#252525]">
              <button onClick={showModal} className={"bg-transparent"}>
                提现
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mt-8 flex items-center justify-center">
        <Card />
      </div>
      <div className="h-7.75 ml-9 mt-6 flex w-14 shrink-0 flex-col items-center justify-center">
        <div className="text-3.5 font-not-italic font-500 lh-6 text-[#252525]">
          收支明细
        </div>
        <div className="w-2.75 border-rd-2 h-1 shrink-0 bg-[#45E1B8]"></div>
      </div>
      <div className="ml-9 mt-4 flex">
        <button
          className={`w-15 border-rd-1 h-6 shrink-0 ${currentType === 0 ? "bg-#daf9f1 text-#1db48d" : "bg-[#F5F7FB] text-[#252525]"}`}
          onClick={() => changeType(0)}
        >
          支出
        </button>
        <button
          className={`w-15 border-rd-1 ml-6 h-6 shrink-0 ${currentType === 1 ? "bg-#daf9f1 text-#1db48d" : "bg-[#F5F7FB] text-[#252525]"}`}
          onClick={() => changeType(1)}
        >
          收入
        </button>
        <button
          className={
            "w-15 border-rd-1 ml-30 bg-#daf9f1 text-#1db48d h-6 shrink-0"
          }
          onClick={() => setPayOpen(true)}
        >
          充值
        </button>
      </div>
      <div>
        <div className="ml-6.5 w-80.5 h-14.25 mt-4 flex shrink-0 items-center justify-center">
          <div className="w-80.5 h-14.25 shrink-0">
            <List />
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div>确认要提现￥{walletData.amountWithdraw}吗</div>
      </Modal>
      <Modal
        title="充值"
        width={"20"}
        open={payOpen}
        onOk={handlePayOk}
        onCancel={handlePayCancel}
      >
        <div className={"flex h-20 items-center justify-center"}>
          <input
            type="text"
            className={"h-10 w-full px-4"}
            ref={payRef}
            placeholder={"输入要充值的金额（单位：元）"}
          />
        </div>
      </Modal>
      {contextHolder}
    </div>
  );
};

const Page = () => {
  return withTheme(<Wallet />);
};

export default Page;

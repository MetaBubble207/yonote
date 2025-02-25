"use client";
import React, { useRef, useState, useCallback } from "react";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { message, Modal } from "antd";
import Loading from "@/app/_components/common/Loading";
import { handleWeixinPay } from "@/app/_utils/weixinPay";
import { WalletCard } from "@/app/_components/dashboard/user/WalletCard";
import { TransactionList } from "@/app/_components/dashboard/user/TransactionList";
import withTheme from "@/theme";

export default function Page() {
  const [token] = useLocalStorage("token", null);
  const { data: walletData, isLoading: isWalletLoading, refetch } = api.wallet.getByUserId.useQuery(
    { id: token },
    { enabled: Boolean(token) }
  );
  const { data: runningWaterData, isLoading: isRunningWaterLoading } = api.runningWater.getRunningWater.useQuery({ id: token });

  const [messageApi, contextHolder] = message.useMessage();
  const [currentType, setCurrentType] = useState(0);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const payRef = useRef<HTMLInputElement>(null);

  // API mutations
  const recharge = api.wallet.recharge.useMutation({
    onSuccess: (r) => {
      if (r.success) {
        handleWeixinPay(r.data, handleRechargeSuccess);
      }
    }
  });

  const afterRecharge = api.wallet.afterRecharge.useMutation({
    onSuccess: () => refetch()
  });

  const withdraw = api.wallet.withdraw.useMutation({
    onSuccess: (r) => {
      setWithdrawOpen(false);
      messageApi.success(`提现成功${r?.amountWithdraw}`).then(() => {
        window?.location?.reload();
      });
    }
  });

  // 处理函数
  const handleWithdraw = useCallback(() => {
    if (!walletData || !walletData.amountWithdraw) {
      messageApi.error("可提现的余额不足");
      return;
    }
    if (walletData.amountWithdraw <= 0) {
      messageApi.error("可提现的余额不足");
    } else {
      setWithdrawOpen(true);
    }
  }, [walletData?.amountWithdraw, messageApi]);

  const handleWithdrawConfirm = useCallback(() => {
    setConfirmLoading(true);
    withdraw.mutate({ id: token });
    setConfirmLoading(false);
  }, [token, withdraw]);

  const handleRecharge = useCallback(() => {
    const amount = payRef.current?.value;
    if (!amount) return;

    recharge.mutate({
      userId: token,
      notifyUrl: window?.location?.origin + "/dashboard/user/wallet",
      amount: parseFloat(amount)
    });
    setPayOpen(false);
  }, [token, recharge]);

  const handleRechargeSuccess = useCallback(() => {
    const amount = payRef.current?.value;
    if (!amount) return;

    afterRecharge.mutate({
      userId: token,
      amount: parseFloat(amount)
    });
    setPayOpen(false);
  }, [token, afterRecharge]);

  if (isWalletLoading || isRunningWaterLoading) return <Loading />;

  return (
    <div>
      <div className="mt-8 flex items-center justify-center">
        <WalletCard walletData={walletData} onWithdraw={handleWithdraw} />
      </div>

      {/* 收支明细标题 */}
      <div className="h-7.75 ml-9 mt-6 flex w-14 shrink-0 flex-col items-center justify-center">
        <div className="text-3.5 font-not-italic font-500 lh-6 text-[#252525]">
          收支明细
        </div>
        <div className="w-2.75 border-rd-2 h-1 shrink-0 bg-[#45E1B8]" />
      </div>

      {/* 操作按钮 */}
      <div className="ml-9 mt-4 flex">
        {["支出", "收入"].map((text, index) => (
          <button
            key={text}
            className={`w-15 border-rd-1 h-6 shrink-0 ${index > 0 ? "ml-6" : ""} ${currentType === index ? "bg-#daf9f1 text-#1db48d" : "bg-[#F5F7FB] text-[#252525]"
              }`}
            onClick={() => setCurrentType(index)}
          >
            {text}
          </button>
        ))}
        <button
          className="w-15 border-rd-1 ml-30 bg-#daf9f1 text-#1db48d h-6 shrink-0"
          onClick={() => setPayOpen(true)}
        >
          充值
        </button>
      </div>

      {/* 交易列表 */}
      <div className="ml-6.5 w-80.5 h-14.25 mt-4 flex shrink-0 items-center justify-center">
        <div className="w-80.5 h-14.25 shrink-0">
          <TransactionList data={runningWaterData} currentType={currentType} />
        </div>
      </div>

      {/* 提现确认弹窗 */}
      {withTheme(<Modal
        open={withdrawOpen}
        onOk={handleWithdrawConfirm}
        confirmLoading={confirmLoading}
        onCancel={() => setWithdrawOpen(false)}
      >
        <div>确认要提现￥{walletData?.amountWithdraw ?? 0}吗</div>
      </Modal>)}

      {/* 充值弹窗 */}
      {withTheme(<Modal
        title="充值"
        width="20"
        open={payOpen}
        onOk={handleRecharge}
        onCancel={() => setPayOpen(false)}
      >
        <div className="flex h-20 items-center justify-center">
          <input
            type="text"
            className="h-10 w-full px-4"
            ref={payRef}
            placeholder="输入要充值的金额（单位：元）"
          />
        </div>
      </Modal>)}


      {contextHolder}
    </div>
  );
};
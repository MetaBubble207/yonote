"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { message } from "antd";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import Loading from "@/app/_components/common/Loading";
import { type PriceListSelect } from "@/server/db/schema";
import { PriceItem } from "../dashboard/special-column/PriceItem";
import type { ReservedProps } from "@/app/dashboard/special-column/types";
import { usePayment } from "@/app/_hooks/usePayment";
import { PaymentModals } from "../dashboard/special-column/modals/Modals";

const Reserved: React.FC<ReservedProps> = ({ onClose, columnId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [token] = useLocalStorage("token", null);
  const [selectedItem, setSelectedItem] = useState<PriceListSelect>();

  const { data, isLoading } = api.priceList.getReservedData.useQuery(
    { columnId, buyerId: token },
    { enabled: !!columnId && !!token }
  );

  const balance = data?.walletData?.freezeIncome ?? 0 + (data?.walletData?.amountWithdraw ?? 0);

  const {
    state,
    setState,
    paymentInfo,
    handleRecharge,
    isReady,
  } = usePayment(selectedItem, balance, token, data?.columnData, onClose, messageApi);

  useEffect(() => {
    if (data?.priceListData && data.priceListData.length > 0) {
      setSelectedItem(data.priceListData[0]);
    }
  }, [data?.priceListData]);

  if (isLoading || !isReady) {
    return <Loading className="fixed z-200 top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-op-70" />;
  }

  if (!data?.columnData || !data.priceListData || !data.walletData) {
    messageApi.error("获取数据失败😣");
    return null;
  }

  return (
    <div className="fixed z-100 bottom-0 w-full h-screen bg-#000 bg-op-70">
      <div className="absolute bottom-0 w-full">
        {contextHolder}

        <PaymentModals
          state={state}
          setState={setState}
          paymentInfo={paymentInfo}
          handleRecharge={handleRecharge}
          columnData={data.columnData}
          balance={balance}
        />

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
              onClick={() => setState(prev => ({ ...prev, showConfirm: true }))}
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
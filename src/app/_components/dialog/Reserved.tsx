"use client";
import './reserved.css'
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Drawer } from "antd";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { type PriceListSelect } from "@/server/db/schema";
import { PriceItem } from "../dashboard/special-column/PriceItem";
import type { ReservedProps } from "@/app/dashboard/special-column/types";
import { usePayment } from "@/app/_hooks/usePayment";
import { PaymentModals } from "../dashboard/special-column/modals/Modals";
import { ShareDialog } from './ShareDialog';
import { useRouter } from 'next/navigation';

const Reserved: React.FC<ReservedProps> = ({ onClose, columnId, open, messageApi, refetch }) => {
  const [token] = useLocalStorage("token", null);
  const [selectedItem, setSelectedItem] = useState<PriceListSelect>();

  const { data, isLoading } = api.priceList.getReservedData.useQuery(
    { columnId, buyerId: token },
    { enabled: !!columnId && !!token }
  );
  const { data: distributorshipData } = api.distributorshipDetail.getOne.useQuery(
    columnId,
    { enabled: Boolean(data?.columnData?.distributorship) }
  );
  const balance = data?.walletData?.freezeIncome ?? 0 + (data?.walletData?.amountWithdraw ?? 0);

  const {
    state,
    setState,
    paymentInfo,
    handleRecharge,
  } = usePayment(selectedItem, balance, token, data?.columnData, onClose, messageApi, refetch);

  useEffect(() => {
    if (data?.priceListData && data.priceListData.length > 0) {
      setSelectedItem(data.priceListData[0]);
    }
  }, [data?.priceListData]);

  const router = useRouter();

  const handleClickShare = () => {
    setState(prev => ({ ...prev, showShare: false }));
    router.push(`/dashboard/poster/column?id=${columnId}`)
  }

  const handleClickCopy = async () => {
    const currentUrl = `${window.location.origin}/dashboard/special-column?id=${columnId}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
        console.log("http://192.168.93.28:3001/dashboard/special-column?id=123123123 复制成功");

        messageApi.success("复制成功");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (!successful) throw new Error('复制失败');
        } finally {
          textArea.remove();
        }
        messageApi.success("复制成功");
      }
    } catch (err) {
      messageApi.error("复制失败，请重试");
    } finally {
      setState(prev => ({ ...prev, showShare: false }));
    }
  };

  const handleSharePanelClose = useCallback(() => setState(prev => ({ ...prev, showShare: false })), []);

  if (!isLoading && !open || (!data?.columnData || !data.priceListData || !data.walletData || !distributorshipData)) {
    return null;
  }

  return (
    <>
      <PaymentModals
        state={state}
        setState={setState}
        paymentInfo={paymentInfo}
        handleRecharge={handleRecharge}
        columnData={data.columnData}
        balance={balance}
      />
      <Drawer
        title={null}
        placement={'bottom'}
        closable={false}
        onClose={onClose}
        open={open}
        className="min-h-280px rounded-t-30px"
        height={'auto'}
      >
        <div className="flex flex-col justify-between">
          <Image
            src="/images/dialog/Close-small.png"
            alt="close"
            width={20}
            height={20}
            className="w-20px h-20px cursor-pointer ml-79"
            onClick={onClose}
          />
          <div className="b-white  rounded-t-30px flex w-full flex-col items-center justify-center border-t-2">
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
      </Drawer>
      <ShareDialog open={state.showShare} onClose={handleSharePanelClose}
        columnData={data.columnData} handleClickShare={handleClickShare} handleClickCopy={handleClickCopy}
      />
    </>
  );
};

export default Reserved;
import React from 'react';
import Image from "next/image";
import { Input } from "antd";
import type { RadioChangeEvent } from "antd";
import type { PaymentMode } from "../types";

interface BasicInfoProps {
  name: string;
  setName: (name: string) => void;
  columnId: string | null;
  paymentMode: PaymentMode;
  handlePaymentModeChange: (e: RadioChangeEvent) => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({
  name,
  setName,
  columnId,
  paymentMode,
  handlePaymentModeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* 名称输入 */}
      <div className="flex items-center">
        <label className="w-50 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
          名称：
        </label>
        <div className="ml-4 h-8 w-117">
          <Input
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="起个名字"
            className="h-full w-full px-3 outline-none text-3.5"
          />
        </div>
      </div>

      {/* 专栏ID */}
      <div className="flex items-center">
        <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
          专栏ID：
        </label>
        <span className="ml-4 text-3.5">{columnId}</span>
      </div>

      {/* 内容形式 */}
      <div className="flex items-center">
        <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
          内容形式：
        </label>
        <div className="ml-4 flex items-center">
          <Image
            src="/images/writer/create/radio-checked.svg"
            alt="check"
            width={20}
            height={20}
            className="h-4 w-4"
          />
          <span className="ml-2 text-3.5 text-[rgba(0,0,0,0.65)]">专栏</span>
        </div>
      </div>

      {/* 付费模式 */}
      <div className="w-full flex items-center">
        <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
          付费模式：
        </label>
        <div className="ml-4 flex space-x-8">
          <div className="flex items-center">
            <div className="relative mr-2 h-4 w-4">
              <input
                type="radio"
                id="permanent"
                name="paymentMode"
                value="permanent"
                checked={paymentMode === 'permanent'}
                onChange={(e) => handlePaymentModeChange({ target: { value: e.target.value } } as RadioChangeEvent)}
                className="absolute opacity-0 h-4 w-4 cursor-pointer"
              />
              <Image
                src={paymentMode === 'permanent' ? "/images/writer/create/radio-checked.svg" : "/images/writer/create/radio-unchecked.svg"}
                alt="radio"
                width={16}
                height={16}
                className="pointer-events-none"
              />
            </div>
            <label htmlFor="permanent" className="text-3.5 text-[rgba(0,0,0,0.85)] cursor-pointer">永久买断</label>
          </div>
          <div className="flex items-center">
            <div className="relative mr-2 h-4 w-4">
              <input
                type="radio"
                id="subscription"
                name="paymentMode"
                value="subscription"
                checked={paymentMode === 'subscription'}
                onChange={(e) => handlePaymentModeChange({ target: { value: e.target.value } } as RadioChangeEvent)}
                className="absolute opacity-0 h-4 w-4 cursor-pointer"
              />
              <Image
                src={paymentMode === 'subscription' ? "/images/writer/create/radio-checked.svg" : "/images/writer/create/radio-unchecked.svg"}
                alt="radio"
                width={16}
                height={16}
                className="pointer-events-none"
              />
            </div>
            <label htmlFor="subscription" className="text-3.5 text-[rgba(0,0,0,0.85)] cursor-pointer">限时订阅</label>
          </div>
        </div>
        <span className="ml-12 text-red-500">*</span>
        <span className="ml-2 text-3 text-[rgba(51,51,51,0.60)] shrink-0">
          提交后不可修改
        </span>
      </div>
    </div>
  );
};
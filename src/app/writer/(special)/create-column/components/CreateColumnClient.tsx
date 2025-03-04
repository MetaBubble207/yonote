"use client";
import React, { useState } from "react";
import Image from "next/image";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { message } from "antd";
import type { RadioChangeEvent } from "antd";
import { PriceStrategyTable } from "./PriceStrategyTable";
import type { PriceStrategy, PaymentMode } from "../types";
import '../price-table.css'
import { BasicInfo } from "./BasicInfo";
import { api } from "@/trpc/react";
import { PermanentPriceInput } from "./PermanentPriceInput";

export const CreateColumnClient = ({ columnId }: { columnId: string | null }) => {
  const [name, setName] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('permanent');
  const [permanentPrice, setPermanentPrice] = useState<string>("");
  const [priceStrategies, setPriceStrategies] = useState<PriceStrategy[]>([]);
  const [token] = useLocalStorage("token", null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const createApi = api.invitationCode.create.useMutation({  // 添加这个 API 定义
    onSuccess: (data) => {
      if (!data) {
        messageApi.info("创建失败，请重试");
        return;
      }
      messageApi.success("创建成功");
      router.push(`/writer/homepage?columnId=${columnId}`);
    },
    onError: (error) => {
      messageApi.error(error.message || "创建失败，请重试");
    },
  });
  
  const handlePaymentModeChange = (e: RadioChangeEvent) => {
    setPaymentMode(e.target.value);
    setPermanentPrice("");
    setPriceStrategies([]);
  };

  const updatePriceStrategy = (index: number, key: string, value: string) => {
    try {
      if (value.startsWith("0") && value !== "0") {
        messageApi.info("输入不能以0开头");
        return;
      }
      const numValue = Number(value);
      if (isNaN(numValue)) {
        messageApi.info("请输入有效的数字");
        return;
      }

      const newStrategies = [...priceStrategies];
      if (newStrategies[index]) {
        newStrategies[index] = {
          ...newStrategies[index],
          [key]: numValue
        };
      }
      setPriceStrategies(newStrategies);
    } catch (e) {
      messageApi.error("输入有误，请检查");
    }
  };

  const addPriceStrategy = () => {
    if (priceStrategies.length >= 4) {
      messageApi.info("最多只能添加4个价格策略");
      return;
    }
    setPriceStrategies([
      ...priceStrategies,
      { id: Date.now(), timeLimit: 0, price: 0 }
    ]);
  };

  const deletePriceStrategy = (index: number) => {
    setPriceStrategies(priceStrategies.filter((_, i) => i !== index));
  };

  const validatePriceStrategies = () => {
    // 检查是否有重复的天数
    const timeLimits = priceStrategies.map(strategy => strategy.timeLimit);
    const uniqueTimeLimits = new Set(timeLimits);
    if (timeLimits.length !== uniqueTimeLimits.size) {
      messageApi.info("存在重复的天数设置");
      return false;
    }

    // 检查价格和天数的有效性
    if (priceStrategies.some((item) => item.timeLimit <= 0 || item.price < 10)) {
      messageApi.info("请确保所有价格策略的天数和价格都已设置，且价格大于等于10元、天数大于0");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      messageApi.info("请输入专栏名称");
      return;
    }
    if (!columnId) {
      messageApi.info("专栏ID不存在，您可能没有被邀请，请联系管理员😯～");
      return;
    }

    // 验证价格设置
    if (paymentMode === 'permanent') {
      if (!permanentPrice || parseInt(permanentPrice) < 10) {
        messageApi.info("永久买断价格最低为10元");
        return;
      }
    } else if (paymentMode === 'subscription') {
      if (priceStrategies.length === 0) {
        messageApi.info("请至少添加一个价格策略");
        return;
      }
      if (!validatePriceStrategies()) {
        return;
      }
    }

    createApi.mutate({
      id: columnId,
      name: name.trim(),
      userId: token,
      type: 0,
      paymentMode,
      permanentPrice: paymentMode === 'permanent' ? Number(permanentPrice) : undefined,
      priceStrategies: paymentMode === 'subscription' ? priceStrategies : undefined,
    });
  };

  return (
    <div className="flex h-90vh w-full items-center justify-center bg-white">
      <div className="w-[550px]">
        {contextHolder}
        <div className="mb-8 text-4 font-700 text-[#323232]">专栏创建</div>

        {/* 基本信息部分 */}
        <BasicInfo
          name={name}
          setName={setName}
          columnId={columnId}
          paymentMode={paymentMode}
          handlePaymentModeChange={handlePaymentModeChange}
        />

        {/* 价格设置部分 */}
        {paymentMode === 'permanent' ? (
          <PermanentPriceInput
            price={permanentPrice}
            setPrice={setPermanentPrice}
          />
        ) : (
          <PriceStrategyTable
            priceStrategies={priceStrategies}
            updatePriceStrategy={updatePriceStrategy}
            deletePriceStrategy={deletePriceStrategy}
            addPriceStrategy={addPriceStrategy}
          />
        )}

        {/* 提交按钮 */}
        <div className="mt-12 ml-22">
          <button onClick={handleSubmit}>
            <Image
              src="/images/writer/co-author/submit.svg"
              alt="submit"
              width={65}
              height={32}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
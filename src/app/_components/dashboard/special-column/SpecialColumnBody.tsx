"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import SpecialColumnIntroduce from "@/app/_components/dashboard/special-column/SpecialColumnIntroduce";
import SpecialColumnList from "@/app/_components/dashboard/special-column/SpecialColumnList";
import Reserved from "@/app/_components/dialog/Reserved";
import Loading from "@/app/_components/common/Loading";
import { StatisticsInfo } from "./StatisticsInfo";
import { TabBar } from "./TabBar";
import { SubscribeButton } from "./SubscribeButton";
import Image from "next/image";
interface SpecialColumnBodyProps {
  columnId: string;
  code?: string;
  invitationCode?: string;
  isBack?: string;
}

export default function SpecialColumnBody({
  columnId,
  code,
  invitationCode,
  isBack,
}: SpecialColumnBodyProps) {
  const router = useRouter();
  const [token, setToken] = useLocalStorage("token", null);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentContent, setCurrentContent] = useState<number>(1);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [check, setCheck] = useState(false);
  const [isDesc, setIsDesc] = useState(true);
  // 查看用户数据
  const { data: status, isLoading: statusLoading } = api.order.getUserStatus.useQuery(
    { userId: token, columnId },
    { enabled: Boolean(token) }
  );

  const { data: detailPost, isLoading: detailPostLoading } = api.order.getColumnOrder.useQuery(
    { columnId, isDesc },
    { enabled: Boolean(columnId) }
  );

  const { data: userInfo, isLoading: userInfoLoading } = api.users.login.useQuery(
    code!,
    { enabled: Boolean(code && !token) }
  );

  const createReferral = api.referrals.add.useMutation();

  // 处理登录重定向
  useEffect(() => {
    if (!token && !userInfo && !isBack) {
      const origin = encodeURIComponent(
        `/dashboard/special-column?id=${columnId}&isBack=true${invitationCode ? `&invitationCode=${invitationCode}` : ""}`
      );
      router.push(`/login?origin=${origin}`);
    }
  }, [token, userInfo, isBack, columnId, router]);

  // 处理登录成功
  useEffect(() => {
    if (userInfo && !token) {
      messageApi.success("登录成功！😆，欢迎继续订阅专栏😯~");
      setToken(userInfo.id);
    }
  }, [userInfo, token, messageApi, setToken]);

  // 处理邀请码
  useEffect(() => {
    if (!invitationCode || !token || !columnId) return;
    createReferral.mutate({
      userId: token,
      referredUserId: invitationCode,
      columnId,
    });
  }, [invitationCode, token, columnId]);

  // 事件处理
  const handleSubscribe = useCallback(() => {
    setIsSubscribe(prev => !prev);
    setCheck(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tabId: number) => {
    setCurrentContent(tabId);
  }, []);

  if (statusLoading || detailPostLoading || userInfoLoading) {
    return <Loading className="mt-50" />;
  }

  return (
    <div>
      {contextHolder}

      <div className=" top-39 absolute z-2 min-h-140 w-full rounded-t-30px bg-white">
        <StatisticsInfo
          subscriptCount={detailPost?.subscriptCount}
          contentCount={detailPost?.detailPostCard.length}
        />

        <div className="mt-[11px] ml-[16px] flex items-center">
          <TabBar
            currentContent={currentContent}
            onTabChange={handleTabChange}
          />
          <div className="ml-auto flex items-center">
            <Image
              src="/images/special-column/Magnifying glass.png"
              alt="搜索"
              width={18}
              height={18}
              className="mr-[24px] cursor-pointer"
            />
            <Image
              onClick={() => setIsDesc(prev => !prev)}
              src={isDesc ? "/images/special-column/DescSort.png" : "/images/special-column/AscSort.png"}
              alt="排序"
              width={18}
              height={18}
              className="mr-[16px] cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-15">
          {currentContent === 1 ? (
            <SpecialColumnList
              status={status ?? false}
              postData={detailPost!.detailPostCard}
            />
          ) : (
            <SpecialColumnIntroduce />
          )}
        </div>

        <SubscribeButton
          show={!status}
          onClick={handleSubscribe}
        />

      </div>
      {isSubscribe && (
        <Reserved
          onClose={() => setIsSubscribe(false)}
          check={check}
          columnId={columnId}
        />
      )}
    </div>
  );
};

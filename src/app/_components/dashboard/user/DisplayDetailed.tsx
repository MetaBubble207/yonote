"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import { type UserInsert } from "@/server/db/schema";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";

// 类型定义
interface Props {
  token: string;
  userInfo: UserInsert;
}

interface TabInfo {
  id: number;
  label: string;
}

interface ColumnCardProps {
  id: string;
  cover: string | null;
  name: string | null;
  introduce: string | null;
}


// 统计数字展示组件
const StatsDisplay = ({ length, stat }: { length: number; stat: string }) => (
  <div className="flex flex-col items-center">
    {length || 0}
    <h2 className="text-3 font-normal leading-6 text-[#999]">{stat}</h2>
  </div>
);

// 专栏卡片组件
const ColumnCard = ({ id, cover, name, introduce }: ColumnCardProps) => (
  <Link href={`/dashboard/special-column?id=${id}`} className="mb-4 flex">
    <div className="w-15.5 h-19 relative">
      <Image
        placeholder="blur"
        blurDataURL={DefaultLoadingPicture()}
        src={cover ?? DefaultLoadingPicture()}
        alt={`${name}的封面`}
        quality={100}
        fill
        loading="lazy"
        className="rounded object-cover"
      />
    </div>
    <div>
      <div className="w-59.25 text-3.75 font-500 lh-6 ml-2 truncate">
        「{name ?? "未知专栏"}」
      </div>
      <div className="w-59.25 text-#666 text-3.25 font-400 ml-3 mt-2 truncate">
        {introduce ?? "暂无数据"}
      </div>
    </div>
  </Link>
);

const DisplayDetailed = ({ token, userInfo }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 使用 React Query 的数据获取
  const { data: subscribeInfos } = api.order.getUserOrder.useQuery({
    userId: userInfo.id,
  });
  const { data: columnInfos } = api.column.getAllByUserId.useQuery({
    userId: userInfo.id,
  });
  const { data: postLength } = api.post.getPostCount.useQuery(userInfo.id);

  const { data: updateColumnInfos, isLoading: isUpdateLoading } = api.column.getUpdate.useQuery({
    writerId: userInfo.id,
    visitorId: token,
  });

  // Tab 配置
  const tabs: TabInfo[] = [
    { id: 1, label: "更新" },
    { id: 2, label: "专栏" },
    { id: 3, label: "小课" },
  ];

  // 统计展示列表
  const StatsDisplayList = () => (
    <div className="text-neutral text-4 flex w-full justify-center space-x-14 font-bold leading-6">
      <StatsDisplay stat="订阅" length={subscribeInfos?.length ?? 0} />
      <StatsDisplay stat="专栏" length={columnInfos?.length ?? 0} />
      <StatsDisplay stat="内容" length={postLength ?? 0} />
    </div>
  );

  // Tab 组件
  const Tabs = () => (
    <div className="mb-6 flex">
      {tabs.map((tab) => (
        <div key={tab.id} className="flex-col">
          <button
            className="mr-8 p0 bg-transparent"
            onClick={() => setCurrentPage(tab.id)}
          >
            {tab.label}
          </button>
          <div
            className={`ml-2.25 w-2.75 rounded-2 mt-1 h-1 ${
              currentPage === tab.id ? "bg-primary" : "bg-#FFF"
            }`}
          />
        </div>
      ))}
    </div>
  );

  // 内容渲染
  const RenderContent = () => {
    if (currentPage === 1) {
      if (isUpdateLoading) return <LoadingSkeleton rows={3}/>;
      if (!updateColumnInfos?.length) {
        return <NoData title="你已经阅读完该作者所有的帖子了噢😁~" />;
      }
      return updateColumnInfos.map((item) => (
        <ColumnCard key={item.id} {...item} />
      ));
    }

    if (currentPage === 2) {
      if (!columnInfos?.length) return <LoadingSkeleton rows={3}/>;
      return columnInfos.map((item) => (
        <ColumnCard key={item.id} {...item} />
      ));
    }

    return <NoData title="没有查找到数据噢😯~" />;
  };

  return (
    <>
      <StatsDisplayList />
      <div className="rounded-2.5 ml-8 mr-8 mt-4">
        <Tabs />
        <RenderContent />
      </div>
    </>
  );
};

export default DisplayDetailed;

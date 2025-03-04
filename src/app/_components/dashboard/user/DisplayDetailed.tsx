"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { OrderSelect, type ColumnSelect } from "@/server/db/schema";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import useLocalStorage from "@/app/_hooks/useLocalStorage";

// 常量定义
const TABS = [
  { id: 1, label: "更新" },
  { id: 2, label: "专栏" },
  { id: 3, label: "小课" },
] as const;

const STATS = [
  { key: 'subscribe', label: '订阅' },
  { key: 'column', label: '专栏' },
  { key: 'content', label: '内容' },
] as const;

// 组件类型定义
interface Props {
  writerId: string;
  subscribeInfos: OrderSelect[];
  columnInfos: ColumnSelect[];
  postLength: number;
}

// 抽离卡片组件
const ColumnCard = ({ id, cover, name, introduce }: ColumnSelect) => (
  <Link href={`/dashboard/special-column?id=${id}`} className="mb-4 flex">
    <div className="w-15.5 h-19 relative">
      <Image
        placeholder="blur"
        blurDataURL={LoadingImage()}
        src={cover ?? NotImage()}
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

const DisplayDetailed = ({ writerId, subscribeInfos, columnInfos, postLength }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [token] = useLocalStorage("token", null);

  const { data: updateColumnInfos, isLoading: isUpdateLoading } = api.column.getUpdate.useQuery({
    writerId: writerId,
    visitorId: token,
  });

  // 统计数据
  const stats = useMemo(() => ({
    subscribe: subscribeInfos?.length ?? 0,
    column: columnInfos?.length ?? 0,
    content: postLength ?? 0,
  }), [subscribeInfos?.length, columnInfos?.length, postLength]);

  // 过滤后的专栏数据
  const filteredColumns = useMemo(() => ({
    columns: columnInfos?.filter(item => item.type === 0) ?? [],
    courses: columnInfos?.filter(item => item.type === 1) ?? [],
  }), [columnInfos]);

  // 渲染内容
  const renderContent = () => {
    const contentMap = {
      1: {
        data: updateColumnInfos,
        loading: isUpdateLoading,
        emptyMessage: "你已经阅读完该作者所有的帖子了噢😁~"
      },
      2: {
        data: filteredColumns.columns,
        loading: !columnInfos,
        emptyMessage: "暂无专栏数据"
      },
      3: {
        data: filteredColumns.courses,
        loading: !columnInfos,
        emptyMessage: "暂无小课数据"
      }
    };

    const current = contentMap[currentPage as keyof typeof contentMap];

    if (current.loading) return <LoadingSkeleton rows={3} />;
    if (!current.data?.length) return <NoData title={current.emptyMessage} />;

    return current.data.map(item => <ColumnCard key={item.id} {...item} />);
  };

  return (
    <>
      {/* 统计展示 */}
      <div className="text-neutral text-4 flex w-full justify-center space-x-14 font-bold leading-6">
        {STATS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center">
            {stats[key]}
            <h2 className="text-3 font-normal leading-6 text-[#999]">{label}</h2>
          </div>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="rounded-2.5 ml-8 mr-8 mt-4">
        {/* Tab栏 */}
        <div className="mb-6 flex">
          {TABS.map((tab) => (
            <div key={tab.id} className="flex-col">
              <button
                className="mr-8 p0 bg-transparent"
                onClick={() => setCurrentPage(tab.id)}
              >
                {tab.label}
              </button>
              <div
                className={`ml-2.25 w-2.75 rounded-2 mt-1 h-1 ${currentPage === tab.id ? "bg-primary" : "bg-#FFF"
                  }`}
              />
            </div>
          ))}
        </div>

        {/* 内容渲染 */}
        {renderContent()}
      </div>
    </>
  );
};

export default DisplayDetailed;

"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { useSpecialColumn } from "@/app/_hooks/useSpecialColumn";
import SpecialColumnIntroduce from "./SpecialColumnIntroduce";
import SpecialColumnList from "./SpecialColumnList";
import { StatisticsInfo } from "./StatisticsInfo";
import { TabBar } from "./TabBar";
import { SubscribeButton } from "./SubscribeButton";
import dynamic from "next/dynamic";
import useCheckOnClient from "@/app/_hooks/useCheckOnClient";

const Reserved = dynamic(() => import("@/app/_components/dialog/Reserved"), {
  ssr: false
});

const SearchModal = dynamic(() => import("./modals/Modals").then(mod => mod.SearchModal), {
  ssr: false
});

interface SpecialColumnBodyProps {
  columnId: string;
  code?: string;
  invitationCode?: string;
  isBack?: string;
}

export default function SpecialColumnBody(props: SpecialColumnBodyProps) {
  const [currentContent, setCurrentContent] = React.useState<number>(1);
  const [isSubscribe, setIsSubscribe] = React.useState(false);
  const mounted = useCheckOnClient()
  const {
    status,
    statusLoading,
    detailPost,
    detailPostLoading,
    tags,
    tagsLoading,
    isDesc,
    searchValue,
    isSearching,
    handleSearch,
    toggleSearch,
    toggleSort,
    handleSearchCancel,
    handleSearchChange,
    contextHolder,
  } = useSpecialColumn(props.columnId, props.code, props.invitationCode, props.isBack);

  const handleSubscribe = useCallback(() => {
    setIsSubscribe(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tabId: number) => {
    setCurrentContent(tabId);
  }, []);

  if (!mounted) return null;
  return (
    <div>
      {contextHolder}
      <div className="top-39 absolute z-2 min-h-140 w-full rounded-t-30px bg-white">
        <StatisticsInfo
          subscriptCount={detailPost?.subscriptCount}
          contentCount={detailPost?.detailPostCard.length}
          isLoading={detailPostLoading}
        />

        <TabBarSection
          currentContent={currentContent}
          onTabChange={handleTabChange}
          onSearch={toggleSearch}
          onSort={toggleSort}
          isDesc={isDesc}
        />

        <div className="mb-15">
          {currentContent === 1 ? (
            <SpecialColumnList
              isSubscribe={status ?? false}
              isPostDataLoading={detailPostLoading}
              isTagsLoading={tagsLoading}
              postData={detailPost?.detailPostCard ?? []}
              tags={tags ?? []}
            />
          ) : (
            <SpecialColumnIntroduce columnId={props.columnId} />
          )}
        </div>

        {!statusLoading && <SubscribeButton
          show={!status}
          onClick={handleSubscribe}
        />}
      </div>

      {!statusLoading && isSubscribe && (
        <Reserved
          onClose={() => setIsSubscribe(false)}
          columnId={props.columnId}
        />
      )}

      <SearchModal
        isOpen={isSearching}
        value={searchValue}
        onOk={handleSearch}
        onCancel={handleSearchCancel}
        onChange={handleSearchChange}
      />
    </div>
  );
}

// 抽离 TabBar 部分为独立组件
const TabBarSection = React.memo(({
  currentContent,
  onTabChange,
  onSearch,
  onSort,
  isDesc
}: {
  currentContent: number;
  onTabChange: (id: number) => void;
  onSearch: () => void;
  onSort: () => void;
  isDesc: boolean;
}) => (
  <div className="mt-[11px] ml-[16px] flex items-center">
    <TabBar
      currentContent={currentContent}
      onTabChange={onTabChange}
    />
    <div className="ml-auto flex items-center">
      <Image
        onClick={onSearch}
        src="/images/special-column/Magnifying glass.png"
        alt="搜索"
        width={18}
        height={18}
        className="mr-[24px] cursor-pointer"
      />
      <Image
        onClick={onSort}
        src={isDesc ? "/images/special-column/DescSort.png" : "/images/special-column/AscSort.png"}
        alt="排序"
        width={18}
        height={18}
        className="mr-[16px] cursor-pointer"
      />
    </div>
  </div>
));

TabBarSection.displayName = 'TabBarSection';
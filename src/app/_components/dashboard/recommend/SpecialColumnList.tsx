"use client";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import ColumnCard from "@/app/_components/dashboard/find/ColumnCard";
import { api } from "@/trpc/react";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";
import { Spin } from "antd";
import withTheme from "@/theme";

interface Category {
  key: string;
  label: string;
  value: number;
}

const categories: Category[] = [
  { key: "默认", label: "默认", value: 0 },
  { key: "订阅量", label: "订阅量", value: 1 },
  { key: "内容量", label: "内容量", value: 2 },
  { key: "发布时间", label: "发布时间", value: 3 },
  { key: "创作时间", label: "创作时间", value: 4 },
];

const ITEM_HEIGHT = 150;
const WINDOW_HEIGHT = 800;
const PAGE_SIZE = 10;

const SpecialColumnList = () => {
  const [activeCategory, setActiveCategory] = useState<string>("默认");
  const [currentContent, setCurrentContent] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<boolean>(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = api.column.getColumnFilter.useInfiniteQuery(
    {
      conditions: currentContent,
      limit: PAGE_SIZE,
      sortOrder,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // 当排序条件改变时重新获取数据
      refetchOnMount: true,
    }
  );

  const flattenedData = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.items);
  }, [data?.pages]); // 移除 sortOrder 依赖，因为排序已经在服务端处理

  const handleCategoryClick = useCallback((category: Category) => {
    setActiveCategory(category.key);
    setCurrentContent(category.value);
  }, []);

  const CategoryButton = useCallback(({ category }: { category: Category }) => {
    const isActive = category.key === activeCategory;
    return (
      <button
        className={`ml-5px text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px h-6 shrink-0 text-center
          ${isActive ? 'bg-[rgba(69,225,184,0.20)] text-[#1DB48D]' : 'bg-[#FFFFFF] text-[#999]'}`}
        onClick={() => handleCategoryClick(category)}
      >
        {category.label}
      </button>
    );
  }, [activeCategory, handleCategoryClick]);

  const SortButton = () => (
    <button
      className="bg-transparent pl-14px flex items-center"
      onClick={() => setSortOrder(!sortOrder)}
    >
      <span className="text-2.5 font-400 lh-6 text-[#B5B5B5]">
        {sortOrder ? "默认倒序排序" : "顺序排序"}
      </span>
      <Image
        src="/images/recommend/sort.svg"
        alt="sort"
        width={12}
        height={12}
        className="ml-1.25 h-3 w-3"
      />
    </button>
  );

  // 虚拟列表项渲染器
  const ItemRenderer = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (index >= flattenedData.length) {
      if (hasNextPage) {
        return (
          <div 
            style={style} 
            className="flex flex-col items-center justify-center py-4 gap-2"
          >
            {withTheme(<Spin size="small"/>)}
            <span className="text-sm text-[#B5B5B5]">加载中...</span>
          </div>
        );
      }
      return null;
    }

    const item = flattenedData[index];
    if (!item) return null;
    
    return (
      <div style={style} className="flex justify-center px-4 py-2">
        <ColumnCard columnData={item} />
      </div>
    );
  }, [flattenedData, hasNextPage]);

  // 5. 简化 loadMoreItems 函数，移除未使用的参数
  const loadMoreItems = useCallback(
    async () => {
      if (isFetchingNextPage || !hasNextPage) return;
      await fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const isItemLoaded = useCallback(
    (index: number) => {
      return !hasNextPage || index < flattenedData.length;
    },
    [hasNextPage, flattenedData.length]
  );

  return (
    <div>
      <div className="mt-6 flex h-6 w-full pl-4 pb-10">
        {categories.map((category) => (
          <CategoryButton key={category.key} category={category} />
        ))}
      </div>
      
      <SortButton />

      {isLoading ? (
        <LoadingSkeleton className="px-4" rows={3} count={5}/>
      ) : (
        <div className="px-4">
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={hasNextPage ? flattenedData.length + 1 : flattenedData.length}
            loadMoreItems={loadMoreItems}
            threshold={2}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={ref}
                onItemsRendered={onItemsRendered}
                height={WINDOW_HEIGHT}
                itemCount={hasNextPage ? flattenedData.length + 1 : flattenedData.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
                className="[scrollbar-width:none] [ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-10"
              >
                {ItemRenderer}
              </List>
            )}
          </InfiniteLoader>
        </div>
      )}
    </div>
  );
};

export default SpecialColumnList;

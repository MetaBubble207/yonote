import Image from "next/image";
import { api } from "@/trpc/react";
import React, { useState, useEffect } from "react";
import { timeToDateString } from "@/tools/timeToString";
import Link from "next/link";
import {ColumnCard} from "@/app/_components/find/ColumnCard";
import Loading from "@/app/_components/common/Loading";
import {Button} from "antd";

export const SubscriptionQueryColumn = () => {
  const [data, setData] = useState(null);
  const [sortOrder, setSortOrder] = useState<boolean>(true); // 默认为 true，表示倒序排序
  // 使用 useQuery 钩子获取数据
  const { data: queryData,isFetching} = api.column.getColumnOrderNumbers.useQuery();

  // 在数据加载完成时更新状态
  useEffect(() => {
    if (queryData) {
      // 根据 sortOrder 设置 data 的值
      const sortedData = sortOrder ? [...queryData].reverse() : queryData;
      setData(sortedData);
    }
  }, [queryData, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(!sortOrder);
  };

  return (
      <div>
        <Button type={'link'} size={'small'} className="flex pl-3.5" onClick={toggleSortOrder}>
          <div className="mt-2 text-[#B5B5B5] text-2.5 font-400 lh-6">
            {sortOrder ? "默认倒序排序" : "顺序排序"}
          </div>
          <Image
              src={"/images/recommend/sort.svg"}
              alt={"sort"}
              width={12}
              height={12}
              className="w-3 h-3 mt-3.5 ml-1.25"
          />
        </Button>
        {isFetching
            ?
            <div className={"mt-50"}>
              <Loading/>
            </div>
            :
            data?.map((item) => (
                <div className="mt-4 flex justify-center" key={item.id}>
                  <ColumnCard columnData={item}/>
                </div>
            ))}
      </div>
  );
};

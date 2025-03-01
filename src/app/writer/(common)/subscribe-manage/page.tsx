import React, { Suspense } from "react";
import { api } from "@/trpc/server";
import Loading from "@/app/_components/common/Loading";
import TableComponent from "@/app/writer/(common)/subscribe-manage/components/TableComponent";
import type { SubscribeSearchParams } from "./types";
import { FilterSection } from "./components/FilterSection";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SubscribeSearchParams>;
}) {
  // 处理查询参数
  const params: SubscribeSearchParams = {
    columnId: (await searchParams).columnId,
    userId: (await searchParams).userId || null,
    startDate: (await searchParams).startDate || null,
    endDate: (await searchParams).endDate || null,
    currentPage: Number((await searchParams).currentPage) || 1,
    pageSize: Number((await searchParams).pageSize) || 10,
    status: Number((await searchParams).status) || 0,
  };
  // 服务端获取数据
  const { data, total } = await api.order.getSubscriptionFilter(params);

  return (
    <div className="bg-#fff p8 h-full w-full">
      <div className="font-700 text-[#323232] text-lg mb-6">订阅管理</div>

      <Suspense fallback={<Loading />}>
        <div className="mt-6">
          <FilterSection columnId={params.columnId!} />
        </div>

        <div className="mt-4">
          <TableComponent
            dataSource={data}
            total={total}
          />
        </div>
      </Suspense>
    </div>
  );
}
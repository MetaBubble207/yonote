import React from "react";
import { api } from "@/trpc/server";
import HomepageDataServer from "./components/HomepageDataServer";
import ChartContainer from "./components/ChartContainer";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ columnId: string }>
}) {
  const { columnId } = await searchParams;
  try {
    // 并行获取所有需要的数据
    const { reads, readingRate, subscriptions, subscriptionRate } = await api.read.getHomepageData(columnId);

    return (
      <div className="h-full w-full">
        <div className="w-full">
          <HomepageDataServer
            columnId={columnId}
            reads={reads}
            readRate={readingRate}
            subscriptions={subscriptions}
            subscriptionRate={subscriptionRate}
          />
        </div>
        <div className="w-full pt-4">
          <ChartContainer columnId={columnId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading homepage data:", error);
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold">数据加载失败</h3>
          <p className="mt-2 text-gray-500">请刷新页面重试</p>
        </div>
      </div>
    );
  }
}
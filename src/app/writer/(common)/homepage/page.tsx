import React from "react";
import { api } from "@/trpc/server";
import HomepageDataServer from "./components/HomepageDataServer";
import ChartContainer from "./components/ChartContainer";
import { DataQueryError } from "@/app/_components/common/DataQueryError";
import { validateColumn } from "@/app/_components/common/CheckColumnId";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ columnId?: string }>
}) {
  let { columnId } = await searchParams;

  try {
    const validation = await validateColumn(columnId);
    if (!validation.isValid) {
      return validation.error;
    }
    columnId = validation.columnData!.id!;
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
    return <DataQueryError />
  }
}
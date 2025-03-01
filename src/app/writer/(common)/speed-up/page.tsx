import React from "react";
import SpeedUpClient from "./components/SpeedUpClient";
import { api } from "@/trpc/server";

export default async function SpeedUpPage({
  searchParams,
}: {
  searchParams: Promise<{
    columnId?: string;
    userId?: string;
    startPick?: string;
    endPick?: string;
    pageSize?: string;
    currentPage?: string;
  }>;
}) {
  const params = await searchParams;
  const columnId = params.columnId;
  const userId = params.userId || "";
  const startPick = params.startPick || undefined;
  const endPick = params.endPick || undefined;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
  const currentPage = params.currentPage ? parseInt(params.currentPage) : 1;

  try {
    // 并行获取数据
    const [distributorshipData, speedUpData] = await Promise.all([
      columnId ? api.distributorshipDetail.getOne(columnId) : null,
      columnId ? api.referrals.getByColumnIdPaginated({
        columnId,
        userId,
        startDate: startPick,
        endDate: endPick,
        page: currentPage,
        pageSize
      }) : { items: [], total: 0, page: 1, pageSize: 10 }
    ]);

    return (
      <SpeedUpClient
        columnId={columnId!}
        distributorshipData={distributorshipData}
        speedUpData={speedUpData}
        initialUserId={userId}
        initialDateRange={startPick && endPick ? [new Date(startPick), new Date(endPick)] : null}
        initialPagination={{
          current: currentPage,
          pageSize,
          total: speedUpData.total || 0
        }}
      />
    );
  } catch (error) {
    console.error("Error loading data:", error);
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
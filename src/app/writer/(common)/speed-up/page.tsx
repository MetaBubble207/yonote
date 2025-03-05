import React from "react";
import SpeedUpClient from "./components/SpeedUpClient";
import { api } from "@/trpc/server";
import { validateColumn } from "@/app/_components/common/CheckColumnId";
import { DataQueryError } from "@/app/_components/common/DataQueryError";

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
  try {
    const params = await searchParams;
    let columnId = params.columnId;
    const userId = params.userId || "";
    const startPick = params.startPick || undefined;
    const endPick = params.endPick || undefined;
    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    const currentPage = params.currentPage ? parseInt(params.currentPage) : 1;

    const validation = await validateColumn(columnId);
    if (!validation.isValid) {
      return validation.error;
    }
    columnId = validation.columnData!.id!;
    // 并行获取数据
    const [distributorshipData, speedUpData] = await Promise.all([
      api.distributorshipDetail.getOne(columnId),
      api.referrals.getByColumnIdPaginated({
        columnId,
        userId,
        startDate: startPick,
        endDate: endPick,
        page: currentPage,
        pageSize
      })
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
    console.error("Error loading speed-up data:", error);
    return <DataQueryError />;
  }
}
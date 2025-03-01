import React from "react";
import { api } from "@/trpc/server";
import ColumnSettingsTable from "./components/TableComponent";
import ColumnCover from "./components/ColumnCover";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ columnId?: string }>;
}) {
  const { columnId } = await searchParams;

  if (!columnId) {
    return <div className="p-8">请选择一个专栏</div>;
  }

  // 服务端获取数据
  const columnData = await api.column.getColumnDetail(columnId);
  const priceListData = await api.priceList.getByColumnId(columnId);

  return (
    <div className="rounded-2.5 flex h-full w-full items-start bg-[#FFF] pl-8 pt-8">
      <ColumnSettingsTable
        columnData={columnData!}
        priceListData={priceListData?.sort((a, b) => a.id - b.id) || []}
      />

      <ColumnCover columnId={columnId} initialCover={columnData?.cover} />
    </div>
  );
}
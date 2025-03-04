import React from "react";
import { api } from "@/trpc/server";
import ColumnSettingsTable from "./components/TableComponent";
import ColumnCover from "./components/ColumnCover";
import { validateColumn } from "@/app/_components/common/CheckColumnId";
import { DataQueryError } from "@/app/_components/common/DataQueryError";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ columnId?: string }>;
}) {
  try {
    let { columnId } = await searchParams;
    const validation = await validateColumn(columnId);
    if (!validation.isValid) {
      return validation.error;
    }
    const columnData = validation.columnData;
    // 服务端获取数据
    const priceListData = await api.priceList.getByColumnId(columnData!.id);

    return (
      <div className="rounded-2.5 flex h-full w-full items-start bg-[#FFF] pl-8 pt-8">
        <ColumnSettingsTable
          columnData={columnData!}
          priceListData={priceListData?.sort((a, b) => a.id - b.id) || []}
        />

        <ColumnCover columnId={columnData!.id} initialCover={columnData?.cover} />
      </div>
    );
  } catch (error) {
    console.log("Error loading column-settings data:",error);
    return <DataQueryError/>
  }
}
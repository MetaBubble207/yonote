import React, { Suspense } from "react";
import "dayjs/locale/zh-cn";
import Loading from "@/app/_components/common/Loading";
import { PublishButton } from "@/app/_components/writer/PublishButton";
import { api } from "@/trpc/server";
import TableComponent from "@/app/writer/(common)/content-management/components/TableComponent";
import { FilterSection } from "@/app/writer/(common)/content-management/components/FilterSection";
import { PostSearchParams } from "./types";
import { validateColumn } from "@/app/_components/common/CheckColumnId";
export default async function Page({ searchParams }: { searchParams: Promise<PostSearchParams>; }) {
  // 处理查询参数
  const params: PostSearchParams = {
    columnId: (await searchParams).columnId,
    title: (await searchParams).title,
    tag: (await searchParams).tag,
    startDate: (await searchParams).startDate,
    endDate: (await searchParams).endDate,
    currentPage: Number((await searchParams).currentPage) || 1,
    pageSize: Number((await searchParams).pageSize) || 10,
    isTop: (await searchParams).isTop ? Boolean((await searchParams).isTop) : undefined,
    isFree: (await searchParams).isFree ? Boolean((await searchParams).isFree) : undefined,
  };
  const validation = await validateColumn(params.columnId);
  if (!validation.isValid) {
    return validation.error;
  }
  const columnId = validation.columnData!.id;
  // 服务端获取数据
  const { data: posts, total } = await api.post.getPostsFilter(params);

  return (
    <Suspense fallback={<Loading className="min-h-[calc(100vh-200px)] flex items-center justify-center" />}>
      <div className="rounded-2.5 min-h-[calc(100vh-200px)] w-full bg-[#FFF] pl-8 pr-9 pb-8">
        <div className="pt-51px flex items-center">
          <div className="text-4 font-not-italic font-700 lh-6 text-[#323232]">
            内容管理
          </div>
          <PublishButton className="ml-32px" columnId={columnId} />
        </div>
        <FilterSection columnId={columnId} />
        <div className="mt-4 overflow-auto">
          <TableComponent dataSource={posts} total={total} />
        </div>
      </div>
    </Suspense>
  );
}
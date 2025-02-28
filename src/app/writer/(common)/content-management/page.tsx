import React, { Suspense } from "react";
import "dayjs/locale/zh-cn";
import Loading from "@/app/_components/common/Loading";
import { PublishButton } from "@/app/_components/writer/PublishButton";
import { api } from "@/trpc/server";
import TableComponent from "@/app/_components/writer/content/TableComponent";
import { FilterSection } from "@/app/_components/writer/content/FilterSection";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    columnId: string;
    title?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const { columnId, title, tag, startDate, endDate } = await searchParams;

  // 服务端获取数据
  const posts = await api.post.getPostsFilter({
    columnId,
    title,
    tag,
    startDate,
    endDate,
  });

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
          <TableComponent dataSource={posts}/>
        </div>
      </div>
    </Suspense>
  );
}
import Navbar from "@/app/_components/common/Navbar";
import Link from "next/link";
import React from "react";
import SearchColumn from "@/app/_components/common/SearchColumn";
import SubscribeMain from "@/app/_components/dashboard/subscribe/SubscribeMain";
import RecentlyReadCard from "@/app/_components/dashboard/subscribe/RecentlyReadCard";

export default async function Subscribe({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return (
    <div>
      <div className="pb-15 bg-#F5F7FB min-h-screen w-full px-4 pt-8">
        {/*搜索框*/}
        <Link href="/dashboard/find/search-result">
          <SearchColumn />
        </Link>
        {/*最近观看*/}
        <div className={"mt-8"}>
          <RecentlyReadCard code={code} />
        </div>
        {/*列表*/}
        <div className={"mt-4"}>
          <SubscribeMain code={code} />
        </div>
        <div className={"z-1 text-gray text-3 flex h-20 w-full items-center justify-center"}>
          ICP备案号：
          <Link href={"http://beian.miit.gov.cn/ "}>
            {" "}
            京ICP备2024064381号-1
          </Link>
        </div>
      </div>
      {/*工具栏*/}
      <div className="z-2 fixed bottom-4 w-full justify-center">
        <Navbar />
      </div>
    </div>
  );
};

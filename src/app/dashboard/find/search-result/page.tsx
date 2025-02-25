import React from "react";
import SearchColumn from "@/app/_components/common/SearchColumn";
import Navbar from "@/app/_components/common/Navbar";
import Link from "next/link";
import SearchResultList from "@/app/_components/dashboard/find/SearchResultList";
export default async function Page({ searchParams }: { searchParams: Promise<{ query: string }> }) {
  const searchValue = (await searchParams).query;

  return (
    <div className="bg-#F5F7FB relative min-h-screen">
      <div className="w-85.75 m-auto pt-8 pb-20">
        <div className="flex items-center justify-between">
          <SearchColumn defaultValue={searchValue} />
          <Link
            className="ml-4 text-[#252525] text-15px p-0 whitespace-nowrap"
            href={"/dashboard/find"}
          >
            取消
          </Link>
        </div>
        <SearchResultList searchValue={searchValue} />
      </div>
      <div className="z-2 fixed bottom-4 w-full justify-center">
        <Navbar />
      </div>
    </div>
  );
}

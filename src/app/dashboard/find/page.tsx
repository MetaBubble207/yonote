import React from "react";
import Image from "next/image";
import Navbar from "@/app/_components/common/Navbar";
import { Activities } from "@/app/_components/dashboard/find/Activities";
import SearchColumn from "@/app/_components/common/SearchColumn";
import Link from "next/link";

const Find = () => {
  return (
    <div className="bg-#F5F7FB relative min-h-screen">
      <div className="w-85.75 m-auto pt-8">
        {/*搜索框*/}
        <Link href="/dashboard/find/search-result">
          <SearchColumn></SearchColumn>
        </Link>
        {/*活动中心*/}
        <div className="text-4.5 font-500 lh-6 ml-1.5 mt-6 text-[#252525]">
          活动中心
        </div>
        <Image
          src={"/images/subscribe/underline.svg"}
          alt="underline"
          width={11}
          height={4}
          className="w-2.75 mt-0.75 ml-9 h-1"
        />
        {/*活动列表*/}
        <Activities />
      </div>

      <div className="z-2 fixed bottom-4 w-full justify-center">
        <Navbar />
      </div>
      <div className={" text-gray text-3 flex min-h-30 pt-5 pb-10 w-full justify-center"}>
        ICP备案号：
        <Link href={"http://beian.miit.gov.cn/ "}> 京ICP备2024064381号-1</Link>
      </div>
    </div>
  );
};
export default Find;

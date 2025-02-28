"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Column from "./Column";

const LeftCompass = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const columnId = params.get("columnId");
  const filterPathname = ["/writer/login", "/writer/no-column"];
  return (
    <>
      {!filterPathname.includes(pathname) && (
        <div className="top-17.5 w-65 z-100 fixed h-screen shrink-0 bg-[#FFF]">
          <div className="w-65 h-72.4785 mt-10 flex shrink-0 flex-col">
            {/* {column && <Column />} */}
            <Column />
            <div
              className={`w-65.25 h-12.4705 mt-35px flex shrink-0 ${
                pathname === "/writer/homepage"
                  ? "bg-[#DAF9F1] text-[#4CC5A6]"
                  : "bg-[#FFF] text-[#999]"
              }`}
            >
              <Image
                src={`${
                  pathname === "/writer/homepage"
                    ? "/images/writer/edit/Monitor1.svg"
                    : "/images/writer/edit/Monitor-one.svg"
                }`}
                alt="Monitor1"
                width={24}
                height={24.03}
                className={`h-6.00625 ml-10.555 mt-2.89 w-6 shrink-0`}
              ></Image>
              <Link href={`/writer/homepage?columnId=${columnId}`} passHref>
                <div className="h-6.00625 text-3.5 font-400 lh-6 ml-2.07 mt-2.89 w-14 shrink-0">
                  主页看板
                </div>
              </Link>
            </div>
            <div
              className={`w-65.25 h-12.4705 flex shrink-0 ${
                pathname === "/writer/content-management"
                  ? "bg-[#DAF9F1] text-[#4CC5A6]"
                  : "bg-[#FFF] text-[#999]"
              }`}
            >
              <Image
                src={`${
                  pathname === "/writer/content-management"
                    ? "/images/writer/edit/Rocket2 copy.svg"
                    : "/images/writer/edit/Rocket2.svg"
                }`}
                alt="Monitor1"
                width={24}
                height={24.03}
                className="h-6.00625 ml-10.555 mt-2.89 w-6 shrink-0"
              ></Image>
              <Link
                href={`/writer/content-management?columnId=${columnId}`}
                passHref
              >
                <div className="h-6.00625 text-3.5 font-400 lh-6 ml-2.07 mt-2.89 w-14 shrink-0">
                  内容管理
                </div>
              </Link>
            </div>
            <div
              className={`w-65.25 h-12.4705 flex shrink-0 ${
                pathname === "/writer/subscribe-manage"
                  ? "bg-[#DAF9F1] text-[#4CC5A6]"
                  : "bg-[#FFF] text-[#999]"
              }`}
            >
              <Image
                src={`${
                  pathname === "/writer/subscribe-manage"
                    ? "/images/writer/edit/Rocket3 copy.svg"
                    : "/images/writer/edit/Rocket3.svg"
                }`}
                alt="Monitor1"
                width={24}
                height={24.03}
                className="h-6.00625 ml-10.555 mt-2.89 w-6 shrink-0"
              ></Image>
              <Link
                href={`/writer/subscribe-manage?columnId=${columnId}`}
                passHref
              >
                <div className="h-6.00625 text-3.5 font-400 lh-6 ml-2.07 mt-2.89 w-14 shrink-0">
                  订阅管理
                </div>
              </Link>
            </div>
            <div
              className={`w-65.25 h-12.4705 flex shrink-0 ${
                pathname === "/writer/column-settings"
                  ? "bg-[#DAF9F1] text-[#4CC5A6]"
                  : "bg-[#FFF] text-[#999]"
              }`}
            >
              <Image
                src={`${
                  pathname === "/writer/column-settings"
                    ? "/images/writer/edit/Rocket4 copy.svg"
                    : "/images/writer/edit/Rocket4.svg"
                }`}
                alt="Monitor1"
                width={24}
                height={24.03}
                className="h-6.00625 ml-10.555 mt-2.89 w-6 shrink-0"
              ></Image>
              <Link
                href={`/writer/column-settings?columnId=${columnId}`}
                passHref
              >
                <div className="h-6.00625 text-3.5 font-400 lh-6 ml-2.07 mt-2.89 w-14 shrink-0">
                  专栏设置
                </div>
              </Link>
            </div>
            <div
              className={`w-65.25 h-12.4705 flex shrink-0 ${
                pathname === "/writer/co-author"
                  ? "bg-[#DAF9F1] text-[#4CC5A6]"
                  : "bg-[#FFF] text-[#999]"
              }`}
            >
              <Image
                src={`${
                  pathname === "/writer/co-author"
                    ? "/images/writer/edit/Rocket5 copy.svg"
                    : "/images/writer/edit/Rocket5.svg"
                }`}
                alt="Monitor1"
                width={24}
                height={24.03}
                className="h-6.00625 ml-10.555 mt-2.89 w-6 shrink-0"
              ></Image>
              <Link href={`/writer/co-author?columnId=${columnId}`} passHref>
                <div className="h-6.00625 text-3.5 font-400 lh-6 ml-2.07 mt-2.89 w-14 shrink-0">
                  共创作者
                </div>
              </Link>
            </div>
            <div
              className={`w-65.25 h-12.4705 flex shrink-0 ${
                pathname === "/writer/speed-up"
                  ? "bg-[#DAF9F1] text-[#4CC5A6]"
                  : "bg-[#FFF] text-[#999]"
              }`}
            >
              <Image
                src={`${
                  pathname === "/writer/speed-up"
                    ? "/images/writer/edit/Rocket6 copy.svg"
                    : "/images/writer/edit/Rocket6.svg"
                }`}
                alt="Monitor1"
                width={24}
                height={24.03}
                className="h-6.00625 ml-10.555 mt-2.89 w-6 shrink-0"
              ></Image>
              <Link href={`/writer/speed-up?columnId=${columnId}`} passHref>
                <div className="h-6.00625 text-3.5 font-400 lh-6 ml-2.07 mt-2.89 w-14 shrink-0">
                  加速计划
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftCompass;

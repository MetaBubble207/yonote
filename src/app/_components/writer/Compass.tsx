"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { api } from "@/trpc/react";

const Compass = () => {
  const router = useRouter();
  const pathname = usePathname();
  const code = useSearchParams().get("code");
  const [isGo, setIsGo] = useState(false);
  const handleLogout = () => {
    setToken(null);
  };
  const [token, setToken] = useLocalStorage("token", null);

  useEffect(() => {
    if (
      !token &&
      !pathname.includes("/login") &&
      !pathname.includes("/no-column") &&
      !code
    ) {
      router.push("/writer/login");
    }
  }, [token, pathname, router]);

  const user = api.users.getOne.useQuery({
    id: token ?? "",
  }).data;

  useEffect(() => {
    if (isGo) router.push(`/writer/homepage`);
  }, [isGo, router]);

  return (
    <div>
      <div className="w-100% h-17.5 pr-23px z-101 fixed top-0 flex shrink-0 items-center justify-between bg-[#FFF]">
        {/*左半边导航区*/}
        <div className="w-107.55675 h-11.75 ml-7.1975 mt-2.875 flex shrink-0 items-center">
          <div
            className="h-9.48025 inline-flex w-20 items-center"
            onClick={() => setIsGo(true)}
          >
            <Image
              src={"/images/logo.svg"}
              alt={"cover"}
              width={30.3}
              height={30.42}
              className="w-7.57425 h-8.35625 shrink-0"
            ></Image>
            <div className="ml-2">
              <div className="font-size-4 shrink-0">有记</div>
              <div className="font-size-2 tracking-1.2 shrink-0">YoNote</div>
            </div>
          </div>
          <div className="text-3.5 font-400 lh-6 ml-17.5575 text-[#323232]">
            官网
            <button></button>
          </div>
          <div className="text-3.5 font-400 lh-6 ml-15 text-[#323232]">
            专栏申请
            <button></button>
          </div>
          <div className="text-3.5 font-400 lh-6 ml-15 text-[#323232]">
            反馈社区
          </div>
        </div>
        {/*右半边信息区*/}
        <div className={"flex items-center"}>
          <Image
            placeholder="blur"
            blurDataURL={user?.avatar ?? "/images/user/Loading.svg"}
            src={user?.avatar ?? "/images/user/Loading.svg"}
            alt="avatar"
            width={44}
            height={44}
            className="border-rd-11 h-11 w-11 shrink-0"
          ></Image>
          <div className="ml-3.4275">{user?.name ?? "您还未登录"}</div>
          <div>
            <select name="" id="" onChange={handleLogout}>
              <option value=""></option>
              <option value="">退出登录</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Compass;

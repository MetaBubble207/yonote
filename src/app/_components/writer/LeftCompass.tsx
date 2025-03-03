"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ColumnList from "./ColumnList";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";

// 统一图标路径配置
const ICON_BASE = "/images/writer/compass/";
const ACTIVE_ICON_SUFFIX = "-active.svg";
const INACTIVE_ICON_SUFFIX = "-unactive.svg";
type NavConfig = {
  path: string;
  icon: string;
  label: string;
};
// 导航项配置表
const navConfig: NavConfig[] = [
  {
    path: "/homepage",
    icon: "homepage",
    label: "主页看板"
  },
  {
    path: "/content-management",
    icon: "content",
    label: "内容管理"
  },
  {
    path: "/subscribe-manage",
    icon: "subscribe",
    label: "订阅管理"
  },
  {
    path: "/column-settings",
    icon: "settings",
    label: "专栏设置"
  },
  {
    path: "/co-author",
    icon: "co-author",
    label: "共创作者"
  },
  {
    path: "/speed-up",
    icon: "speed-up",
    label: "加速计划"
  }
];

const LeftCompass = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columnId = searchParams.get("columnId");
  const router = useRouter();
  const [token] = useLocalStorage('token', null);
  const { data: latestColumnId } = api.column.getLatestColumnId.useQuery(token, { enabled: Boolean((columnId === undefined || columnId === null) && token) });
  const [columnIdState, setColumnIdState] = useState<string>();

  // 组件初始化逻辑
  useEffect(() => {
    if (!columnId || columnId === null) {
      if (latestColumnId) {
        setColumnIdState(latestColumnId)
        router.push(`${pathname}?columnId=${latestColumnId}`)
      }
    } else {
      setColumnIdState(columnId)
    }
    if (!token) {
      router.push('/writer/login')
    }
  }, [columnId, token, latestColumnId])

  // 动态生成导航项
  const renderNavItem = (item: NavConfig) => {
    const isActive = pathname === `/writer${item.path}`;
    const iconSrc = isActive
      ? `${ICON_BASE}${item.icon}${ACTIVE_ICON_SUFFIX}`
      : `${ICON_BASE}${item.icon}${INACTIVE_ICON_SUFFIX}`;
    console.log("item ==>", item)
    return (
      <div
        key={item.path}
        className={`w-65.25 h-12 flex items-center shrink-0 ${isActive ? "bg-[#DAF9F1] text-[#4CC5A6]" : "bg-[#FFF] text-[#999]"
          }`}
      >
        <Image
          src={iconSrc}
          alt={item.icon}
          width={item.icon === "content" ? 18 : 24}
          height={item.icon === "content" ? 18 : 24}
          className={`shrink-0 ${item.icon === "content"? "ml-11.75" : "ml-11"}`}
        />
        <Link href={`/writer/${item.path}?columnId=${columnIdState}`} passHref>
          <div className={`text-3.5 font-400 lh-6 w-14 shrink-0 ${item.icon === "content"? "ml-3" : "ml-2"}`}>
            {item.label}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className="top-17.5 w-65 z-100 fixed h-screen shrink-0 bg-[#FFF]">
        <div className="w-65 h-72.4785 mt-10 flex shrink-0 flex-col">
          <ColumnList />
          <div
            className={`w-65.25 h-12.4705 mt-35px flex shrink-0 ${pathname === "/writer/homepage" ? "bg-[#DAF9F1] text-[#4CC5A6]" : ""}`}
          >
            {renderNavItem(navConfig[0]!)}
          </div>
          {navConfig.slice(1).map(renderNavItem)}
        </div>
      </div>
    </>
  );
};

export default LeftCompass;
"use client";
import Image from "next/image";
import Navbar from "@/app/_components/common/Navbar";
import Link from "next/link";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/trpc/react";
import { Skeleton } from "antd";
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";
import { useRouter, useSearchParams } from "next/navigation";

// 类型定义
interface NavItem {
  href: string;
  iconSrc: string;
  text: string;
}

interface ButtonInfo {
  id: number;
  label: string;
}

export default function UserPage() {
  const router = useRouter();
  const code = useSearchParams().get("code");
  const [token, setToken] = useLocalStorage("token", null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  // API 查询
  const { data: loginData, isSuccess } = api.users.login.useQuery(
    code!,
    { enabled: Boolean(code && !token) },
  );

  const { data: userInfo, isLoading: isUserInfoLoading } =
    api.users.getOne.useQuery(token, { enabled: Boolean(token) });

  const { data: columnInfo, isLoading: isColumnInfoLoading } =
    api.column.getAllByUserId.useQuery(
      { userId: token },
      { enabled: Boolean(token) },
    );

  useEffect(() => {
    if (isSuccess && loginData?.id) {
      setToken(loginData.id);
    }
  }, [loginData?.id, isSuccess, setToken]);

  return (
    <div>
      {/* 背景颜色*/}
      <div className="pb-15 bg-gradient-to-rb from-custom-user_gradient_1 via-custom-user_gradient_2 to-custom-user_gradient_3 min-h-screen w-full px-4">
        {/* 顶部 */}
        <UserTop />
        {/* 专栏、小课区域 */}
        <Display />
        {/*  我的服务模块*/}
        <Service />
        <div className={"z-1 text-gray text-3 flex h-20 w-full items-center justify-center"}>
          ICP备案号：
          <Link href={"http://beian.miit.gov.cn/ "}>
            {" "}
            京ICP备2024064381号-1
          </Link>
        </div>
      </div>
      <div className="z-2 fixed bottom-4 w-full justify-center">
        <Navbar />
      </div>
    </div>
  );

  function UserTop() {
    return (
      <div className="flex flex-row items-center pt-9">
        {token && userInfo ? (
          <div className="w-20.75 h-20.75 relative">
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={userInfo.avatar ?? NotImage()}
              alt="cover"
              quality={100}
              fill
              loading="lazy"
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <Image
            src={"/images/user/NotLoggedIn.svg"}
            alt="avatar"
            width={83}
            height={83}
            className={"rounded-full"}
            onClick={() => router.push("/login")}
          />
        )}

        {/* 用户信息 */}
        <div className="ml-3 flex-1">
          <div className="align-center flex">
            <h1 className="text-3 font-500 lh-6 text-[#252525]">
              {token && userInfo ? userInfo.name : "请点击头像登录"}
            </h1>
            {userInfo?.idType === 1 && (
              <Image
                src="/images/user/Rank.svg"
                alt="group"
                width={20}
                height={20}
                className="ml-2"
              />
            )}
          </div>
          <div className="flex items-center">
            <div className="cover flex h-3.5 w-3.5 items-center">
              <Image
                src="/images/user/I_logo.svg"
                alt="group"
                width={7.44}
                height={7.44}
                className="w-1.4775 h-1.86 fill-#666 shrink-0"
              />
              <Image
                src="/images/user/D_logo.svg"
                alt="group"
                width={7.44}
                height={7.44}
                className="w-1.4775 h-1.86 fill-#666 shrink-0"
              />
            </div>
            <span className="w-18 font-Source Han Sans SC text-2.5 font-not-italic font-400 lh-6 ml-1 items-center text-[#999]">
              {userInfo?.idNumber}
            </span>
          </div>
        </div>
        <div className="pl-2.5">
          {/* 编辑资料 */}
          <button
            className={`w-20 h-6 text-10px border-0 flex items-center justify-center 
               bg-#fff rounded-full ${(!token || !userInfo) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Image
              src="/images/user/icon_edit.png"
              alt="icon"
              width={16}
              height={16}
            />
            {(!token || !userInfo) ? (
              <span className="ml-2">编辑资料</span>
            ) : (
              <Link
                href="/dashboard/user/message"
                prefetch={false}
                className="ml-2"
              >
                编辑资料
              </Link>
            )}
          </button>
        </div>
      </div>
    );
  }

  function Service() {
    const cardStyles = "flex flex-col items-center w-1/4 mt-2 mb-2";
    const navItems: NavItem[] = [
      {
        href: `/dashboard/user/detail?id=${token}`,
        iconSrc: "/images/user/HomePage.svg",
        text: "个人主页",
      },
      {
        href: "",
        iconSrc: "/images/user/KnowledgePlanet.svg",
        text: "知识星球",
      },
      {
        href: "https://eahu7fmu6k6.feishu.cn/wiki/JtU0wJWhfiBygNkEoCBc2VUIndb?from=from_copylink",
        iconSrc: "/images/user/Usage.svg",
        text: "使用说明",
      },
      {
        href: "/dashboard/user/wallet",
        iconSrc: "/images/user/Income.svg",
        text: "收入提现",
      },
      {
        href: "https://eahu7fmu6k6.feishu.cn/share/base/form/shrcnM3bJTp21SwwwwAcZ39Q2EL",
        iconSrc: "/images/user/Feedback.svg",
        text: "意见反馈",
      },
      {
        href: "https://work.weixin.qq.com/kfid/kfcef6edb33788c7a32",
        iconSrc: "/images/user/Contact.svg",
        text: "联系客服",
      },
    ];

    const renderNavItem = useCallback((item: NavItem, index: number) => (
      <li key={index} className={cardStyles}>
        <Link href={item.href} className={"flex flex-col items-center"}>
          <div className={"relative h-6 w-6"}>
            <Image
              src={item.iconSrc}
              alt={item.text}
              fill
              className={"object-cover"}
            />
          </div>
          <div className="text-center text-sm font-normal leading-relaxed text-gray-800">
            {item.text}
          </div>
        </Link>
      </li>
    ), [cardStyles]);

    return (
      <div className={"h-51.5 rounded-2.5 bg-#FFF py-4.5 mt-1.5 w-full"}>
        <div className={"text-3.5 font-500 lh-6 pl-5.5 text-[#252525]"}>
          我的服务
        </div>
        <ul className={"mt-4 flex flex-wrap"}>
          {navItems.map(renderNavItem)}
          <li className={cardStyles}>
            <div
              className={"flex flex-col items-center cursor-pointer"}
              onClick={logout}
            >
              <Image
                src={"/images/user/SignOut.svg"}
                alt={"退出登录"}
                width={24}
                height={24}
              />
              <div className={"w-11.5 text-2.75 font-400 lh-6 text-[#252525]"}>
                退出登录
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  function Display() {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const buttonInfos: ButtonInfo[] = [
      { id: 1, label: "专栏" },
      { id: 2, label: "小课" },
    ];

    const renderButtons = useCallback(() => {
      return buttonInfos.map((button, index) => (
        <div key={index}>
          <button
            className={`mr-8 bg-transparent ${currentPage === button.id ? "text-#252525" : "text-#B5B5B5"}`}
            onClick={() => setCurrentPage(button.id)}
          >
            {button.label}
          </button>
          <div
            className={`ml-2.25 w-2.75 rounded-2 mt-1 h-1 ${currentPage === button.id ? "bg-#45E1B8" : "bg-#FFF"
              }`}
          />
        </div>
      ));
    }, [currentPage]);

    const Column = () => {
      if (!columnInfo || columnInfo.length === 0)
        return (
          <div className="mt-4 h-10 text-center text-[#B5B5B5]">
            暂无数据哦~
          </div>
        );

      return columnInfo.slice(0, columnInfo.length > 1 ? 2 : 1).map((item) => (
        <Link
          href={`/dashboard/special-column?id=${item.id}`}
          className="mb-4 flex"
          key={item.id}
        >
          <div className="w-15.5 h-19 relative">
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={item?.cover ?? NotImage()}
              alt="cover"
              quality={100}
              fill
              loading="lazy"
              className="rounded object-cover"
            />
          </div>
          <div>
            <div className="w-59.25 text-3.75 font-500 lh-6 ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
              「{item?.name ?? "未知专栏"}」
            </div>
            <div className="w-59.25 text-#666 text-3.25 font-400 ml-3 mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {item?.introduce ?? "暂无简介"}
            </div>
          </div>
        </Link>
      ));
    };

    const Course = () => {
      return (
        <div className={"flex items-center justify-center"}>
          <div className="mt-4 h-10 text-center text-[#B5B5B5]">
            暂无数据哦~
          </div>
        </div>
      );
    };

    if (!token || !userInfo) return <></>;

    return (
      <>
        <div className="border-rd-2.5 bg-#FFF mt-4 w-full pb-2 pl-4 pt-4">
          {/* 导航区域 */}
          <div className="flex">{renderButtons()}</div>
          {/* 内容区域 */}
          <div className="mt-3">
            {isUserInfoLoading || isColumnInfoLoading ? (
              <Skeleton
                active
                paragraph={{ rows: 4 }}
                title={false}
                className="border-rd-2.5 bg-#FFF mt-4 w-full pb-2 pl-4 pt-4"
              />
            ) : currentPage === 1 ? (
              <Column />
            ) : (
              <Course />
            )}
          </div>
        </div>
      </>
    );
  }
};

"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import Loading from "@/app/_components/common/Loading";
import { api } from "@/trpc/react";

const HomepageData = ({ columnId }: { columnId: string | undefined }) => {
  const code = useSearchParams().get("code");
  const [token, setToken] = useLocalStorage("token", null);
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: loginData,
    isFetching: isLoginFetch,
    isSuccess,
  } = api.users.qrcodeLogin.useQuery(
    { code },
    {
      enabled: Boolean(code && !token),
    },
  );
  const { data: columns, isFetching: isColumnFetch } =
    api.column.getAllByUserId.useQuery(
      {
        userId: token,
      },
      { enabled: Boolean(token) },
    );
  useEffect(() => {
    if (isSuccess) {
      setToken(loginData.id);
    }
  }, [loginData]);

  useEffect(() => {
    if (isLoginFetch || isColumnFetch) return;
    if (token && (!columns || columns?.length === 0)) {
      router.push(`/writer/no-column`);
    }
    console.log("columns", columns);
    if ((!columnId || columnId === "null") && columns && columns.length !== 0) {
      router.push(
        `/writer${pathname.split("/writer")[1]}?columnId=` + columns[0]?.id,
      );
    }
  }, [isColumnFetch, isLoginFetch, columnId, columns, pathname, router, token]);

  return (
    <div className="h-82 border-rd-2.5 w-full bg-[#FFF] pl-8 pr-9">
      <div className="pt-34px flex items-center">
        <span className="text-4 font-700 lh-6 text-[#323232]">主板看板</span>
        <Link
          href={`/edit/edit?columnId=${columnId}`}
          className="w-20.5 color-[#1db48d] ml-32px flex h-9 bg-[#dbf9f1]"
        >
          <span className="m-auto">+发布</span>
        </Link>
      </div>
      <Panel columnId={columnId}></Panel>
    </div>
  );
};

function Panel({ columnId }: { columnId: string }) {
  // 昨天、上周、上个月的阅读量
  const { data: reads, isLoading: isReadLoading } =
    api.read.getReading.useQuery({ columnId: columnId });
  const [readsYesterdayCount, readsLastWeekCount, readsLastMonthCount] =
    reads || [0, 0, 0];
  // 今天相较昨天新增的阅读量
  const { data: readRate, isLoading: isReadRateLoading } =
    api.read.getReadingRateOfIncrease.useQuery({ columnId: columnId });
  // 昨天、上周、上个月的订阅量
  const { data: subscriptions, isLoading: isSubscriptionLoading } =
    api.order.getSubscriptionVolume.useQuery({ columnId: columnId });
  const [
    subscriptYesterdayCount,
    subscriptLastWeekCount,
    subscriptLastMonthCount,
  ] = subscriptions || [0, 0, 0];
  // 今天相较昨天新增的订阅量
  const { data: subscriptionRate, isLoading: isSubscriptionRateLoading } =
    api.order.getSubscriptionRateOfIncrease.useQuery({ columnId: columnId });
  if (
    isReadLoading ||
    isReadRateLoading ||
    isSubscriptionLoading ||
    isSubscriptionRateLoading
  )
    return (
      <div className={"h-58 flex items-center justify-center"}>
        <Loading />
      </div>
    );
  return (
    <div className="flex items-center pt-6">
      <div className="w-87 border-rd-2.5 border-1 relative h-52 flex-1 shrink-0 border-solid border-[#ECECEC] bg-[#FFF]">
        <ul className="mt-60.7px text-4 font-700 lh-6 flex items-center text-center">
          <li className="text-3.5 font-400 flex-1 text-[#323232]">阅读量</li>
          <li className="flex-1">{readsYesterdayCount}</li>
          <li className="flex-1">{readsLastWeekCount}</li>
          <li className="flex-1">{readsLastMonthCount}</li>
        </ul>
        <ul className="text-3.5 lh-6 flex text-center text-[rgba(153,153,153,0.60)]">
          <li className={"w-13 h-13 relative flex-1"}>
            <Image
              src={"/images/homepage/readding.svg"}
              alt={"accelerate"}
              fill
            />
          </li>
          <li className="flex-1">昨日(次)</li>
          <li className="flex-1">一周内(次)</li>
          <li className="flex-1">一月内(次)</li>
        </ul>
        <div className="top-66% left-44% absolute flex items-center">
          {readRate > 0 ? (
            <Image
              src={"/images/homepage/Arrow-right-up.svg"}
              alt="arrow"
              width={20}
              height={20}
            ></Image>
          ) : (
            <Image
              src={"/images/homepage/Arrow-left-down.svg"}
              alt="arrow"
              width={20}
              height={20}
            ></Image>
          )}
          <span className="text-3 font-700 lh-6 ml-10.48px text-[#4CC5A6]">
            {readRate > 0 ? `+${readRate}` : `${readRate}`}%相较昨天
          </span>
        </div>
      </div>

      <div className="w-87 border-rd-2.5 border-1 ml-18px relative h-52 flex-1 shrink-0 border-solid border-[#ECECEC] bg-[#FFF]">
        <ul className="mt-60.7px text-4 font-700 lh-6 flex items-center text-center text-[rgba(0,0,0,0.65)]">
          <li className="text-3.5 font-400 flex-1 text-[#323232]">订阅量</li>
          <li className="flex-1">{subscriptYesterdayCount}</li>
          <li className="flex-1">{subscriptLastWeekCount}</li>
          <li className="flex-1">{subscriptLastMonthCount}</li>
        </ul>

        <ul className="text-3.5 lh-6 flex text-center text-[rgba(153,153,153,0.60)]">
          <li className={"w-13 h-13 relative flex-1"}>
            <Image
              src={"/images/homepage/subscribe.svg"}
              alt={"accelerate"}
              fill
            />
          </li>
          <li className="flex-1">昨日(次)</li>
          <li className="flex-1">一周内(次)</li>
          <li className="flex-1">一月内(次)</li>
        </ul>
        <div className="top-66% left-44% absolute flex items-center">
          {subscriptionRate > 0 ? (
            <Image
              src={"/images/homepage/Arrow-right-up.svg"}
              alt="arrow"
              width={20}
              height={20}
            ></Image>
          ) : (
            <Image
              src={"/images/homepage/Arrow-left-down.svg"}
              alt="arrow"
              width={20}
              height={20}
            ></Image>
          )}
          <span className="text-3 font-700 lh-6 ml-10.48px text-[#4CC5A6]">
            {subscriptionRate > 0
              ? `+${subscriptionRate}`
              : `${subscriptionRate}`}
            %相较昨天
          </span>
        </div>
      </div>

      <div className="w-87 border-rd-2.5 border-1 ml-18px relative h-52 flex-1 shrink-0 border-solid border-[#ECECEC] bg-[#FFF]">
        <ul className="mt-60.7px text-4 font-700 lh-6 flex items-center text-center text-[rgba(0,0,0,0.65)]">
          <li className="text-3.5 font-400 flex-1 text-[#323232]">加速计划</li>
          <li className="flex-1">1010</li>
          <li className="flex-1">1010</li>
          <li className="flex-1">1010</li>
        </ul>
        <ul className="text-3.5 lh-6 flex text-center text-[rgba(153,153,153,0.60)]">
          <li className={"w-13 h-13 relative flex-1"}>
            <Image
              src={"/images/homepage/accelerate.svg"}
              alt={"accelerate"}
              fill
            />
          </li>
          <li className="flex-1">昨日(次)</li>
          <li className="flex-1">一周内(次)</li>
          <li className="flex-1">一月内(次)</li>
        </ul>
        <div className="top-66% left-44% absolute flex items-center">
          <Image
            src={"/images/homepage/Arrow-right-up.svg"}
            alt="arrow"
            width={20}
            height={20}
          ></Image>
          <span className="text-#4CC5A6 text-3 font-700 lh-6 ml-10.48px">
            -0.19%相较昨天
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomepageData;

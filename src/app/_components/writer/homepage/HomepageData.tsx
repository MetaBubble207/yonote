"use client"
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import {useEffect} from "react";
import useLocalStorage from "@/tools/useStore";
import Loading from "@/app/_components/common/Loading";

const HomepageData = () => {
    const [token] = useLocalStorage("token", null);
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const columns = api.column.getAllByUserId.useQuery({
        userId: token
    }).data;
    const columnId = params.get("columnId");

    useEffect(() => {
        if ((!columnId || columnId === "null") && columns) {
            router.push(`/writer${pathname.split("/writer")[1]}?columnId=` + columns[0]?.id)
        }
    }, [columns]);

    return (
        <div className="w-full h-82 pl-8 pr-9 bg-[#FFF] border-rd-2.5">
            <div className="flex items-center pt-34px">
                <span className="text-[#323232] text-4 font-700 lh-6">主板看板</span>
                <Link href={`/edit/edit?columnId=${columnId}`}
                      className="flex w-20.5 h-9 color-[#1db48d] bg-[#dbf9f1] ml-32px">
                    <span className="m-auto">+发布</span>
                </Link>
            </div>
            <Panel columnId={columnId}></Panel>
        </div>
    )
}

function Panel({columnId}: { columnId: string }) {
    // 昨天、上周、上个月的阅读量
    const {data: reads, isLoading: isReadLoading}
        = api.read.getReading.useQuery({columnId: columnId});
    const [readsYesterdayCount, readsLastWeekCount, readsLastMonthCount] = reads || [0, 0, 0];
    // 今天相较昨天新增的阅读量
    const {data: readRate, isLoading: isReadRateLoading}
        = api.read.getReadingRateOfIncrease.useQuery({columnId: columnId});
    // 昨天、上周、上个月的订阅量
    const {
        data: subscriptions,
        isLoading: isSubscriptionLoading
    }
        = api.order.getSubscriptionVolume.useQuery({columnId: columnId});
    const [subscriptYesterdayCount, subscriptLastWeekCount, subscriptLastMonthCount] = subscriptions || [0, 0, 0]
    // 今天相较昨天新增的订阅量
    const {data: subscriptionRate, isLoading: isSubscriptionRateLoading}
        = api.order.getSubscriptionRateOfIncrease.useQuery({columnId: columnId});
    if (isReadLoading
        || isReadRateLoading
        || isSubscriptionLoading
        || isSubscriptionRateLoading) return <div className={'h-58 flex items-center justify-center'}>
        <Loading/>
    </div>
    return <div className="pt-6 flex items-center">
        <div
            className="relative flex-1 w-87 h-52 shrink-0 border-rd-2.5 border-1 border-solid border-[#ECECEC] bg-[#FFF]">
            <ul className="flex items-center text-center mt-60.7px text-4 font-700 lh-6">
                <li className="flex-1 text-[#323232] text-3.5 font-400">阅读量</li>
                <li className="flex-1">{readsYesterdayCount}</li>
                <li className="flex-1">{readsLastWeekCount}</li>
                <li className="flex-1">{readsLastMonthCount}</li>
            </ul>
            <ul className="flex text-center text-[rgba(153,153,153,0.60)] text-3.5 lh-6">
                <li className={"flex-1 w-13 h-13 relative"}>
                    <Image src={"/images/homepage/readding.svg"} alt={"accelerate"} fill/>
                </li>
                <li className="flex-1">昨日(次)</li>
                <li className="flex-1">一周内(次)</li>
                <li className="flex-1">一月内(次)</li>
            </ul>
            <div className="absolute top-66% left-44% flex items-center">
                {readRate > 0
                    ? <Image src={"/images/homepage/Arrow-right-up.svg"} alt="arrow" width={20}
                             height={20}></Image>
                    : <Image src={"/images/homepage/Arrow-left-down.svg"} alt="arrow" width={20}
                             height={20}></Image>
                }
                <span className="text-[#4CC5A6] text-3 font-700 lh-6 ml-10.48px">
                            {readRate > 0 ? `+${readRate}` : `${readRate}`}%相较昨天
                        </span>
            </div>
        </div>

        <div
            className="relative flex-1 w-87 h-52 shrink-0 border-rd-2.5 border-1 border-solid border-[#ECECEC] bg-[#FFF] ml-18px">
            <ul className="flex items-center text-center mt-60.7px text-4 font-700 lh-6 text-[rgba(0,0,0,0.65)]">
                <li className="flex-1 text-[#323232] text-3.5 font-400">订阅量</li>
                <li className="flex-1">{subscriptYesterdayCount}</li>
                <li className="flex-1">{subscriptLastWeekCount}</li>
                <li className="flex-1">{subscriptLastMonthCount}</li>
            </ul>

            <ul className="flex text-center text-[rgba(153,153,153,0.60)] text-3.5 lh-6">
                <li className={"flex-1 w-13 h-13 relative"}>
                    <Image src={"/images/homepage/subscribe.svg"} alt={"accelerate"} fill/>
                </li>
                <li className="flex-1">昨日(次)</li>
                <li className="flex-1">一周内(次)</li>
                <li className="flex-1">一月内(次)</li>
            </ul>
            <div className="absolute top-66% left-44% flex items-center">
                {subscriptionRate > 0
                    ? <Image src={"/images/homepage/Arrow-right-up.svg"} alt="arrow" width={20}
                             height={20}></Image>
                    : <Image src={"/images/homepage/Arrow-left-down.svg"} alt="arrow" width={20}
                             height={20}></Image>
                }
                <span className="text-[#4CC5A6] text-3 font-700 lh-6 ml-10.48px">
                             {subscriptionRate > 0 ? `+${subscriptionRate}` : `${subscriptionRate}`}%相较昨天
                        </span>
            </div>
        </div>

        <div
            className="relative flex-1 w-87 h-52 shrink-0 border-rd-2.5 border-1 border-solid border-[#ECECEC] bg-[#FFF] ml-18px">
            <ul className="flex items-center text-center mt-60.7px text-4 font-700 lh-6 text-[rgba(0,0,0,0.65)]">
                <li className="flex-1 text-[#323232] text-3.5 font-400">加速计划</li>
                <li className="flex-1">1010</li>
                <li className="flex-1">1010</li>
                <li className="flex-1">1010</li>
            </ul>
            <ul className="flex text-center text-[rgba(153,153,153,0.60)] text-3.5 lh-6">
                <li className={"flex-1 w-13 h-13 relative"}>
                    <Image src={"/images/homepage/accelerate.svg"} alt={"accelerate"} fill/>
                </li>
                <li className="flex-1">昨日(次)</li>
                <li className="flex-1">一周内(次)</li>
                <li className="flex-1">一月内(次)</li>
            </ul>
            <div className="absolute top-66% left-44% flex items-center">
                <Image src={"/images/homepage/Arrow-right-up.svg"} alt="arrow" width={20} height={20}></Image>
                <span className="text-#4CC5A6 text-3 font-700 lh-6 ml-10.48px">-0.19%相较昨天</span>
            </div>
        </div>
    </div>
}

export default HomepageData;

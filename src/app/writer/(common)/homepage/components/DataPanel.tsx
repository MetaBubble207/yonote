"use client";
import React from "react";
import Image from "next/image";

interface DataPanelProps {
    reads: number[];
    readRate: number;
    subscriptions: number[];
    subscriptionRate: number;
    // 可以添加加速计划相关的数据
}

const DataPanel = ({
    reads,
    readRate,
    subscriptions,
    subscriptionRate
}: DataPanelProps) => {
    const [readsYesterdayCount, readsLastWeekCount, readsLastMonthCount] = reads;
    const [
        subscriptYesterdayCount,
        subscriptLastWeekCount,
        subscriptLastMonthCount,
    ] = subscriptions;

    return (
        <div className="flex items-center pt-6">
            {/* 阅读量卡片 */}
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
                            alt={"阅读量"}
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
                            alt="上升"
                            width={20}
                            height={20}
                        />
                    ) : (
                        <Image
                            src={"/images/homepage/Arrow-left-down.svg"}
                            alt="下降"
                            width={20}
                            height={20}
                        />
                    )}
                    <span className="text-3 font-700 lh-6 ml-10.48px text-[#4CC5A6]">
                        {readRate > 0 ? `+${readRate}` : `${readRate}`}%相较昨天
                    </span>
                </div>
            </div>

            {/* 订阅量卡片 */}
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
                            alt={"订阅量"}
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
                            alt="上升"
                            width={20}
                            height={20}
                        />
                    ) : (
                        <Image
                            src={"/images/homepage/Arrow-left-down.svg"}
                            alt="下降"
                            width={20}
                            height={20}
                        />
                    )}
                    <span className="text-3 font-700 lh-6 ml-10.48px text-[#4CC5A6]">
                        {subscriptionRate > 0
                            ? `+${subscriptionRate}`
                            : `${subscriptionRate}`}
                        %相较昨天
                    </span>
                </div>
            </div>

            {/* 加速计划卡片 - 可以根据实际数据进行修改 */}
            <div className="w-87 border-rd-2.5 border-1 ml-18px relative h-52 flex-1 shrink-0 border-solid border-[#ECECEC] bg-[#FFF]">
                <ul className="mt-60.7px text-4 font-700 lh-6 flex items-center text-center text-[rgba(0,0,0,0.65)]">
                    <li className="text-3.5 font-400 flex-1 text-[#323232]">加速计划</li>
                    <li className="flex-1">0</li>
                    <li className="flex-1">0</li>
                    <li className="flex-1">0</li>
                </ul>
                <ul className="text-3.5 lh-6 flex text-center text-[rgba(153,153,153,0.60)]">
                    <li className={"w-13 h-13 relative flex-1"}>
                        <Image
                            src={"/images/homepage/accelerate.svg"}
                            alt={"加速计划"}
                            fill
                        />
                    </li>
                    <li className="flex-1">昨日(次)</li>
                    <li className="flex-1">一周内(次)</li>
                    <li className="flex-1">一月内(次)</li>
                </ul>
                <div className="top-66% left-44% absolute flex items-center">
                    <Image
                        src={"/images/homepage/Arrow-left-down.svg"}
                        alt="下降"
                        width={20}
                        height={20}
                    />
                    <span className="text-3 font-700 lh-6 ml-10.48px text-[#4CC5A6]">
                        0%相较昨天
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DataPanel;
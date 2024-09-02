"use client";
import Image from "next/image";
import Link from "next/link";
import {timeToDateString} from "@/tools/timeToString";
import React from "react";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import {type BaseColumnCard} from "@/server/db/schema";

const SubscribeColumn = ({column}: { column: BaseColumnCard }) => {
    return (
        <Link href={`/dashboard/special-column?id=${column.id}`}>
            <div className="h-29.25 mt-4 flex">
                <div className="relative h-18">
                    <Link href={`/dashboard/user/detail?id=${column.userId}`}>
                        <div className="relative w-11.25 h-11.25 mt-4">
                            <Image
                                placeholder="blur"
                                blurDataURL={DefaultLoadingPicture()}
                                src={column.avatar ?? DefaultLoadingPicture()}
                                alt='avatar'
                                quality={100}
                                fill
                                loading='lazy'
                                className='rounded-full object-cover'
                            />
                        </div>
                    </Link>
                    <div className="bottom-2 right-1 absolute">
                        <Image
                            src={"/images/subscribe/vip.svg"}
                            alt="vip"
                            width={12}
                            height={12}
                            className="w-3 h-3"
                        ></Image>
                    </div>
                    <div
                        className="text-center text-[#999]  font-500 lh-5.6 text-2.5 w-11 overflow-hidden whitespace-nowrap">
                        {column.name?.length >= 8 ? column.name + "…" : column.name}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="text-2.75 lh-4 text-[#B5B5B5] ml-2.6">
                        {timeToDateString(column.createdAt)}发布
                    </div>
                    <div
                        className="border-rd-[2px_16px_16px_16px] bg-[#FFF] h-24 mt-1 ml-2 flex items-center shrink-0 w-73.25">
                        <div className="w-49.75 pl-2.5 ">
                            <div className="text-[#252525] text-3.75 font-500 lh-6">
                                {column?.name
                                    ? column?.name?.length >= 20
                                        ? column?.name?.substring(0, 20) + "..."
                                        : column?.name
                                    : "未知专栏"}
                            </div>
                            <div className="text-[#666] text-3.25 h-10 font-400 mt-2 overflow-hidden relative">
                                {column?.introduce
                                    ? column?.introduce?.length >= 25
                                        ? column?.introduce?.substring(0, 25) + "..."
                                        : column?.introduce
                                    : "未知专栏"}
                                <div className="absolute bottom-0 right-0 w-full h-4 bg-gradient-to-t from-white"></div>
                            </div>
                        </div>
                        <div className="w-15.5 h-19 ml-3 relative">
                            <Image
                                placeholder="blur"
                                blurDataURL={DefaultLoadingPicture()}
                                src={column.cover ?? DefaultLoadingPicture()}
                                alt="cover"
                                fill
                                loading='lazy'
                                quality={100}
                                className="rounded-2 object-cover"
                            ></Image>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
export default SubscribeColumn;

import Image from "next/image";
import {timeToDateString} from "@/tools/timeToString";
import Link from "next/link";
import React from "react";
import {api} from "@/trpc/react";

const ColumnCard = ({columnData}) => {
    const order = api.order.getColumnOrder.useQuery({columnId: columnData?.id});
    const read = api.read.getColumnRead.useQuery({columnId: columnData?.id});
    return (
        <Link href={`/special-column?id=${columnData.id}`}>
            <div className="w-85.75 h-32 border-rd-5 bg-[#FFF] pr-4 pl-2.5 ">
                <div className="flex h-19 pt-2">
                    <div className={"w-15.5 h-19 relative shrink-0"}>
                        <Image
                            placeholder="blur"
                            blurDataURL={columnData.logo ?? "/images/user/Loading.svg"}
                            src={columnData.logo ?? "/images/user/Loading.svg"}
                            alt="cover"
                            layout='fill'
                            objectFit='cover'
                            quality={100}
                            className="border-rd-2"
                        ></Image>
                    </div>
                    <div className="w-250px h-64px mt-1 ml-3">
                        <div className="text-[#252525] text-3.75 font-500 lh-6 w-80%" style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {columnData.name}
                        </div>
                        <div className="text-[#666] text-3.25 h-10 w-80% font-400 mt-2 overflow-hidden relative"
                             style={{
                                 display: '-webkit-box',
                                 WebkitBoxOrient: 'vertical',
                                 WebkitLineClamp: 2,
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                             }}>
                            {columnData.introduce}
                        </div>

                    </div>
                </div>
                <div className={"flex items-center justify-between w-full pt-3 mb-4"}>
                    <div className="flex items-center">
                        <Image
                            placeholder="blur"
                            blurDataURL={columnData.user?.avatar ?? "/images/user/Loading.svg"}
                            src={columnData.user?.avatar ?? "/images/user/Loading.svg"}
                            alt="user_image"
                            width={24}
                            height={24}
                            className="rounded-full"
                        ></Image>
                        <div className="ml-1">
                            <div className="flex text-[#999] text-2.75 lh-4">
                                {columnData.user?.name}
                            </div>
                            <div className="text-[#B5B5B5] text-2.75 lh-4">
                                {timeToDateString(columnData.createdAt)}发布
                            </div>
                        </div>
                    </div>
                    <div className={"flex"}>
                        <div className="flex items-center">
                            <Image
                                src={"/images/recommend/rss.svg"}
                                alt="rss"
                                width={5}
                                height={5}
                                className="w-4.5 h-4.5 "
                            ></Image>
                            <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">
                                {order.data?.length}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Image
                                src={"/images/recommend/open.svg"}
                                alt="open"
                                width={5}
                                height={5}
                                className=" w-4.5 h-4.5 ml-7"
                            ></Image>
                            <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">
                                {read?.data}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ColumnCard;

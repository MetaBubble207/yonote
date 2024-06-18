import Image from "next/image";
import {api} from "@/trpc/react";
import React, {useState, useEffect} from "react";
import {timeToDateString} from "@/tools/timeToString";
import Link from "next/link";


const Card = (props) => {
    const item = props.data;
    const order = api.order.getColumnOrder.useQuery({columnId: item?.id});
    const read = api.read.getColumnRead.useQuery({columnId: item?.id});
    return (
        <div>
            <div className="mt-4 ml-4" key={item.id}>
                <Link href={`/special-column?id=${item.id}`}>
                    <div className="w-85.75 h-33.75 border-rd-5 bg-[#FFF]">
                        <div className="flex h-19 pl-2.5 pt-2">
                            <Image
                                unoptimized
                                style={{objectFit: "cover"}}
                                src={item.logo ?? "/images/user/Loading.svg"}
                                alt="cover"
                                width={24}
                                height={24}
                                className="w-15.5 h-19 border-rd-2"
                            ></Image>
                            <div className="w-64.25 h-16 mt-1 ml-3">
                                <div className="text-[#252525] text-3.75 font-500 lh-6 ">
                                    {item.name}
                                </div>
                                <div className="text-[#666] text-3.25 font-400 lh-[120%] mt-2">
                                    {item?.introduce?.length >= 20 ? item?.introduce.substring(0, 20) : item.introduce}
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
                            <Image
                                src={item.user?.avatar ?? "/images/user/Loading.svg"}
                                alt="user_image"
                                width={24}
                                height={24}
                                className="w-24px h-24px border-rd-12"
                            ></Image>
                            <div className="ml-1 w-43">
                                <div className="flex text-[#999] text-2.75 lh-4">
                                    {item.user?.name}
                                </div>
                                <div className="text-[#B5B5B5] text-2.75 lh-4">
                                    {timeToDateString(item.createdAt)}发布
                                </div>
                            </div>
                            <div className="flex-1 flex items-center">
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
                </Link>
            </div>
        </div>
    )
};

export default Card;
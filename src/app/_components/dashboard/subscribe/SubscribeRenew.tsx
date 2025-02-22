"use client";
import Image from "next/image";
import Link from "next/link";
import { time2DateString } from "@/tools/timeToString";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import React from "react";
import { type DetailColumnCard } from "@/server/db/schema";

const SubscribeRenew = ({ column }: { column: DetailColumnCard }) => {
  return (
    <div className="w-85.75 h-42.75 border-rd-5 p2.5 mb-2 bg-[#FFF] pr-6">
      <div>
        <Link href={`/dashboard/special-column?id=${column.id}`}>
          <div className="h-27 flex">
            <div className="w-20.25 h-26.5 relative">
              <Image
                placeholder="blur"
                blurDataURL={DefaultLoadingPicture()}
                src={column?.cover ?? DefaultLoadingPicture()}
                alt="cover"
                quality={100}
                fill
                loading="lazy"
                className="rounded-2 object-cover"
              />
            </div>
            <div className="w-57.5 ml-3 mt-2">
              <div className="text-3.75 font-500 lh-6 text-[#252525]">
                {column?.name
                  ? column?.name?.length >= 20
                    ? column?.name?.substring(0, 20) + "..."
                    : column?.name
                  : "未知专栏"}
              </div>
              <div
                className="text-3.25 font-400 lh-[120%] text-[#666]"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {column.introduce
                  ? column.introduce?.length >= 100
                    ? column?.introduce?.substring(0, 100) + "..."
                    : column?.introduce
                  : "未知专栏"}
              </div>
            </div>
          </div>
        </Link>
        <div className="mt-2.5 flex w-full items-center justify-between">
          <Link href={`/dashboard/user/detail?id=${column.userId}`}>
            <div className={"flex items-center"}>
              <div className="w-5.75 h-5.75 relative">
                <Image
                  placeholder="blur"
                  blurDataURL={DefaultLoadingPicture()}
                  src={column.avatar ?? DefaultLoadingPicture()}
                  alt={"cover"}
                  fill
                  loading="lazy"
                  quality={100}
                  className="rounded-full object-cover"
                ></Image>
              </div>
              <div className="w-43 ml-1">
                <div className="flex items-center">
                  <div className="text-2.75 lh-4 text-[#999]">
                    {column.userName}
                  </div>
                  <Image
                    src={"/images/subscribe/vip.svg"}
                    alt="cover"
                    width={24}
                    height={24}
                    className="ml-1.2 h-3 w-3"
                  ></Image>
                </div>
                <div className="text-2.75 lh-4 text-[#B5B5B5]">
                  {time2DateString(column.createdAt)}发布
                </div>
              </div>
            </div>
          </Link>
          <div className="flex items-center">
            <div>
              <Image
                src={"/images/special-column/heart 2.png"}
                alt={"爱心"}
                width={18}
                height={18}
                objectFit="none"
              />
            </div>
            <div className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
              {column.likeCount}
            </div>
            <Image
              src={"/images/subscribe/see.svg"}
              alt="like"
              width={5}
              height={5}
              className="w-4.5 h-4.5 ml-7"
            ></Image>
            <div className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
              {column.readCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubscribeRenew;

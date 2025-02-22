import Image from "next/image";
import { time2DateString } from "@/tools/timeToString";
import Link from "next/link";
import React from "react";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import { type DetailColumnCard } from "@/server/db/schema";

const ColumnCard = ({ columnData }: { columnData: DetailColumnCard }) => {
  return (
    <div className="w-85.75 border-rd-5 h-32 bg-[#FFF] pl-2.5 pr-4">
      <Link href={`/dashboard/special-column?id=${columnData.id}`}>
        <div className="h-19 flex pt-2">
          <div className="w-15.5 h-19 relative">
            <Image
              placeholder="blur"
              blurDataURL={DefaultLoadingPicture()}
              src={columnData.cover ?? DefaultLoadingPicture()}
              alt="cover"
              quality={100}
              fill
              loading="lazy"
              className="rounded-2 object-cover"
            />
          </div>
          <div className="w-250px h-64px ml-3 mt-1">
            <div
              className="text-3.75 font-500 lh-6 w-80% text-[#252525]"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {columnData.name}
            </div>
            <div
              className="text-3.25 w-80% font-400 relative mt-2 h-10 overflow-hidden text-[#666]"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {columnData.introduce}
            </div>
          </div>
        </div>
      </Link>
      <div className={"mb-4 flex w-full items-center justify-between pt-3"}>
        <Link href={`/dashboard/user/detail?id=${columnData.userId}`}>
          <div className="flex items-center">
            <div className="relative h-6 w-6">
              <Image
                placeholder="blur"
                blurDataURL={DefaultLoadingPicture()}
                src={columnData?.avatar ?? DefaultLoadingPicture()}
                alt="cover"
                quality={100}
                fill
                loading="lazy"
                className="rounded-full object-cover"
              />
            </div>
            <div className="ml-1">
              <div className="text-2.75 lh-4 flex text-[#999]">
                {columnData.userName}
              </div>
              <div className="text-2.75 lh-4 text-[#B5B5B5]">
                {time2DateString(columnData.createdAt)}发布
              </div>
            </div>
          </div>
        </Link>
        <div className={"flex"}>
          <div className="flex items-center">
            <Image
              src={"/images/recommend/rss.svg"}
              alt="rss"
              width={5}
              height={5}
              className="w-4.5 h-4.5"
            />
            <div className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
              {columnData.subscriptionCount}
            </div>
          </div>
          <div className="flex items-center">
            <Image
              src={"/images/recommend/open.svg"}
              alt="open"
              width={5}
              height={5}
              className="w-4.5 h-4.5 ml-7"
            />
            <div className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
              {columnData.readCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnCard;

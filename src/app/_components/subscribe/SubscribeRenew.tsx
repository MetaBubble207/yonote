"use client";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useContext, useState } from "react";
import { timeToDateString } from "@/tools/timeToString";
import * as console from "console";

const SubscribeRenew = (prop) => {
  // 点赞
  // const [isHeartFilled, setIsHeartFilled] = useState(false);

  // const handleClick = () => {
  //     setIsHeartFilled(!isHeartFilled);
  // };
  const column = prop.column;
  const columnLike = api.like.getColumnLike.useQuery({
    columnId: column.id,
  }).data;
  const columnRead = api.read.getColumnRead.useQuery({
    columnId: column.id,
  }).data;

  const [exist, setExist] = useState(false);

  return (
    <div className="w-85.75 h-42.75 border-rd-5 bg-[#FFF] mb-2">
      <div>
        <Link href={`../special-column?id=${column.id}`}>
          <div className="flex h-27 pl-2.5 pt-2.5">
            {/* <Image
              unoptimized
              style={{ objectFit: "cover" }}
              src={column?.logo ?? "/images/user/Loading.svg"}
              alt="cover"
              width={81}
              height={108}
            ></Image> */}
            <Image
              placeholder="blur"
blurDataURL={column?.logo ?? "/images/user/Loading.svg"}
              unoptimized
              style={{ objectFit: "cover" }}
              src={column?.logo ?? "/images/user/Loading.svg"}
              alt="cover"
              width={81}
              height={108}
              className="border-rd-2"
            >
            </Image>

            <div className="w-57.5 h-21.25 mt-2 ml-3">
              <div className="text-[#252525] text-3.75 font-500 lh-6 ">
                {column?.name ?
                  (column?.name?.length >= 20 ? column?.name?.substring(0, 20) + "..." : column?.name)
                  : "未知专栏"
                }
              </div>
              <div className="text-[#666] text-3.25 font-400 lh-[120%]"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {column?.introduce ?
                  (column?.introduce?.length >= 100 ? column?.introduce?.substring(0, 100) + "..." : column?.introduce)
                  : "未知专栏"}
              </div>
            </div>
          </div>
        </Link>
        <div className="mt-3.5 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
          <Image
            placeholder="blur"
blurDataURL={column.user?.avatar  ?? "/images/user/Loading.svg"}
            style={{ objectFit: "cover" }}
            src={column.user?.avatar}
            alt="user_image"
            width={24}
            height={24}
            className="rounded-full w-5.75 h-5.75"
          ></Image>
          <div className="ml-1 w-43">
            <div className="flex items-center">
              <div className="text-[#999] text-2.75 lh-4">
                {column.user?.name}
              </div>
              <Image
                src={"/images/subscribe/vip.svg"}
                alt="cover"
                width={24}
                height={24}
                className="w-3 h-3 ml-1.2"
              ></Image>
            </div>
            <div className="text-[#B5B5B5] text-2.75 lh-4">
              {timeToDateString(column.createdAt)}发布
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <div>
              <Image
                src={"/images/special-column/heart 2.png"}
                alt={"爱心"}
                width={18}
                height={18}
                objectFit="none"
              />
            </div>
            <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">
              {columnLike}
            </div>
            <Image
              src={"/images/subscribe/see.svg"}
              alt="like"
              width={5}
              height={5}
              className=" w-4.5 h-4.5 ml-7"
            ></Image>
            <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">
              {columnRead}
            </div>
          </div>
        </div>
      </div>

      {/*<Link href={"../special-column-content"}>*/}
      {/*    <div className="flex h-27 pl-2.5 pt-2.5">*/}
      {/*        <Image src={"/images/subscribe/cover.png"} alt="cover" width={24} height={24} className="w-20.25 h-27"></Image>*/}
      {/*        <div className="w-57.5 h-21.25 mt-2 ml-3">*/}
      {/*            <div className="text-[#252525] text-3.75 font-500 lh-6 ">「开播的第3年，P人沉浸于J人的世界」</div>*/}
      {/*            <div className="text-[#666] text-3.25 font-400 lh-[120%]">情绪价值波动，上上签，愤怒，变化，偏执，创造</div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</Link>*/}
      {/*<div className="mt-3.5 ml-3 flex w-full h-9.5 items-center flex-shrink-0">*/}
      {/*    <Image src={"/images/subscribe/user1.png"} alt="user_image" width={24} height={24} className="w-5.75 h-5.75"></Image>*/}
      {/*    <div className="ml-1 w-43">*/}
      {/*        <div className="flex items-center">*/}
      {/*            <div className="text-[#999] text-2.75 lh-4">芋圆</div>*/}
      {/*            <Image src={"/images/subscribe/vip.svg"} alt="cover" width={24} height={24} className="w-3 h-3 ml-1.2"></Image>*/}
      {/*        </div>*/}
      {/*        <div className="text-[#B5B5B5] text-2.75 lh-4">03-01发布</div>*/}
      {/*    </div>*/}
      {/*    <div className="flex-1 flex items-center">*/}
      {/*        <div>*/}
      {/*            <Image*/}
      {/*                src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 2.png"}*/}
      {/*                onClick={handleClick}*/}
      {/*                alt={"爱心"} width={18} height={18} objectFit="none"/>*/}
      {/*        </div>*/}
      {/*        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>*/}
      {/*        <Image src={"/images/subscribe/see.svg"} alt="leke" width={5} height={5}*/}
      {/*               className=" w-4.5 h-4.5 ml-7"></Image>*/}
      {/*        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </div>
  );
};
export default SubscribeRenew;

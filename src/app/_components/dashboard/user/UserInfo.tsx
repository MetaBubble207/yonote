"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import DisplayDetailed from "@/app/_components/dashboard/user/DisplayDetailed";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import type { UserInsert, UserSelect } from "@/server/db/schema";
// 用户头像组件
const UserAvatar = ({ userInfo }: { userInfo: UserInsert }) => (
  <div className="w-31 h-31 absolute top--10 mb-10 flex flex-col items-center justify-center">
    <Image
      src={userInfo.avatar ?? NotImage()}
      alt={`${userInfo.name}的头像`}
      width={83}
      height={83}
      className="rounded-full"
      priority
    />
    <div className="mt-1.25 flex items-center">
      <div className="text-4.5 font-500 lh-6 text-[#252525]">
        {userInfo.name}
      </div>
      {userInfo.idType === 1 && (
        <Image
          className="ml-1.25"
          src="/images/user/vip.svg"
          alt="认证标识"
          width={20}
          height={20}
        />
      )}
    </div>
    <div className="text-2.5 font-400 lh-6 flex justify-center text-[#999]">
      <div className="w-3.75 flex">
        <Image
          src="/images/user/I_logo.svg"
          alt="ID标识I"
          width={6}
          height={6}
        />
        <Image
          src="/images/user/D_logo.svg"
          alt="ID标识D"
          width={10}
          height={7}
        />
      </div>
      <div className="ml-1">{userInfo.idNumber}</div>
    </div>
  </div>
);
// 更多内容链接组件
const MoreContentLink = () => (
  <div className="flex w-full items-center justify-center pb-9">
    <div className="w-26 flex h-7 items-center justify-center rounded-full bg-[#daf9f1]">
      <Link
        href="/dashboard/find"
        className="text-3 font-500 text-[#1DB48D]"
      >
        更多优质内容
      </Link>
    </div>
  </div>
);
// 用户头像组件
export default function UserInfo({ userInfo }: { userInfo: UserSelect }) {
  const [token] = useLocalStorage("token", null);
  return (
    <div>
      <div className="h-28.25 blur-24 relative w-full">
        <Image
          placeholder="blur"
          blurDataURL={LoadingImage()}
          src={userInfo.avatar ?? NotImage()}
          alt="用户封面"
          fill
          priority
          quality={100}
          className="rounded-2 object-cover"
        />
      </div>
      <div className="w-93.75 border-rd-[10px_10px_0px_0px] relative flex justify-center bg-[#FFF]">
        <UserAvatar userInfo={userInfo} />
        <div className="flex h-full w-full flex-col">
          <div className="mt-26">
            <DisplayDetailed
              token={token}
              userInfo={userInfo}
            />
          </div>
          <MoreContentLink />
        </div>
      </div>
    </div>
  );
}
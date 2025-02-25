"use client";
import { api } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import DisplayDetailed from "@/app/_components/dashboard/user/DisplayDetailed";
import Loading from "@/app/_components/common/Loading";
import Error from "@/app/_components/common/Error";
import { useSearchParams } from "next/navigation";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import withTheme from "@/theme";

const Detail = function () {
  const [token] = useLocalStorage("token", null);
  const params = useSearchParams();
  const {
    data: userInfo,
    isLoading,
    isError,
  } = api.users.getOne.useQuery(params.get("id") ?? '');
  if (isLoading)
    return (
      <div className={"mt-80"}>
        <Loading />
      </div>
    );
  if (isError) return <Error text={"没有找到该用户的信息😯~"} />;
  return (
    <Suspense>
      <div>
        <div className="h-28.25 blur-24 relative w-full">
          <Image
            placeholder="blur"
            blurDataURL={DefaultLoadingPicture()}
            src={userInfo?.avatar ?? DefaultLoadingPicture()}
            alt={"cover"}
            fill
            loading="lazy"
            quality={100}
            className="rounded-2 object-cover"
          ></Image>
        </div>
        <div
          className={
            "w-93.75 h-152.75 border-rd-[10px_10px_0px_0px] relative flex justify-center bg-[#FFF]"
          }
        >
          {/*用户信息*/}
          <div
            className={
              "w-31 h-31 absolute top--10 mb-10 flex flex-col items-center justify-center"
            }
          >
            <Image
              src={userInfo?.avatar}
              alt={"头像"}
              width={83}
              height={83}
              className={"rounded-full"}
            />
            {/* 用户名 */}
            <div className={"mt-1.25 flex items-center"}>
              <div className={"text-4.5 font-500 lh-6 text-[#252525]"}>
                {userInfo?.name}
              </div>
              {userInfo?.idType === 1 && (
                <Image
                  className={"ml-1.25"}
                  src={"/images/user/Rank.svg"}
                  alt={"rank"}
                  width={20}
                  height={20}
                />
              )}
            </div>
            {/* ID */}
            <div
              className={
                "text-2.5 font-400 lh-6 flex justify-center text-[#999]"
              }
            >
              <div className={"w-3.75 flex"}>
                <Image
                  src={"/images/user/I_logo.svg"}
                  alt={"I"}
                  width={6}
                  height={6}
                />
                <Image
                  src={"/images/user/D_logo.svg"}
                  alt={"D"}
                  width={10}
                  height={7}
                />
              </div>
              <div className={"ml-1"}>{userInfo?.idNumber}</div>
            </div>
          </div>
          {/*数据展示、导航和内容*/}
          <div className={"flex h-full w-full flex-col"}>
            <div className={"mt-26 flex-1"}>
              <DisplayDetailed
                token={token}
                userInfo={userInfo}
              ></DisplayDetailed>
            </div>
            {/*更多优质内容*/}
            <div className={"flex w-full items-center justify-center pb-9"}>
              <div
                className={
                  "w-26 flex h-7 items-center justify-center rounded-full bg-[#daf9f1]"
                }
              >
                <Link
                  href="/dashboard/find"
                  className={"text-3 font-500 text-[#1DB48D]"}
                >
                  更多优质内容
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
const Page = () => {
  return withTheme(<Detail />);
};

export default Page;

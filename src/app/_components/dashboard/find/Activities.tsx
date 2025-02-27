"use client";
import Image from "next/image";
import React from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";
import { Skeleton, Empty } from "antd";
import withTheme from "@/theme";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/server/api/root";
/* eslint-disable @typescript-eslint/consistent-type-definitions */
type Activity = inferProcedureOutput<AppRouter["activity"]["getAll"]>[number];

const ActivityCard = ({ item }: { item: Activity }) => (
  <Link href="/dashboard/find/recommend" key={item.id}>
    <div className="h-36.25 border-rd-4 relative mt-4 inline flex w-full bg-white transition-shadow hover:shadow-md">
      <div className="h-31.25 w-80.75 item-center ml-2.5 mt-2.5 inline flex">
        <div className="flex flex-col">
          <h3 className="w-33 text-3.75 font-500 lh-6 ml-46 mt-1.75 h-5 truncate text-[#252525]">
            {item.name}
          </h3>
          <p className="w-33 h-11.5 mt-1.25 ml-46 w-13.75 text-3.25 font-400 lh-[120%] line-clamp-2 text-[#666]">
            {item.introduction}
          </p>
        </div>
        <div className="absolute">
          <div className="w-41 h-31.25 relative">
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={item.cover ?? NotImage()}
              alt={item.name ?? ""}
              quality={100}
              fill
              loading="lazy"
              className="rounded-4 object-cover"
            />
          </div>
        </div>

        <div className="w-11.75 h-5.25 border-rd-[0px_25px_25px_0px] absolute left-2.5 top-2.5 bg-[#4EDFE9]">
          <div className="ml-1.75 text-2.5 font-500 lh-[120%] mt-1 text-white">
            进行中
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <button className="font-500 h-[25px] w-[73px] rounded-full bg-[#DAF9F1] text-xs text-[#1DB48D]">
            立即查看
          </button>
        </div>
      </div>
    </div>
  </Link>
);

type SkeletonProps = {
  count?: number;
};

const LoadingSkeleton = ({ count = 3 }: SkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="h-36.25 border-rd-4 p5 mt-4 w-full bg-white"
      />
    ))}
  </>
);

const Activities = () => {
  const { data: queryData, isLoading, error } = api.activity.getAll.useQuery();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500">加载失败，请稍后重试</div>;
  if (!queryData?.length) return <Empty description="暂无活动" />;

  return (
    <div className="space-y-4">
      {queryData.map((item) => (
        <ActivityCard key={item.id} item={item} />
      ))}
    </div>
  );
};

const Page = () => withTheme(<Activities />);

export default Page;

"use client";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import Loading from "@/app/_components/common/Loading";
import NoData from "@/app/_components/common/NoData";

const SpecialColumnIntroduce = () => {
  const params = useSearchParams();
  const columnId = params.get("id");
  const { data: column, isLoading } = api.column.getColumnDetail.useQuery(columnId);

  if (isLoading)
    return (
      <div className={"mt-50"}>
        <Loading />
      </div>
    );
  if (!column?.introduce)
    return (
      <div className={"mt-10"}>
        <NoData title={"该专栏还没有设置介绍噢😯~"} />
      </div>
    );
  return (
    <div className={"mt-20px min-h-40 w-full bg-[#FFF] px-4"}>
      <div
        className={
          "border-rd-5 border-1 min-h-50 w-full break-words border-solid border-[rgba(181,181,181,0.20)] px-4"
        }
      >
        {column.description}
      </div>
    </div>
  );
};

export default SpecialColumnIntroduce;

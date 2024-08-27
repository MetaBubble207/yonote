"use client"
import {api} from "@/trpc/react";
import {useSearchParams} from "next/navigation";
import React from "react";
import Loading from "@/app/_components/common/Loading";
import NoData from "@/app/_components/common/NoData";

const SpecialColumnIntroduce = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const {data: column, isLoading} = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    })

    if (isLoading) return <Loading/>
    if (!column) return <NoData title={"该专栏还没有设置介绍噢😯~"}/>
    return (
        <div className={"w-full min-h-40 mt-20px bg-[#FFF] px-4 "}>
            <div
                className={"border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] w-full min-h-38 px-4"}>{column.introduce}</div>
        </div>
    )
}

export default SpecialColumnIntroduce;

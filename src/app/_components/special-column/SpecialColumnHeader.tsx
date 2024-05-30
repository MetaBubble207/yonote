"use client"
import Image from "next/image";
import {api} from "@/trpc/react";
import {useSearchParams} from "next/navigation";

export const SpecialColumnHeader = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const userid = api.column.getUserId.useQuery({
        id: columnId,
    })

    const user = api.users.getOne.useQuery({
        id: userid.data,
    })

    const column = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    })
    console.log(column)
    return <>
        <div className={"flex justify-end items-center mt-16px"}>
            <div
                className={"inline-block w-14.25 h-6 text-[#252525] shrink-0 bg-#5CE5C1 text-2.5 font-500 lh-6 text-center rounded-10px"}>加速计划
            </div>
            <div className={"inline-block ml-10px mr-16px"}>
                <Image src={"/images/special-column/Share-two (分享2).png"} alt={"分享"} width={12} height={12}/>
            </div>
        </div>
        <div className={"flex mb--50px mt-10px w-full"}>
            <div className={"ml-20px mt--10px w-30%"}>
                <Image src={column.data?.logo} alt={"心智与阅读"} width={140} height={160}
                       style={{width: "100%"}}/>
            </div>
            <div className={"flex flex-col ml-10px space-y-0 "}>
                <div className={"text-[#FFF] text-4.5 font-not-italic font-500 lh-6"}>
                    {column.data?.name}
                </div>
                <div
                    className={"w-98% text-[#F2F2F2] text-3.5 font-not-italic font-400 lh-[120%] pt-5px"}>{column.data?.description}</div>
                <div className={"flex pt-8px "}>
                    <Image src={user.data?.avatar} alt={"心智与阅读"} width={18} height={18} />
                    <div className={"text-[#DFDFDF] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>
                        {user.data?.name}
                    </div>
                    <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12}
                           className={"lh-0"} style={{objectFit: "none", marginLeft: "5px"}}/>
                </div>
            </div>
        </div>
    </>
}

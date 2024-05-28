"use client"

import Image from "next/image";
import { SpecialColumnContent } from "@/app/_components/special-column/SpecialColumnContent";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { check } from "drizzle-orm/mysql-core";
import Reserved from "@/app/_components/dialog/dialog/reserved"

const Page = () => {
    const params = useSearchParams();
    const columnId = params.get("id");

    // 获取所有文章
    const read = api.post.getAll.useQuery({
        columnId: columnId,
        limit: 10000,
        offset: 0,
    });

    const userid = api.column.getUserId.useQuery({
        id: columnId,
    })

    const user = api.users.getOne.useQuery({
        id: userid.data,
    })

    const column = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    })

    const [subscribe, setSubscribe] = useState(false);
    const Click = () => {
            setSubscribe(!subscribe);
    }

    return(
    <div className={"w-full bg-[#F5F7FB] relative"}>
        {/*顶部*/}
        {/*<div className={"flex w-100% h-22 shrink-0 bg-[#D9D9D9] absolute top-0 z-2"}>*/}
        {/*    /!*<div className={"w-6 h-6 shrink-0 text-center text-2xl mt-12 ml-4 lh-6"}>*!/*/}
        {/*    /!*    ×*!/*/}
        {/*    /!*</div>*!/*/}
        {/*    /!*<div className={"inline-block text-[#252525] text-5 font-not-italic font-500 lh-6 text-center mx-auto mt-12"}>*!/*/}
        {/*    /!*    心智与阅读*!/*/}
        {/*    /!*</div>*!/*/}
        {/*</div>*/}

        <div className={"w-full absolute top-0 z-2 "}>
            <div className={"flex justify-end items-center mt-16px"}>
                <div className={"inline-block w-14.25 h-6 text-[#252525] shrink-0 bg-#5CE5C1 text-2.5 font-500 lh-6 text-center rounded-10px"}>加速计划</div>
                <div className={"inline-block ml-10px mr-16px"}>
                    <Image src={"/images/special-column/Share-two (分享2).png"} alt={"分享"} width={12} height={12} />
                </div>
            </div>
            <div className={"flex mb--50px mt-10px w-full"}>
                <div className={"ml-20px mt--10px w-30%"}>
                    <Image src={"/images/special-column/Mask group.png"} alt={"心智与阅读"} width={140} height={160} style={{ width: "100%" }} />
                </div>
                <div className={"flex flex-col ml-10px space-y-0 "}>
                    <div className={"text-[#FFF] text-4.5 font-not-italic font-500 lh-6"}>
                        {column.data?.name}
                    </div>
                    <div className={"w-98% text-[#F2F2F2] text-3.5 font-not-italic font-400 lh-[120%] pt-5px"}>{column.data?.description}</div>
                    <div className={"flex pt-8px "}>
                        <Image src={user.data?.avatar} alt={"心智与阅读"} width={18} height={18} />
                        <div className={"text-[#DFDFDF] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>
                            {user.data?.name}
                        </div>
                        <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{ objectFit: "none", marginLeft: "5px" }} />
                    </div>
                </div>
            </div>
            <div>

                {/*下方白色内容*/}
                <div className={" w-full  bg-#fff rounded-t-30px lh-6 mt-20px"}>

                    {/*订阅栏*/}
                    <div className={"ml-37.8% text-[#999] text-3 font-not-italic font-400 lh-6 pt-10px"}>
                        <span className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6 mr-5px"}>1090</span>
                        订阅
                        <span className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6 mr-5px ml-20px"}>{read.data?.length}</span>
                        内容
                    </div>

                    {/*介绍，内容*/}
                    <SpecialColumnContent></SpecialColumnContent>

                    {/*按钮*/}
                    <button className={"w-91% h-40px shrink-0 border-rd-11.25 bg-[#5CE5C1] ml-16px mt-17px mb-36px text-center lh-40px text-[#252525] text-4.5 font-not-italic font-500"} onClick={Click}>
                        订阅
                    </button>
                    <div className="fixed top-200px p-auto">
                        {subscribe && <Reserved onClose={() => setSubscribe(false)}></Reserved>}
                    </div>
                </div>
            </div>

        </div>
        <div className={"w-full absolute top-0 z-1 filter blur-sm"}>
            <Image src={"/images/special-column/Cardpc.png"} alt={"bg"} width={375} height={74.5} style={{ width: "100%" }} />
            <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
    </div>
    )
}

export default Page;

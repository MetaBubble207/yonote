"use client"
import { api } from "@/trpc/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
export const SpecialColumnIntroduce = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const column = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    }).data

    const router = useRouter();
    // 点赞
    const [isHeartFilled, setIsHeartFilled] = useState(false);

    const handleClick = () => {
        setIsHeartFilled(!isHeartFilled);
    };

    return (
        <div className={"w-91.5% mt-20px ml-16px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] px-10px ws-normal break-all"} >
            {/*上方文字*/}
            {/* <div onClick={() => router.push('/special-column/content')}>
                <p className={"text-[#252525] text-3.75 font-not-italic font-500 lh-6 text-3.75 pt-16.5px"}>「开播的第3年，P人沉浸于J人的世界时间我是乱打的」</p>
                <p className={"text-[#666]  text-3.25 font-not-italic font-400 lh-[120%] pt-5px"}> </p>
            </div> */}
            {/*下方图标*/}
            {/* <div className="flex mt-18px items-center space-y-0 mb-22px"> */}

                {/*左边头像*/}
                {/* <div className={""}>
                    <div>
                        <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={23} height={23} />
                    </div>
                </div> */}
                {/*昵称，日期，VIP*/}
                {/* <div>
                    <div className={"flex items-center"}>
                        <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                        <div>
                            <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{ marginLeft: "2.5px" }} />
                        </div>
                    </div>
                    <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>03-01发布</div>

                </div> */}

                {/*右方点赞数量*/}
                {/* <div className="ml-auto flex items-center space-y-0">
                    <div>
                        <Image
                            src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 2.png"}
                            onClick={handleClick}
                            alt={"爱心"} width={18} height={18} objectFit="none" />
                    </div>
                    <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                </div> */}
                {/*右方浏览数量*/}
                {/* <div className="ml-24px flex items-center space-y-0">
                    <div>
                        <Image src={"/images/special-column/Preview-open (预览-打开).png"} alt={"爱心"} width={18} height={18} objectFit="none" />
                    </div>
                    <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                </div>
            </div> */}
            {column?.introduce?column.introduce:"暂无数据"}     
        </div>
    )
}

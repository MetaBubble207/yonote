"use client"
import Image from "next/image";
import React, { useState } from 'react'
import {useRouter} from "next/navigation";

export const SpecialColumnContentBottom = () => {
    // 路由
    const router = useRouter();
    // 点赞
    const [isHeartFilled, setIsHeartFilled] = useState(false);

    const handleClick = () => {
        setIsHeartFilled(!isHeartFilled);
    };
    return(
        <div>
            <div className={"absolute w-100% h-140px bottom-0px bg-[#FFF]"}>

                {/*标签*/}
                <div className="flex justify-between mt--40px mx-16px">
                    <div className="flex flex-col">
                        <div className={"text-[#1DB48D] text-3 font-not-italic font-400 lh-6"}># 标签在这</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="ml-24px flex items-center space-y-0">
                            <div>
                                <Image src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 2.png"} onClick={handleClick}
                                       alt={"爱心"} width={18} height={18} objectFit="none"/>
                            </div>
                            <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1090</div>
                        </div>
                    </div>
                </div>

                <div className={"mx-16px"}>

                    {/*目录*/}
                    <div className={"flex items-center mt-30px"}>
                        <div className={"text-[#666] text-2.5 font-not-italic font-400 lh-14px"}>心智与阅读•目录</div>
                        <div className={"ml-5px"}>
                            <Image src={"/images/special-column/Sort-one (排序1).png"} alt={"心智与阅读"} width={14} height={14}/>
                        </div>
                    </div>

                    {/*上一篇下一篇*/}
                    <div className="flex mt-8px">
                        <div className="flex flex-col">
                            <div className={"flex items-center"}>
                                <div>
                                    <Image src={"/images/special-column/Double-left (双左).png"} alt={"心智与阅读"} width={14} height={14}/>
                                </div>
                                <div className={"text-[#333] text-3 font-not-italic font-400 lh-6 ml-5px"} onClick={() => router.push('/special-column/answer')}>上一篇</div>
                            </div>
                            <div className={"w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6"}>回忆·后来的我们毕业了</div>
                        </div>
                        <div className="flex flex-col ml-auto ">
                            <div className={"flex items-center justify-end"}>
                                <div className={"text-[#333] text-3 font-not-italic font-400 lh-6 "} onClick={() => router.push('/special-column/answer')}>下一篇</div>
                                <div>
                                    <Image src={"/images/special-column/Double-left (双右) .png"} alt={"心智与阅读"} width={14} height={14}/>
                                </div>
                            </div>
                            <div className={"w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6 text-right"}>回忆·后来的我们毕业了</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
"use client"
// page.tsx
import { api } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useLocalStorage from "@/tools/useStore";
import DisplayDetailed from "@/app/_components/user/DisplayDetailed";

function User() {
    let userInfo
    const [token] = useLocalStorage("token", null)
    if (token) {
        userInfo = api.users.getOne.useQuery({id: token}).data
    }
    const ColumnInfo = api.column.getAllByUserId.useQuery({userId:userInfo?.id }).data





    return (
        <div>
            {/*顶部*/}

            {/*背景图片*/}
            <div className="blur-24 relative h-28.25 w-full overflow-hidden">
                {/*<img src={ImageURL} className="absolute inset-0 object-cover w-full h-full"/>*/}
                {/*<Image src={'/images/user/avatar.svg'} alt={"头像"} width={124} height={124}*/}
                {/*       className={"absolute inset-0 object-cover w-full h-full"}/>*/}
                <Image src={userInfo?.avatar} alt={"头像"} width={124} height={124}
                       className={"absolute inset-0 object-cover w-full h-full"}/>
            </div>

            {/*空白区域*/}
            {/*<DisplayDetailed token={token} userInfo={userInfo}></DisplayDetailed>*/}
            <div className={"w-93.75 h-152.75 border-rd-[10px_10px_0px_0px] bg-[#FFF] relative flex justify-center "}>
                {/*用户信息*/}
                <div className={"absolute top--10.375 mb-10.375 w-31 h-31 flex flex-col justify-center items-center"}>

                    {/*头像*/}
                    {/*<Image src={'/images/user/avatar.svg'} alt={"头像"} width={83} height={83}*/}
                    {/*       className={"w-20.75 h-20.75"}/>*/}
                    <Image src={userInfo?.avatar} alt={"头像"} width={83} height={83}
                           className={"w-20.75 h-20.75 rounded-full"}/>

                    {/* 用户名 */}
                    <div className={"flex mt-1.25 items-center"}>
                        <h2 className={" text-[#252525] text-4.5 font-500 lh-6"}>
                            <div>
                                <p>{userInfo?.name}</p>
                            </div>
                        </h2>
                        <Image className={"ml-1.25 w-5 h-5"} src={"/images/user/Rank.svg"} alt={"rank"} width={20}
                               height={20}/>
                    </div>

                    {/* ID */}
                    <div className={"flex w-16.039 h-6 items-center justify-center"}>
                        {/*<div className={"flex w-3.75"}>*/}
                        {/*    <Image className={"w-1.4775 h-1.86"} src={"/images/user/I_logo.svg"} alt={"I"} width={7.44}*/}
                        {/*           height={7.44}/>*/}
                        {/*    <Image className={"w-1.4775 h-1.86"} src={"/images/user/D_logo.svg"} alt={"D"} width={7.44}*/}
                        {/*           height={7.44}/>*/}
                        {/*</div>*/}
                        <span className={"ml-  text-[#999] text-2.5 font-400 lh-6 flex items-center"}>
                            <div className={"flex w-3.75"}>
                            <Image className={"w-1.4775 h-1.86"} src={"/images/user/I_logo.svg"} alt={"I"} width={7.44}
                                   height={7.44}/>
                            <Image className={"w-1.4775 h-1.86"} src={"/images/user/D_logo.svg"} alt={"D"} width={7.44}
                                   height={7.44}/>
                        </div>
                            {userInfo?.idNumber}</span>
                    </div>
                </div>


                {/*数据展示、导航和内容*/}
                <div className={'w-full'}>
                    <DisplayDetailed token={token} userInfo={userInfo}></DisplayDetailed>
                    {/*/!* 订阅数量展示 *!/*/}
                    {/*<div className={"mt-24.5 w-full flex justify-center"}>*/}
                    {/*    <div className={"flex flex-col items-center "}>*/}
                    {/*        <p className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6"}>1090</p>*/}
                    {/*        <h2 className={"w-6.5 h-4.75 shrink-0 text-[#999] text-3 font-400 lh-6"}>订阅</h2>*/}
                    {/*    </div>*/}
                    {/*    <div className={"flex flex-col items-center ml-14"}>*/}
                    {/*        <p className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6"}>1090</p>*/}
                    {/*        <h2 className={"w-6.5 h-4.75 shrink-0 text-[#999] text-3 font-400 lh-6"}>专栏</h2>*/}
                    {/*    </div>*/}
                    {/*    <div className={"flex flex-col items-center ml-14"}>*/}
                    {/*        <p className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6"}>1090</p>*/}
                    {/*        <h2 className={"w-6.5 h-4.75 shrink-0 text-[#999] text-3 font-400 lh-6"}>内容</h2>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    {/*/!* 专栏、小课区域 *!/*/}
                    {/*<div className="w-85.75 h-63.75 border-rd-2.5 bg-#FFF ml-4 pl-4 pt-4 mt-4">*/}

                    {/*    /!* 导航区域 *!/*/}
                    {/*    <div className="flex">*/}
                    {/*        <Link href="#"*/}
                    {/*              className="w-7 h-6 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6">更新</Link>*/}

                    {/*        <Link href="#"*/}
                    {/*              className="w-7 h-6 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6">专栏</Link>*/}
                    {/*        <div className={"flex-col"}>*/}
                    {/*            <Link href="#"*/}
                    {/*                  className="text-[#252525] text-3.5 font-500 lh-6">小课</Link>*/}
                    {/*            <div className={"ml-2.25 mt-1 w-2.75 h-1 border-rd-2 bg-[#45E1B8]"}></div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    /!* 内容区域 *!/*/}
                    {/*    <div>*/}
                    {/*        <div className="flex h-14 mt-6">*/}
                    {/*            <Image src="/images/user/cover.svg" alt="icon" width={14} height={14}*/}
                    {/*                   className="w-15.5 h-19"/>*/}
                    {/*            <div>*/}
                    {/*                <h2 className={"ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"}>「心智与阅读」</h2>*/}
                    {/*                <p className={"w-59.25 text-[#666] font-\"Source Han Sans SC\" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex h-14 mt-8">*/}
                    {/*            <Image src="/images/user/cover.svg" alt="icon" width={14} height={14}*/}
                    {/*                   className="w-15.5 h-19"/>*/}
                    {/*            <div>*/}
                    {/*                <h2 className={"ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"}>「心智与阅读」</h2>*/}
                    {/*                <p className={"w-59.25 text-[#666] font-\"Source Han Sans SC\" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    {/*更多优质内容*/}
                    <div className={"flex justify-center mt-18"}>
                        <div className={"w-26 h-7 pl-3.44 shrink-0 border-rd-9 bg-[#DAF9F1]"}>
                            <Link href="../find"
                                  className={"w-19.12225 h-6.25 shrink-0 text-[#1DB48D] text-3 font-500 lh-6"}>更多优质内容</Link>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    )
}


export default User;

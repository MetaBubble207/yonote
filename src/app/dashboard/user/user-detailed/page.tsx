"use client"
import {api} from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useLocalStorage from "@/tools/useStore";
import DisplayDetailed from "@/app/_components/user/DisplayDetailed";
import Loading from "@/app/_components/common/Loading";
import Error from "@/app/_components/common/Error";

function User() {
    const [token] = useLocalStorage("token", null)
    const {data: userInfo, isLoading, isError} =
        api.users.getOne.useQuery({id: token});
    if (isLoading) return <Loading/>
    if (isError) return <Error text={'数据加载错误'}/>
    return (
        <div>
            <div className="blur-24 h-28.25 w-full relative">
                <Image src={userInfo?.avatar} alt={"头像"}
                       layout="fill"
                       objectFit="cover"
                       objectPosition="50% 50%"/>
            </div>
            <div
                className={"w-93.75 h-152.75 border-rd-[10px_10px_0px_0px] bg-[#FFF] relative flex justify-center "}>
                {/*用户信息*/}
                <div className={"absolute top--10 mb-10 w-31 h-31 flex flex-col justify-center items-center"}>
                    <Image src={userInfo?.avatar} alt={"头像"} width={83} height={83} className={"rounded-full"}/>
                    {/* 用户名 */}
                    <div className={"flex mt-1.25 items-center"}>
                        <div className={" text-[#252525] text-4.5 font-500 lh-6"}>{userInfo?.name}</div>
                        <Image className={"ml-1.25"} src={"/images/user/Rank.svg"} alt={"rank"} width={20}
                               height={20}/>
                    </div>
                    {/* ID */}
                    <div className={"flex justify-center text-[#999] text-2.5 font-400 lh-6"}>
                        <div className={"flex w-3.75"}>
                            <Image src={"/images/user/I_logo.svg"} alt={"I"}
                                   width={6}
                                   height={6}/>
                            <Image src={"/images/user/D_logo.svg"} alt={"D"}
                                   width={10}
                                   height={7}/>
                        </div>
                        <div className={"ml-1"}>{userInfo?.idNumber}</div>
                    </div>
                </div>
                {/*数据展示、导航和内容*/}
                <div className={'w-full'}>
                    <div className={"mt-26"}>
                        <DisplayDetailed token={token} userInfo={userInfo}></DisplayDetailed>
                    </div>
                    {/*更多优质内容*/}
                    <div className={"w-full flex justify-center items-center"}>
                        <div className={"flex justify-center mt-8 w-26 h-7 bg-[#daf9f1]"}>
                            <Link href="../find"
                                  className={" text-[#1DB48D] text-3 font-500 lh-6"}>更多优质内容</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default User;

"use client"
import {api} from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useLocalStorage from "@/tools/useStore";
import DisplayDetailed from "@/app/_components/dashboard/user/DisplayDetailed";
import Loading from "@/app/_components/common/Loading";
import Error from "@/app/_components/common/Error";
import {useSearchParams} from "next/navigation";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import withTheme from "@/theme";

const Detail = function () {
    const [token] = useLocalStorage("token", null);
    const params = useSearchParams()
    const {data: userInfo, isLoading, isError} =
        api.users.getOne.useQuery({id: params.get('id')});
    if (isLoading) return <Loading/>
    if (isError) return <Error text={'没有找到该用户的信息😯~'}/>
    return (
        <div>
            <div className="relative h-28.25 w-full blur-24">
                <Image
                    placeholder="blur"
                    blurDataURL={DefaultLoadingPicture()}
                    src={userInfo?.avatar ?? DefaultLoadingPicture()}
                    alt={"cover"}
                    fill
                    loading='lazy'
                    quality={100}
                    className=" rounded-2 object-cover">
                </Image>
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
                <div className={'w-full flex flex-col h-full'}>
                    <div className={"mt-26  flex-1"}>
                        <DisplayDetailed token={token} userInfo={userInfo}></DisplayDetailed>
                    </div>
                    {/*更多优质内容*/}
                    <div className={"w-full flex justify-center items-center sticky pb-9"}>
                        <div className={"flex justify-center w-26 h-7 bg-[#daf9f1] rounded-full"}>
                            <Link href="/dashboard/find"
                                  className={" text-[#1DB48D] text-3 font-500 lh-6"}>更多优质内容</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Page = () => {
    return withTheme(<Detail/>)
}

export default Page;

"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useLocalStorage from "@/tools/useStore";
import {useRouter, useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import {Button} from "antd";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const UserTop = () => {
    let userInfo;
    const [token, setToken] = useLocalStorage("token", null);
    const router = useRouter();
    const searchParams = useSearchParams();
    //这个地址是提前给微信登录接口重定向，默认微信那边会传回code和state两个query参数，通过useSearchParams可以拿到
    const code = searchParams.get("code");
    if (code && token === null) {
        userInfo = api.users.login.useQuery({
            code: code,
        }).data;
        if (userInfo) {
            setToken(userInfo.id);
        }
    }
    if (token) {
        userInfo = api.users.getOne.useQuery({id: token}).data;
    }
    return (
        <div className="pt-9 flex flex-row items-center">
            {token ? (
                <div className="relative w-20.75 h-20.75">
                    <Image
                        placeholder="blur"
                        blurDataURL={DefaultLoadingPicture()}
                        src={userInfo?.avatar ?? "/images/user/Loading.svg"}
                        alt='cover'
                        quality={100}
                        fill
                        loading='lazy'
                        className='rounded-full object-cover '
                    />
                </div>
            ) : (
                <Image
                    src={"/images/user/NotLoggedIn.svg"}
                    alt="avatar"
                    width={83}
                    height={83}
                    className={"rounded-full"}
                    onClick={() => router.push("/login")}
                />
            )}

            {/* 用户信息 */}
            <div className="ml-3 flex-1">
                <div className="flex align-center">
                    <h1 className=" text-[#252525] text-3 font-500 lh-6">
                        {token ? userInfo?.name : "请点击头像登录"}
                    </h1>
                    <Image
                        src="/images/user/Rank.svg"
                        alt="group"
                        width={20}
                        height={20}
                        className="ml-2"
                    />
                </div>
                <div className="flex items-center">
                    <div className="logo flex w-3.5 h-3.5 items-center">
                        <Image
                            src="/images/user/I_logo.svg"
                            alt="group"
                            width={7.44}
                            height={7.44}
                            className="w-1.4775 h-1.86 shrink-0 fill-#666"
                        />
                        <Image
                            src="/images/user/D_logo.svg"
                            alt="group"
                            width={7.44}
                            height={7.44}
                            className="w-1.4775 h-1.86 shrink-0 fill-#666"
                        />
                    </div>
                    <span
                        className="ml-1 w-18 text-[#999] font-Source Han Sans SC text-2.5 font-not-italic font-400 lh-6 items-center">
                {userInfo?.idNumber}
              </span>
                </div>
            </div>

            {/* 编辑资料 */}
            <Button
                className="w-20 text-[#252525] text-2.5 font-500 lh-6 rounded-full mr-4 flex flex-row bg-white pl-2.5 items-center ">
                <Image
                    src="/images/user/icon_edit.png"
                    alt="icon"
                    width={16}
                    height={16}
                />
                <Link href="user/message">编辑资料</Link>
            </Button>
        </div>
    )
}

export default UserTop;
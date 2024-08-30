"use client"
import React from "react";
import Image from "next/image";
import process from "process";
import {useRouter, useSearchParams} from "next/navigation";

const Login = () => {
    const router = useRouter();
    let originPathname = useSearchParams().get("origin");
    console.log(originPathname)
    let checked = false;
    const handleCancel = () => {
        router.back();
    };

    const handleLogin = () => {
        if (checked && typeof window !== "undefined") {
            const appid = process.env.NEXT_PUBLIC_APP_ID;

            if (originPathname === null) {
                originPathname = "/dashboard/user";
            }
            const originURL = window?.location?.origin;

            const redirect_uri = encodeURIComponent(originURL + originPathname);
            // 跳转到微信认证中心
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&forcePopup=true&state=STATE#wechat_redirect`;
        } else {
            alert("请先勾选同意!");
        }
    };


    return (
        <div>
            <div className="flex justify-center items-center mt-46">
                <Image
                    src={"/images/cover.svg"}
                    alt={"cover"}
                    width={41}
                    height={45}
                ></Image>
                <div className="ml-10px">
                    <div className={"shrink-0 font-size-5.25 "}>有记</div>
                    <div className="shrink-0 font-size-2">YoNote</div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-23.5">
                <button
                    className="w-72.25 h-11.5 shrink-0 border-rd-10 bg-[#45E1B8] font-size-3.5"
                    onClick={handleLogin}
                >
                    微信登录
                </button>
                <button
                    className="w-72.25 h-11.5 shrink-0  border-rd-10 border bg-[#fffdfc] mt-3.75 font-size-3.5"
                    onClick={handleCancel}
                >
                    取消
                </button>
                <div className="flex w-67.75 h-6 mt-8.5575 text-3">
                    <input
                        type="checkbox"
                        onChange={(e) => checked = e.target.checked}
                        className="w-5 h-5"
                    />
                    <div className="ml-1.5">我已阅读并同意《用户协议》和《隐私协议》</div>
                </div>
            </div>
        </div>
    );
};
export default Login;

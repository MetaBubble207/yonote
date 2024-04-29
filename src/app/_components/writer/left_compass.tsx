"use client"

import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const LeftCompass=()=>{

    // const router = useRouter();

    // // 检查是否在客户端环境中
    // if (typeof window === 'undefined') {
    //     return null; // 在服务器端渲染时返回空，避免使用路由钩子
    // }

    return(
        <div>
            <div className="fixed top-17.5 w-64.77925 h-screen shrink-0 bg-[#FFF] z-100">
                <div className="w-65.25 h-72.4785 shrink-0 flex items-center flex-col pt-4.27">
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#DAF9F1] flex">
                        <Image src={"/images/writer/edit/Monitor1.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <a href="../writer/homepage" className="w-14 h-6.00625 shrink-0 text-[#4CC5A6] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">主页看板</a>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/edit/Rocket2.svg"} alt="Monitor1" width={24} height={24.03} className={`w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89 `}></Image>
                        <a href="../writer/content-management" className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6ml-2.07 mt-2.89">内容管理</a>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/edit/Rocket3.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <a href="../writer/subscribe-manage" className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">订阅管理</a>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/edit/Rocket4.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <a href="../writer/column-settings" className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">专栏设置</a>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/edit/Rocket5.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <a href="../writer/co-author" className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5  font-400 lh-6 ml-2.07 mt-2.89">共创作者</a>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/edit/Rocket6.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <a href="../writer/speed-up" className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">加速计划</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftCompass;

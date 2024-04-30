"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Column from "./column";

const LeftCompass = () => {
    const pathname = usePathname();
    const [column, setColumn] = useState(pathname === '/writer/homepage');

    useEffect(() => {
        setColumn(pathname === '/writer/homepage');
    }, [pathname]);

    return (
        <div>
            <div className="fixed top-17.5 w-64.77925 h-screen shrink-0 bg-[#FFF] z-100">
                <div className="w-65.25 h-72.4785 shrink-0 flex items-center flex-col pt-4.27">
                    {column && <Column />}
                    <div className={`w-65.25 h-12.4705 shrink-0 flex mt-35px ${pathname === '/writer/homepage' ? 'text-[#4CC5A6] bg-[#DAF9F1] ' : 'text-[#999] bg-[#FFF]'}`} >
                        <Image src={"/images/writer/edit/Monitor1.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <Link href="/writer/homepage" passHref>
                            <div className="w-14 h-6.00625 shrink-0 text-3.5 font-400 lh-6 ml-2.07 mt-2.89">主页看板</div>
                        </Link>
                    </div>
                    <div className={`w-65.25 h-12.4705 shrink-0 flex ${pathname === '/writer/content-management' ? 'text-[#4CC5A6] bg-[#DAF9F1] ' : 'text-[#999] bg-[#FFF]'}`}>
                        <Image src={"/images/writer/edit/Rocket2.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89 "></Image>
                        <Link href="/writer/content-management" passHref>
                            <div className="w-14 h-6.00625 shrink-0 text-3.5 font-400 lh-6 ml-2.07 mt-2.89">内容管理</div>
                        </Link>
                    </div>
                    <div className={`w-65.25 h-12.4705 shrink-0 flex ${pathname === '/writer/subscribe-manage' ? 'text-[#4CC5A6] bg-[#DAF9F1] ' : 'text-[#999] bg-[#FFF]'}`}>
                        <Image src={"/images/writer/edit/Rocket3.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <Link href="/writer/subscribe-manage" passHref>
                            <div className="w-14 h-6.00625 shrink-0 text-3.5 font-400 lh-6 ml-2.07 mt-2.89">订阅管理</div>
                        </Link>
                    </div>
                    <div className={`w-65.25 h-12.4705 shrink-0 flex ${pathname === '/writer/column-settings' ? 'text-[#4CC5A6] bg-[#DAF9F1] ' : 'text-[#999] bg-[#FFF]'}`}>
                        <Image src={"/images/writer/edit/Rocket4.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <Link href="/writer/column-settings" passHref>
                            <div className="w-14 h-6.00625 shrink-0 text-3.5 font-400 lh-6 ml-2.07 mt-2.89">专栏设置</div>
                        </Link>
                    </div>
                    <div className={`w-65.25 h-12.4705 shrink-0 flex ${pathname === '/writer/co-author' ? 'text-[#4CC5A6] bg-[#DAF9F1] ' : 'text-[#999] bg-[#FFF]'}`}>
                        <Image src={"/images/writer/edit/Rocket5.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <Link href="/writer/co-author" passHref>
                            <div className="w-14 h-6.00625 shrink-0 text-3.5  font-400 lh-6 ml-2.07 mt-2.89">共创作者</div>
                        </Link>
                    </div>
                    <div className={`w-65.25 h-12.4705 shrink-0 flex ${pathname === '/writer/speed-up' ? 'text-[#4CC5A6] bg-[#DAF9F1] ' : 'text-[#999] bg-[#FFF]'}`}>
                        <Image src={"/images/writer/edit/Rocket6.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <Link href="/writer/speed-up" passHref>
                            <div className="w-14 h-6.00625 shrink-0 text-3.5 font-400 lh-6 ml-2.07 mt-2.89">加速计划</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftCompass;

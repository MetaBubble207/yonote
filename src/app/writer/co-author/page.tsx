import React from "react";
import Image from "next/image";
import Link from "next/link";

const Page = () =>{
    return <div className="relative mt-16px ml-18px">
        <div className="pt-8 w-full h-203.5 border-rd-[0px_0px_10px_10px] bg-[#FFF] ">
            <div className="ml-8.5 text-[#323232] text-4 font-700 lh-6">共创会员</div>

            <div className="flex mt-8.25 w-full h-8 items-center">
                <div className=" ml-8.5 flex justify-center items-center w-8 h-8 border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1DB48D] text-3.5 font-400 lh-5.5">09</div>
                <div className="ml-1 w-1.442 text-[#1DB48D] text-3.5 font-400 lh-5.5">:</div>
                <div className=" ml-1 flex justify-center items-center w-8 h-8 border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1DB48D] text-3.5 font-400 lh-5.5">09</div>
                <div className="ml-1 w-1.442 text-[#1DB48D] text-3.5 font-400 lh-5.5">:</div>
                <div className=" ml-1 flex justify-center items-center w-8 h-8 border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1DB48D] text-3.5 font-400 lh-5.5">09</div>
                <div className="ml-2.7 flex justify-center items-center text-[rgba(0,0,0,0.65)] font-Abel text-3.5 font-400 lh-5.5">到期时间：2017-10-31  24:15:00</div>
                <Link target='_blank' href={"https://work.weixin.qq.com/kfid/kfc3048f784babcb1cc"} >
                    <div className="w-14.82325 text-[#1DB48D] font-Abel text-3 font-400 lh-5.5 ml-4.5">延长权益</div>
                </Link>
            </div>

            <Image src={"/images/writer/co-author/painting.svg"} alt={"painting"} width={20} height={20} className="ml-82.5 mt-20.85 w-128.82325 h-95.48875"/>
            <div className="mt-16.75 ml-112 w-63.3 text-[rgba(0,0,0,0.65)] font-Abel text-4 font-400 lh-5.5">更多功能和权益开发中-
                <Link target='_blank' href={"https://eahu7fmu6k6.feishu.cn/wiki/S4elwZgXgig8HTkS9nCcAhd7nwb"} >
                    <div className="inline">查看权益</div>
                </Link>
            </div>
        </div>
    </div>
}

export default Page;

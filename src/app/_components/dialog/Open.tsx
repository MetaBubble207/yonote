import React from "react";
import Image from "next/image";

const Open =()=>{
    let discount = "20%"
    return(
        <div className="flex flex-col items-center justify-center"> 
            <div className="w-9.5   text-3.75 font-not-italic font-500 lh-6">
                分享
            </div>
            <div className="w-65.5 text-[#E16C57] text-4.5 font-500 lh-6 mt-6">
                【专栏名称】已开启-加速计划
            </div>
            <div className="mt-4 text-center font-700  w-81.75 h-15.25 shrink-0">
            分享海报与链接助力创作者，成交后您可以获得当前作品价格的 <span className="text-[#E16C57]"> {discount}</span>作为加速激励
            </div>
            <button className="mt-6.75">
                <Image src={"/images/dialog/haibao.png"} alt={"haibao"} width={343} height={40} className="w-85.75 h-10"></Image>
            </button>
            <button className="mt-4">
                <Image src={"/images/dialog/link.png"} alt={"haibao"} width={343} height={40} className="w-85.75 h-10"></Image>
            </button>

        </div>
    );
}

export default Open;
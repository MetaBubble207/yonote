import React from "react";
import Image from "next/image";
import { Article } from "@/app/_components/poster/Article";

const Page =()=>{
    return <div className="relative min-h-screen ">
        <div className="w-85.75 h-129.5005 bg-[#ffffff]">
            <div className="flex">                 
                <div>                
                    <div className="flex items-center w-full h-19.375">
                        <Image src={"/images/poster/icon.svg"} alt="icon" width={49} height={49} className=" w-12.25 h-12.25 shrink-0 ml-5.25 mt-7.125"/>                
                        <div className="flex flex-col h-20">
                            <div className="text-[#333333] text-3.5 font-500 lh-6 h-5 ml-2.25 mt-8 ">
                                芋圆
                            </div>
                            <div className="flex items-center ml-2.25">
                                <div className="text-[#252525] font-D-DIN text-3.5 font-700 lh-6">1090</div>
                                <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25">内容</div>

                                <div className="text-[#252525] font-D-DIN text-3.5 font-700 lh-6 ml-1">1090</div>
                                <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25">内容</div>
                            </div>
                        </div>           
                    </div>              
                </div>
                <Image src={"/images/poster/wholeLogo.svg"} alt="wholeLogo" width={2} height={2} className="w-9.5 h-4.29725 mt-7 ml-11" ></Image>      
            </div>
            
            <div className="w-46.11175 h-5.387 text-[#333] text-3.5 font-500 lh-6 mt-9 ml-4.5">
                专栏字数少那就剧中排一排？
            </div>

            <div className="mt-4 ml-4.5">
                <Article/>
            </div>

            <div className="flex h-40 ml-4.375 mt-14">
                <div className="w-40 mt-2">
                    <button className="flex items-center w-20 h-3">
                        <Image src={"/images/poster/triangle.svg"} alt="triangle" width={2} height={2} className="w-2.58125 h-2.58125 "/>
                        <div className="h-5.7 text-[#666] text-2.5 font-500 lh-6 ml-1.5">保存到相册</div>
                    </button>
                    <div className="flex items-center mt-3.5">
                        <Image src={"/images/poster/icon2.svg"} alt="icon2" width={2} height={2} className="w-4.5 h-4.5"/>
                        <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6 ml-1.25">汤圆</div>
                    </div>
                    <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6">
                        分享了分享了一篇专栏
                    </div>
                </div>
                <div className="w-20 ml-25">
                    <Image src={"/images/poster/QRcode.svg"} alt="QRcode" width={2} height={2} className="w-12.5 h-12.5 ml-1.5"/>
                    <div className="h-5.75 text-[#999] text-2.5 font-400 lh-6 mt-1.25">扫码查看详情</div>
                </div>
            </div>
            
            

        </div>
    </div>
};
export default Page;
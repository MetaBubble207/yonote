import React from "react";
import Image from "next/image";


const Page =()=>{
    return <div className="relative min-h-screen bg-[#606062]">
        <Image src={"/images/poster/bg.svg"} alt={"bg"} width={343} height={425} className="mt-33.5 ml-4 w-85.75 h-106.277 absolute z-0 " />
        


        <div className="mt-33.5 ml-4 w-85.75 h-106.277 absolute z-1">                
            <div className="flex items-center w-full h-19.375">
                <Image src={"/images/poster/icon.svg"} alt="icon" width={49} height={49} className=" w-12.25 h-12.25 shrink-0 ml-5.25 mt-7.125"/>                
                <div className="flex flex-col ">
                    <div className="text-[#999] text-2.5 font-500 lh-6 h-5 ml-1.2 mt-8.25 ">
                        芋圆
                    </div>
                    <div className="flex  items-center">
                        <div className="text-[#252525] text-2.75 font-400 lh-6 ml-0.75 mt-0.5">
                                1090 订阅
                        </div>
                        <div className="text-[#252525] text-2.75 font-400 lh-6 ml-3  mt-0.5">
                                1090 内容
                        </div>
                    </div>
                </div>           
            </div>

            <div className="flex items-center mt-2.3 m-auto w-72.8115 h-5.75 border-rd-1.25 bg-[#F5F7FB]">
                <div className="m-auto w-59.1765 h-5.25 shrink-0 text-[#333]  text-2.5 font-not-italic font-500 lh-6 ">
                「开播的第3年，P人沉浸于J人的世界」
                </div>
            </div>

            <div className="flex pt-3 ">
                <Image src={"/images/poster/picture.svg"} alt={'picture'} width={175} height={228} className="w-43.9705 h-57.10625 ml-5.2"/>
                <div className="ml-3 w-28.06 h-57.10625 shrink-0 text-[#666] text-2.5 font-500 lh-6 ">
                    公司简介的用语应该科学简明，语句要尽量简短，要避免包括四个以上逗号的长句式。 不同类别的信息表达，尽可能单独成句，否则就会出现长达一段的长句，给阅读造成困难，甚至抓不住重点，影响简介的功能发。
                </div>
            </div>
    
            <div className="flex relative items-center mt-5 w-85.75">
                    <Image src={"/images/poster/logo.svg"} alt={"logo"} width={26} height={26} className="w-6.5715 h-7.25 ml-5.25"/>
                    <div className="ml-1 w-15.25 h-6 h-6 shrink-0 text-[#50888D]  text-2.5 font-400 lh-6 ">
                        扫码查看
                    </div>
                    <Image src={'/images/poster/QRcode.svg'} alt={"QRcode"} width={45} height={45} className="w-11.25 h-11.25 ml-37.5"/>
                </div>


       
        </div> 
            


        
        
        
        





    </div>
   
        
    
}

export default Page;
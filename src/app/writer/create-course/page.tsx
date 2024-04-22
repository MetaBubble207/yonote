import React from "react";
import Image from "next/image";

const Page =()=>{
    return <div className="relative w-286.75 h-195 border-rd-[0px_0px_10px_10px] bg-[#FFF]" >
        <div className="text-[#323232]  text-4 font-700 lh-6 mt-25.75 ml-53.75 w-16 ">小课创建</div>

        <div className="flex items-center w-full h-8 mt-6 ">
            <div className="text-[rgba(0,0,0,0.85)] text-3.5 font-400 lh-5.5 w-10.5  ml-81.25 ">名称：</div>
            <div className="inline items-ceter w-117 h-8 border-rd-1 border-2 border-solid mt-78 mb-78">
                <input type="" name="" id="" placeholder="起个名字" className=" outline-none text-[rgba(0,0,0,0.25)] text-3.5 font-400 lh-5.5 ml-3" ></input>
            </div>          
        </div>

        <div className="flex items-center w-full h-8 mt-6">      
            <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ml-53">专栏ID</div>   
            <div className="text-[rgba(0,0,0,0.25)] text-right text-3.5 font-400 lh-5.5 ">（英文或数字）</div> 
            <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ">：</div>   
            <div className="flex items-ceter w-117 h-8 border-rd-1 border-2 border-solid mt-78 mb-78">
                <input type="" name="" id="" placeholder="请输入你的专属ID" className="justify-center outline-none text-[rgba(0,0,0,0.25)] text-3.5 font-400 lh-5.5 ml-3" ></input>
            </div> 
        </div>
        <div className="flex">
            <div className="text-[red] text-3 font-400 lh-5.5 ml-91.5 mt-4 h-5.5">*</div>
            <div className="text-[rgba(51,51,51,0.60)] text-3 font-400 lh-5.5 mt-4 w-22.5 h-5.5">提交后不可修改</div>
        </div>
        
        <div className="flex items-center w-full h-5.5 mt-8">
            <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 w-17.5 h-5.5 ml-74.25">内容形式：</div>
            <Image src={"/images/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 "/>
            <div className="text-[rgba(0,0,0,0.65) text-3.5 font-400 lh-5.5 ml-2">小课</div>
        </div>

        <div className="flex items-center w-full h-5.5 mt-8">
            <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ml-74.25">付费模式：</div>
            <button className="flex items-center w-20 h-5.5">
                <Image src={"/images/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 "/>
                <div className="text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 ml-2">永久买断</div>
            </button>
            <button className="flex items-center w-20 h-5.5 ml-8">
                <Image src={"/images/co-author/uncheck.svg"} alt="uncheck" width={20} height={20} className="w-4 h-4"/>
                <div className="text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 ml-2">限时订阅</div>
            </button>
            <div className="text-[red] text-3 font-400 lh-5.5 ml-12 h-5.5">*</div>  
            <div className="text-[rgba(51,51,51,0.60)] text-right text-3 font-400 lh-5.5  h-5.5">提交后不可修改</div> 
        </div>

        <div className="flex items-center w-full h-8 mt-4">
            <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 w-32.5 ml-42">价格</div>
            <div className="text-[rgba(0,0,0,0.25)] text-right text-3.5 font-400 lh-5.5 ">（最低50元）</div>
            <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ">：</div>
            <div className="inline w-22 h-8 fill-#FFF border-rd-1 border-2 border-solid  ">
                <input type="" name="" id="" placeholder="请输入" className="outline-none  text-[rgba(0,0,0,0.25)] text-3.5 font-400 lh-5.5 w-15 ml-3 mt-1" ></input>    
            </div>
            <div className="text-[rgba(0,0,0,0.65)] text-right text-3.5 font-400 lh-5.5 ml-2">元</div>
        </div>

        <button className="w-16.25 h-8 ml-65.75 mt-20">
            <Image src={"/images/co-author/submit.svg"} alt="submit" width={20} height={20} className="w-16.25 h-8"/>        
        </button>

    </div>
}

export default Page;
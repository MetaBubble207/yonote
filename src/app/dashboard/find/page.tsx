import React from "react";
import Image from "next/image";
import Navbar from "../../_components/common/Navbar"
import ActivityEnd from "@/app/_components/find/activityEnd";
import ActivityGoing from "@/app/_components/find/activityGoing";


const Find=()=>{
    return (
        <div className="min-h-screen relative bg-#F5F7FB">
            <div className="w-85.75 m-auto pt-8">
                {/*搜索框*/}
                <div className="inline border-rd-13  h-8.5 bg-[#FFF] flex items-center">
                        <Image src={"/images/subscribe/search.png"} alt="search" width={18} height={18} className="inline  ml-5.25 w-4.5 h-4.5"></Image>
                        <input type="search" name="" id="" placeholder="仅支持搜索专栏和作者" className="text-3.25 text-[#999] lh-8.5 ml-1.6 justify-center outline-none w-full h-8.5 pl-1.6 border-rd-13 " ></input>
                    </div>

                {/*活动中心*/}
                <div className="text-[#252525]  text-4.5 font-500 lh-6 mt-6 ml-1.5">活动中心</div>
                <Image src={"/images/subscribe/underline.svg"} alt="underline" width={11} height={4} className="w-2.75 h-1 ml-9 mt-0.75"></Image>
            
                

                {/*活动列表-已结束*/}
                <ActivityEnd/>

                {/*活动列表-进行中*/}
                <ActivityGoing/>
                
            </div>

            <div className="bottom-4 justify-center w-full fixed">
                <Navbar/>
            </div>

        </div>
    )
}



export default Find;

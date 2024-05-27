import React from "react";
import Image from "next/image";
import Navbar from "../../_components/common/Navbar"
import Activities from "@/app/_components/find/activities";
import {SearchColumn} from "@/app/_components/common/SearchColumn";


const Find=()=>{
    return (
        <div className="min-h-screen relative bg-#F5F7FB">
            <div className="w-85.75 m-auto pt-8">

                {/*搜索框*/}
                <SearchColumn></SearchColumn>

                {/*活动中心*/}
                <div className="text-[#252525]  text-4.5 font-500 lh-6 mt-6 ml-1.5">活动中心</div>
                <Image src={"/images/subscribe/underline.svg"} alt="underline" width={11} height={4} className="w-2.75 h-1 ml-9 mt-0.75"></Image>


                {/*活动列表-已结束*/}
                <Activities/>
            </div>

            <div className="bottom-4 justify-center w-full fixed">
                <Navbar/>
            </div>
        </div>
    )
}
export default Find;

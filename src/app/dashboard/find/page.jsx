import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../_components/common/Navbar"


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
                <div className="inline mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] flex relative">
                    <div className="inline mt-2.5 ml-2.5 h-31.25 w-80.75 item-center flex  ">
                        <div className=" flex flex-col">
                            <div className=" w-16 text-[#252525] text-3.75  font-500 lh-6 ml-46 mt-1.75" >每日一答</div>
                            <div className=" mt-1.25 ml-46 w-13.75 text-[#666] text-3.25  font-400 lh-[120%]">连续七日</div> 
                            </div>
                        <Image src={"/images/subscribe/acti-cover.svg"} alt="acti-cover" width={16} height={12} className="border-rd=4 w-41 h-31.25 absolute top-2.5 left-2.5 "/> 

                        {/*已结束标签*/}
                        <div className="inline absolute top-2.5 left-2.5 w-11.75 h-5.25  border-rd-[0px_25px_25px_0px] bg-[#B8BBCC]">
                            <div className="ml-1.75 mt-1  text-[#FFF]  text-2.5  font-500 lh-[120%] ">已结束</div>
                        </div>

                        {/*立即查看*/}                            
                        <Link href={"/"} className=" ml-61 mt-23.5 w-18.25 h-6.25 bg-[rgba(218,249,241,0.35)] border-rd-5.25  text-[rgba(29,180,141,0.35)] font-500 lh-6 text-center text-3 absolute right-4 bottom-4 ">立即查看</Link>
                        
                    </div>
                </div>

                {/*活动列表-进行中*/}
                <div className="inline mt-2 h-36.25 w-full border-rd-4 bg-[#FFF] flex relative">
                    <div className="inline mt-2.5 ml-2.5 h-31.25 w-80.75 item-center flex  ">
                        <div className=" flex flex-col">
                            <div className=" w-16 text-[#252525] text-3.75  font-500 lh-6 ml-46 mt-1.75" >每日一答</div>
                            <div className=" mt-1.25 ml-46 w-13.75 text-[#666] text-3.25  font-400 lh-[120%]">连续七日</div> 
                            </div>
                        <Image src={"/images/subscribe/acti-cover.svg"} alt="acti-cover" width={16} height={12} 
                        className="border-rd=4 w-41 h-31.25 absolute top-2.5 left-2.5 "></Image>

                        
                        <div className="absolute top-2.5 left-2.5 w-11.75 h-5.25  border-rd-[0px_25px_25px_0px] bg-[#4EDFE9]  ">
                            <div className="ml-1.75 mt-1 text-[#FFF]  text-2.5  font-500 lh-[120%] ">进行中</div>
                            
                        </div>

                                                  
                        <button className="ml-61 mt-23.5 w-18.25 h-6.25 bg-[#DAF9F1] border-rd-5.25  
                            text-[#1DB48D] font-500 lh-6 text-center text-3 absolute right-4 bottom-4 ">立即查看</button>
                        
                    </div>
                </div>
                
            </div>

            <div className="bottom-4 justify-center w-full fixed">
                <Navbar />
            </div>

        </div>
    )
}



export default Find;

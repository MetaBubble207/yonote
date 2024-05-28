"use client"
import Image from "next/image";
import React, { useState,useEffect  } from "react";
import { api } from "@/trpc/react";

const Activities =()=>{
    const [data, setData] = useState(null);

    // 使用 useQuery 钩子获取数据
    const { data: queryData} = api.activity.getAll.useQuery();

    // 在数据加载完成时更新状态
    useEffect(() => {
        if (queryData) {
            //排列数据，让进行中的活动排列靠前
            const sortedData = [...queryData].sort((a, b) => {
                if (a.isEnd === b.isEnd) return 0;
                return a.isEnd ? 1 : -1; // 进行中的活动排在前面
            });
            setData(sortedData);
        }
    }, [queryData]);

    return(
        <div>
           {data?.map(item => (
                <div className="inline mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] flex relative " key={item.id}>
                    <div className="inline mt-2.5 ml-2.5 h-31.25 w-80.75 item-center flex  ">
                        <div className=" flex flex-col">
                            <div className=" w-16 text-[#252525] text-3.75  font-500 lh-6 ml-46 mt-1.75" >{item.name}</div>
                            <div className=" mt-1.25 ml-46 w-13.75 text-[#666] text-3.25  font-400 lh-[120%]">{item.introduction}</div> 
                        </div>
                        <Image src={"/images/subscribe/acti-cover.svg"} alt="acti-cover" width={16} height={12} className="border-rd=4 w-41 h-31.25 absolute top-2.5 left-2.5 "/> 
                        
                        {/* 根据 item.isEnd 的值选择不同的样式 */}
                        <div className={` absolute top-2.5 left-2.5 w-11.75 h-5.25 border-rd-[0px_25px_25px_0px] ${item.isEnd ? 'bg-[#B8BBCC]' : 'bg-[#4EDFE9]'}`}>
                            <div className="ml-1.75 mt-1 text-[#FFF] text-2.5 font-500 lh-[120%]">{item.isEnd ? '已结束' : '进行中'}</div>
                        </div>

                        {/* 根据 item.isEnd 的值选择不同的按钮样式 */}
                        <button className={`ml-61 mt-23.5 w-18.25 h-6.25 ${item.isEnd ? 'bg-[rgba(218,249,241,0.35)] border-rd-5.25 text-[rgba(29,180,141,0.35)]' : 'bg-[#DAF9F1] border-rd-5.25 text-[#1DB48D]'} font-500 lh-6 text-center text-3 absolute right-4 bottom-4`}>
                            立即查看
                        </button>         
                    </div>
                </div>
            ))} 
        </div> 
    )
}
export default Activities;
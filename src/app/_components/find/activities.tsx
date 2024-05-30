"use client"
import Image from "next/image";
import React, { useState,useEffect  } from "react";
import { api } from "@/trpc/react";
import { getCurrentTime } from "@/tools/getCurrentTime";
import Link from "next/link";

const Activities =()=>{
    const [data, setData] = useState(null);

    // 使用 useQuery 钩子获取数据
    const { data: queryData} = api.activity.getAll.useQuery();

    // 在数据加载完成时更新状态
    useEffect(() => {
        if (queryData){
            const currentTime = getCurrentTime();
            //过滤未截止的活动
            const goingData = queryData.filter(item => {
                const endDate = new Date(item.enddate);
                return endDate > currentTime;
            });
            setData(goingData);
            // setData(queryData)
        }
    }, [queryData]);

    return(
        <div>
           {data?.map(item => (
               <Link href={"/recommend"} key={item.id}>
                   <div className="inline mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] flex relative " key={item.id}>
                       <div className="inline mt-2.5 ml-2.5 h-31.25 w-80.75 item-center flex  ">
                           <div className=" flex flex-col">
                               <div className="w-33 h-5 text-[#252525] text-3.75  font-500 lh-6 ml-46 mt-1.75"
                                    style={{wordWrap: 'break-word',
                                            overflow: 'hidden'
                                    }}>
                                    {item.name}
                                </div>
                               <div
                                    className="w-33 h-11.5 mt-1.25 ml-46 w-13.75 text-[#666] text-3.25  font-400 lh-[120%]"
                                    style={{wordWrap: 'break-word',
                                            overflow: 'hidden'
                                    }}>
                                        {item.introduction}
                                </div>
                           </div>
                           <Image src={"/images/subscribe/acti-cover.svg"} alt="acti-cover" width={16} height={12}
                                  className="border-rd=4 w-41 h-31.25 absolute top-2.5 left-2.5 "/>

                           <div
                               className={` absolute top-2.5 left-2.5 w-11.75 h-5.25 border-rd-[0px_25px_25px_0px] bg-[#4EDFE9]`}>
                               <div className="ml-1.75 mt-1 text-[#FFF] text-2.5 font-500 lh-[120%]">进行中</div>
                           </div>
                           <button
                               className={`ml-61 mt-23.5 w-18.25 h-6.25 bg-[#DAF9F1] border-rd-5.25 text-[#1DB48D] font-500 lh-6 text-center text-3 absolute right-4 bottom-4`}>
                               立即查看
                           </button>


                       </div>
                   </div>
               </Link>
           ))}
        </div>
    )
}
export default Activities;


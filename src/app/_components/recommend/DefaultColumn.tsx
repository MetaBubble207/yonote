// import Image from "next/image";
// import { api } from "@/trpc/react";
// import React, { useState, useEffect } from "react";
// import { timeToDateString } from "@/tools/timeToString";
// import Link from "next/link";

// export const DefaultColumn = () => {
//   const [data, setData] = useState(null);
//   const [sortOrder, setSortOrder] = useState<boolean>(true); // 默认为 true，表示倒序排序

//   // 使用 useQuery 钩子获取数据
//   const { data: queryData, isLoading, isError } = api.column.getAll.useQuery();

//   // 在数据加载完成时更新状态
//   useEffect(() => {
//     if (queryData) {
//       // 根据 sortOrder 设置 data 的值
//       const sortedData = sortOrder ? [...queryData].reverse() : queryData;
//       setData(sortedData);
//     }
//   }, [queryData, sortOrder]);

//   const toggleSortOrder = () => {
//     setSortOrder(!sortOrder);
//   };

//   return (
//     <div>
//       <button className="flex" onClick={toggleSortOrder}>
//         <div className="ml-4 mt-2 text-[#B5B5B5] text-2.5 font-400 lh-6">
//           {sortOrder ? "默认倒序排序" : "顺序排序"}
//         </div>
//         <Image
//           src={"/images/recommend/sort.svg"}
//           alt={"sort"}
//           width={12}
//           height={12}
//           className="w-3 h-3 mt-3.5 ml-1.25"
//         />
//       </button>

//       {data?.map((item) => (
//         <div className="mt-4 ml-4" key={item.id}>
//           <Link href={`/special-column?id=${item.id}`}>
//             <div className="w-85.75 h-33.75 border-rd-5 bg-[#FFF]">
//               <div className="flex h-19 pl-2.5 pt-2">
//                 <Image
//                   unoptimized
//                   style={{ objectFit: "cover" }}
//                   src={item.logo ?? "/images/user/Loading.svg"}
//                   alt="cover"
//                   width={24}
//                   height={24}
//                   className="w-15.5 h-19 border-rd-2"
//                 />
//                 <div className="w-64.25 h-16 mt-1 ml-3">
//                   <div className="text-[#252525] text-3.75 font-500 lh-6">
//                     {item.name}
//                   </div>
//                   <div className="text-[#666] text-3.25 font-400 lh-[120%] mt-2">
//                     {item.introduce}
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-3 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
//                 <Image
//                   src={item.user?.avatar ?? "/images/user/Loading.svg"}
//                   alt="user_image"
//                   width={24}
//                   height={24}
//                   className="w-24px h-24px border-rd-12"
//                 />
//                 <div className="ml-1 w-43">
//                   <div className="flex text-[#999] text-2.75 lh-4">
//                     {item.user?.name}
//                   </div>
//                   <div className="text-[#B5B5B5] text-2.75 lh-4">
//                     {timeToDateString(item.createdAt)}发布
//                   </div>
//                 </div>
//                 <div className="flex-1 flex items-center">
//                   <Image
//                     src={"/images/recommend/rss.svg"}
//                     alt="rss"
//                     width={5}
//                     height={5}
//                     className="w-4.5 h-4.5"
//                   />
//                   <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">
//                     1.2k
//                   </div>
//                   <Image
//                     src={"/images/recommend/open.svg"}
//                     alt="open"
//                     width={5}
//                     height={5}
//                     className=" w-4.5 h-4.5 ml-7"
//                   />
//                   <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">
//                     1.2k
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// };

import Image from "next/image";
import { api } from "@/trpc/react";
import React, { useState, useEffect } from "react";
import { timeToDateString } from "@/tools/timeToString";
import Link from "next/link";

export const DefaultColumn = () => {
    const [data, setData] = useState(null);
    const [sortOrder, setSortOrder] = useState<boolean>(true); // 默认为 true，表示倒序排序

    // 使用 useQuery 钩子获取数据
    const { data: queryData, isLoading, isError } = api.column.getCreateAt.useQuery();

    // 在数据加载完成时更新状态
    useEffect(() => {
        if (queryData) {
            // 根据 sortOrder 设置 data 的值
            const sortedData = sortOrder ? [...queryData].reverse() : queryData;
            setData(sortedData);
        }
    }, [queryData, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(!sortOrder);
    };

    return (
        <div>
            <button className="flex" onClick={toggleSortOrder}>
                <div className="ml-4 mt-2 text-[#B5B5B5] text-2.5 font-400 lh-6">
                    {sortOrder ? "默认倒序排序" : "顺序排序"}
                </div>
                <Image
                    src={"/images/recommend/sort.svg"}
                    alt={"sort"}
                    width={12}
                    height={12}
                    className="w-3 h-3 mt-3.5 ml-1.25"
                />
            </button>

            {data?.map(item => (
                <div className="mt-4 ml-4" key={item.id}>
                    <Link href={`/special-column?id=${item.id}`}>
                        <div className="w-85.75 h-33.75 border-rd-5 bg-[#FFF]">
                            <div className="flex h-19 pl-2.5 pt-2">
                                <Image
                                    quality={100}
                                    style={{ objectFit: "cover" }}
                                    src={item.logo ?? "/images/user/Loading.svg"}
                                    alt="cover"
                                    width={24}
                                    height={24}
                                    className="w-15.5 h-19 border-rd-2"
                                />
                                <div className="w-64.25 h-16 mt-1 ml-3">
                                    <div className="text-[#252525] text-3.75 font-500 lh-6 ">{item.name}</div>
                                    <div className="text-[#666] text-3.25 font-400 lh-[120%] mt-2">{item.introduce}</div>
                                </div>
                            </div>
                            <div className="mt-3 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
                                <Image
                                    src={item.user?.avatar ?? "/images/user/Loading.svg"}
                                    alt="user_image"
                                    width={24}
                                    height={24}
                                    className="w-24px h-24px border-rd-12"
                                />
                                <div className="ml-1 w-43">
                                    <div className="flex text-[#999] text-2.75 lh-4">{item.user?.name}</div>
                                    <div className="text-[#B5B5B5] text-2.75 lh-4">{timeToDateString(item.createdAt)}发布</div>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <Image
                                        src={"/images/recommend/rss.svg"}
                                        alt="rss"
                                        width={5}
                                        height={5}
                                        className="w-4.5 h-4.5"
                                    />
                                    <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                                    <Image
                                        src={"/images/recommend/open.svg"}
                                        alt="open"
                                        width={5}
                                        height={5}
                                        className=" w-4.5 h-4.5 ml-7"
                                    />
                                    <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

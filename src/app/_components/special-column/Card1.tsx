"use client"
import { column } from "@/server/db/schema";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export const Card1 = () => {
    const params = useSearchParams();
    const columnId = params.get("id");

    const post = api.post.getAll.useQuery({
        columnId: columnId,
        limit: 1,
        offset: 0,
    });

    // const user = api.post.getAllInUser.useQuery({
    //     userId: "1",
    //     limit: 1,
    //     offset: 0,
    // })

    const [number, setNumber] = useState(0);
    useEffect(() => {
        if (post.data && post.data.length > 0) {
            setNumber(0);
        }
    }, [post.data]);

    const router = useRouter();
    // 点赞
    const [isHeartFilled, setIsHeartFilled] = useState(false);

    const handleClick = () => {
        setIsHeartFilled(!isHeartFilled);
        setNumber((prevNumber) => prevNumber + 1);
    };


    const link = () => {
        router.push(`/special-column-content?c=${number+1}&id=${columnId}`)
    };

    return (
        <div  className={"w-91.5%  mt-20px ml-16px shrink-0 border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] px-10px"} >
            {/*上边*/}
            <div className={"flex mt-25.5px items-center w-full"} onClick={link}>
                {/*左边图片*/}
                <div className={"border-rd-2 w-30%"}>
                    <Image src={"/images/special-column/Cardpc.png"} alt={"小专栏图片"} width={85} height={74.5} className={"rounded-6px"} style={{ width: "100%" }} />
                </div>
                {/*右边文字*/}
                <div className={"ml-8px w-67% "}>
                    <div className={" text-[#252525] text-3.75 font-500 lh-6 text-3.75 "}>
                        {/* 使用 post.data.map 遍历所有文章 */}
                        {post.data && post.data.length > 0 && (
                            <div>
                                <p>{post.data[number]?.name}</p>
                            </div>
                        )}

                        <span className={" shrink-0 border-rd-0.5 bg-[#FDB069] shrink-0 text-[#000]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>
                            {/* 使用 post.data.map 遍历所有文章 */}
                            {post.data && post.data.length > 0 && (
                                <div>
                                    <p>{post.data[number]?.tag}</p>
                                </div>
                            )}

                        </span>
                        {/* <span className={" shrink-0 border-rd-0.5 bg-[#75C3EE] shrink-0 text-[#000]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>
                            {post.data && post.data.length > 0 && (
                                <div>
                                    <p>{post.data[number+1]?.tag}</p>
                                </div>
                            )}
                        </span> */}
                    </div>

                    <div className={"text-[#666]  text-3.25 font-400 lh-[120%] pt-5px"}>
                        {/* 使用 post.data.map 遍历所有文章 */}
                        {post && post.data && post.data.map((article, index) => (
                            <div key={index}>
                                <p>{article.content}</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/*下方图标*/}
            <div className="flex mt-18px items-center space-y-0 mb-22px">

                {/*左边头像*/}
                <div className={""}>
                    <div>
                        <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={23} height={23} />
                    </div>
                </div>
                {/*昵称，日期，VIP*/}
                <div>
                    <div className={"flex items-center"}>
                        <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                        <div>
                            <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{ marginLeft: "2.5px" }} />
                        </div>
                    </div>
                    <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>03-01发布</div>

                </div>

                {/*右方点赞数量*/}
                <div className="ml-auto flex items-center space-y-0">
                    <div>
                        <Image
                            src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 2.png"}
                            onClick={handleClick}
                            alt={"爱心"} width={18} height={18} objectFit="none" />
                    </div>
                    <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                </div>
                {/*右方浏览数量*/}
                <div className="ml-24px flex items-center space-y-0">
                    <div>
                        <Image src={"/images/special-column/Preview-open (预览-打开).png"} alt={"爱心"} width={18}
                            height={18} objectFit="none" />
                    </div>
                    <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                </div>
            </div>
        </div>
    )
}

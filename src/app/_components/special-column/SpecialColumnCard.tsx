"use client"
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {timeToDateString} from "@/tools/timeToString";
import {api} from "@/trpc/react";
import {useEffect} from "react";

export const SpecialColumnCard = (props) => {
    const {item, user, data} = props;
    const chapter = item.chapter;

    const router = useRouter();
    // 点赞
    // const [isLike, setIsLike] = useState(false);

    // const handleClick = () => {
    //     setIsLike(!isLike);
    // };


    // 获取点赞数量
    const likeCount = api.like.getLikeCount.useQuery({
        postId: item.id,
    }).data;

    // 获取阅读量
    const readCount = api.read.getPostRead.useQuery({
        postId: item.id,
    }).data
    const link = () => {
        router.push(`/special-column-content?c=${item.chapter}&id=${item.columnId}`)
    };
    const alertMessage = () => {
        alert("请先购买专栏")
    }
    const [postContent, setPostContent] = useState("");
    useEffect(() => {
        if (item.content && item.content.length > 48) {
            setPostContent(item.content = item.content.substring(0, 48) + "...");
        } else {
            setPostContent(item.content)
        }
    }, [item.content])
    return (
        <div
            className={"w-91.5%  mt-8px ml-16px shrink-0 border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] px-12px pb-10px"}>
            {/*上边*/}
            <div className={"flex mt-25.5px items-center w-full"} onClick={data || item.isFree ? link : alertMessage}>
                {/* {status?:<div className={"flex mt-25.5px items-center w-full"} onClick={alertMessage}>} */}
                {/*左边图片*/}
                {item?.logo && (
                    <div className={"border-rd-2 w-30%"}>
                        <Image src={item?.logo ? item?.logo : "images/recommend/cover.svg"} alt={"小专栏图片"}
                               width={85} height={74.5}
                               className={"rounded-6px"} style={{width: "100%"}}/>
                    </div>
                )}

                {/*右边文字*/}
                <div className={"ml-8px w-67% "}>
                    <div className={" text-[#252525] text-3.75 font-500 lh-6 text-3.75 "}>
                        <span
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                WebkitLineClamp: 2,
                            }}>
                            {item?.name ? (item?.name?.length >= 15 ? item?.name?.substring(0, 15) + "..." : item?.name) : "未知专栏"}
                        </span>
                        {
                            item?.isTop && <span
                                className={" shrink-0 border-rd-0.5 bg-[#FDB069] shrink-0 text-[#000]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>
                                <span>
                                    置顶
                                </span>
                            </span>}
                        {item?.isFree && <span
                            className={" shrink-0 border-rd-0.5 bg-[#FDB069] shrink-0 text-[#000]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>
                            <span>
                                免费
                            </span>
                        </span>

                        }
                        {/* <span className={" shrink-0 border-rd-0.5 bg-[#75C3EE] shrink-0 text-[#000]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>
                            {item.data && item.data.length > 0 && (
                                <div>
                                    <p>{item.data[number+1]?.tag}</p>
                                </div>
                            )}
                        </span> */}
                    </div>

                    <div
                        className={"text-[#666] text-3.25 font-00 lh-[120%] pt-5px w-75"}
                        style={
                            {
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }
                        }
                        dangerouslySetInnerHTML={{__html: postContent}}>
                        {/* {item.content} */}
                    </div>
                </div>
            </div>

            {/*下方图标*/}
            <div className="flex mt-18px items-center space-y-0 ">
                {user && <>
                    {/*左边头像*/}
                    <div>
                        <Image src={user?.avatar ? user?.avatar : "images/recommend/cover.svg"} alt={"心智与阅读"}
                               width={23} height={23} className={"rounded-full"}/>
                    </div>
                    {/*昵称，日期，VIP*/}
                    <div>
                        <div className={"flex items-center"}>
                            <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>
                                {user?.user ? user?.name : "未知用户"}
                            </div>
                            <div>
                                <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12}
                                       height={12} className={"lh-0"} style={{marginLeft: "2.5px"}}/>
                            </div>
                        </div>
                        <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>
                            {timeToDateString(item.updatedAt)}发布
                        </div>
                    </div>
                </>}
                {/*右方点赞数量*/}
                <div className="ml-auto flex items-center space-y-0">
                    <div>
                        <Image
                            // src={isLike ? "/images/special-column/heart red.png" : "/images/special-column/heart 2.png"}
                            src={"/images/special-column/heart 2.png"}
                            // onClick={handleClick}
                            alt={"爱心"} width={18} height={18} objectFit="none"/>
                    </div>
                    <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>{likeCount}</div>
                </div>
                {/*右方浏览数量*/}
                <div className="ml-24px flex items-center space-y-0">
                    <div>
                        <Image src={"/images/special-column/Preview-open (预览-打开).png"} alt={"爱心"} width={18}
                               height={18} objectFit="none"/>
                    </div>
                    <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>{readCount}</div>
                </div>
            </div>
        </div>

    )
}

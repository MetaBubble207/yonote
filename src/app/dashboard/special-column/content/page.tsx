"use client";
import {api} from "@/trpc/react";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import useLocalStorage from "@/tools/useStore";
import {time2DateString} from "@/tools/timeToString";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import Image from "next/image";
import Loading from "@/app/_components/common/Loading";

const Page = () => {
    const router = useRouter();

    const params = useSearchParams();
    const chapter = parseInt(params.get("c"));
    const columnId = params.get("id");

    const [token] = useLocalStorage("token", null);


    const {data: postData, isFetching} = api.post.getById.useQuery({
        id: columnId,
        chapter: chapter
    });
    const prepost = api.post.getById.useQuery({
        id: columnId,
        chapter: chapter - 1
    }, {enabled: Boolean(chapter)}).data;
    const nextpost = api.post.getById.useQuery({
        id: columnId,
        chapter: chapter + 1
    }, {enabled: Boolean(chapter)}).data;

    const numData = api.post.getNumById.useQuery({
        id: columnId,
    }).data;

    const addRead = api.read.create.useMutation();

    const [date, setDate] = useState("");
    const [name, setName] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState("");
    const [likeCount, setLikeCount] = useState(0);
    const [pretitle, setPretitle] = useState(null);
    const [nexttitle, setNexttitle] = useState(null);
    const [isHeartFilled, setIsHeartFilled] = useState(false);

    const postId = api.post.getPostId.useQuery({
        id: columnId,
        chapter: chapter,
    }).data;

    const likeList = api.like.getLikeList.useQuery({
        postId: postId,
        userId: token
    }).data;

    const getLikeCount = api.like.getLikeCount.useQuery({
        postId: postId,
    }).data;

    const columnDetail = api.column.getColumnDetail.useQuery({
        columnId: columnId
    }).data;

    const status = api.order.getUserStatus.useQuery({
        userId: token,
        columnId: columnId,
    }).data

    const alertMessage = () => {
        alert("请先购买专栏")
    }

    useEffect(() => {

        if (postData) {
            if (postData.name) {
                const pubTime = postData.createdAt;
                setName(postData.name);
                setDate(time2DateString(pubTime));
            } else {
                setDate("");
                setName("");
            }

            if (postData.tag) {
                setTags(postData.tag.split(","));
            } else {
                setTags([]);
            }

            if (postData.content) {
                setContent(postData.content);
            } else {
                setContent("");
            }

            if (chapter > 1 && prepost) {
                setPretitle(prepost.name);
            } else {
                setPretitle("已经是第一篇了");
            }
            if (chapter <= numData && nextpost) {
                setNexttitle(nextpost.name);
            } else {
                setNexttitle("已经是末篇了");
            }

            addRead.mutate({
                userId: token,
                postId: postData.id
            })

        }
    }, [postData]);

    // 修改点赞状态
    const updateLike = api.like.updateLike.useMutation();

    const createLike = api.like.create.useMutation();
    const uptime = api.like.uptime.useMutation();

    // 点赞
    useEffect(() => {
        if (likeList) {
            likeList.length === 0 ? setIsHeartFilled(false) : setIsHeartFilled(likeList[0].isLike);
        } else {
            setIsHeartFilled(false);
        }
        // 点赞总数
        setLikeCount(getLikeCount ?? 0)
    }, [likeList]);


    const likehandle = () => {
        if (likeList.length === 0) {
            createLike.mutate({
                    postId: postId,
                    userId: token,
                    isLike: true
                },
            )
        } else {
            updateLike.mutate({
                postId: postId,
                userId: token,
                isLike: !isHeartFilled
            });
            uptime.mutate({
                postId: postId,
                userId: token,
            })
        }
        setIsHeartFilled(!isHeartFilled);
        if (isHeartFilled) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }

    }
    // 目录跳转
    const link = () => {
        router.push(`/dashboard/special-column?c=1&id=${columnId}`);
    }
    const preLink = () => {
        router.push(`/dashboard/special-column/content?c=${chapter - 1}&id=${columnId}`);
    }
    const nextLink = () => {
        router.push(`/dashboard/special-column/content?c=${chapter + 1}&id=${columnId}`);
    }

    const shareLink = () => {
        router.push(`/dashboard/poster/post?c=${chapter}&id=${columnId}`)
    }

    if (isFetching) return <div className={"h-screen w-full flex items-center justify-center"}>
        <Loading/>
    </div>
    return (
        <div className={"relative bg-#F5F7FB min-h-screen pb-10"}>
            <div className={"ml-16px"}>
                {/*上方分享*/}
                <div className={"flex justify-end items-center pt-16px"}>
                    <div
                        className={
                            "inline-block w-14.25 h-6 text-[#252525] shrink-0 bg-#5CE5C1 text-2.5 font-500 lh-6 text-center rounded-full"
                        }
                    >
                        加速计划
                    </div>
                    <div className="inline-block ml-10px mr-16px" onClick={shareLink}>
                        <Image
                            src={"/images/special-column/Share-black.png"}
                            alt={"分享"}
                            width={12}
                            height={12}
                        />
                    </div>
                </div>

                {/*头像，昵称，时间*/}
                <div>{name}</div>
                <div className="flex mt-10px items-center space-y-0 mb-22px">
                    {/*左边头像*/}
                    <div>
                        <div>
                            <Image
                                placeholder="blur"
                                blurDataURL={DefaultLoadingPicture()}
                                src={postData?.user.avatar ?? DefaultLoadingPicture()}
                                alt={"avatar"}
                                width={33}
                                height={33}
                                className={"rounded-full"}
                            />
                        </div>
                    </div>
                    {/*昵称，日期，VIP*/}
                    <div>
                        <div className={"flex items-center"}>
                            <div
                                className={
                                    "text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"
                                }
                            >
                                {postData?.user.name}
                            </div>
                            {
                                postData?.user.idType === 1 && <Image
                                    src={"/images/special-column/Group 225.png"}
                                    alt={"心智与阅读"}
                                    width={12}
                                    height={12}
                                    className={"ml-1"}
                                />
                            }
                        </div>
                        <div
                            className={
                                "text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"
                            }
                        >
                            {date}发布
                        </div>
                    </div>
                </div>

                {/*内容*/}
                <div>
                    {postData?.cover && (
                        <Image
                            src={postData?.cover}
                            alt={"心智与阅读"}
                            width={343}
                            height={161}
                            className="w-85.75 h-40.25"
                        />
                    )}
                </div>
                <div
                    className={
                        "w-85.75 mt-24px shrink-0 text-[#666] text-3.5 font-not-italic font-400 lh-[120%] h-auto overflow-auto"
                    }
                >
                    <div
                        className="break-all"
                        dangerouslySetInnerHTML={{__html: content}}
                    ></div>
                </div>
            </div>
            <div className={'fixed bottom-6 left-3.5'}>
                <div className="w-full h-7 flex-wrap pt-2 relative ws-normal whitespace-pre-line break-all">
                    <div className={'flex'}>
                        {tags.map((item, index) => {
                            return (
                                <div
                                    className={
                                        "text-[#1DB48D] text-3 font-not-italic font-400 lh-6 mr-2"
                                    }
                                    key={index}
                                >
                                    #{item}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center h-5 absolute right-0 top-10">
                        <Image
                            src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 1.png"}
                            alt={"爱心"}
                            width={18}
                            height={18}
                            className="w-5 h-5"
                            onClick={likehandle}
                        />
                        <div
                            className={
                                "text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-2.5 mr-4"
                            }
                        >
                            {likeCount ?? 0}
                        </div>
                    </div>
                </div>

                {/*页面底端上一篇下一篇*/}
                <div className="bg-#F5F7FB flex">
                    <div className={"w-86.5 h-28.75 bg-[#FFF] rounded-2 mx-auto mt-2"}>
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div className="ml-24px flex items-center space-y-0"></div>
                            </div>
                        </div>

                        <div className={"mx-16px"}>
                            {/*目录*/}
                            <div onClick={link}>
                                <div className={"flex items-center mt-2"}>
                                    <div
                                        className={
                                            "text-[#666] text-2.5 font-not-italic font-400 lh-14px"
                                        }
                                    >
                                        {/* {columnDetail?.name}•目录 */}
                                        {columnDetail?.name.length > 20 ? columnDetail?.name.substring(0, 20) + "…" : columnDetail?.name}
                                    </div>
                                    <div className={"ml-5px"}>
                                        <Image
                                            src={"/images/special-column/Sort-one.png"}
                                            alt={"心智与阅读"}
                                            width={14}
                                            height={14}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*上一篇下一篇*/}
                            <div className="flex mt-8px">
                                {/* 上一篇 */}
                                {chapter === 1 ? (
                                        <div className={"flex flex-col"}>
                                            <div className={"flex items-center"}>
                                                <Image
                                                    src={"/images/special-column/Double-Left.png"}
                                                    alt={"心智与阅读"}
                                                    width={14}
                                                    height={14}
                                                />
                                                <div
                                                    className={
                                                        "text-[#333] text-3 font-not-italic font-400 lh-6 ml-5px"
                                                    }
                                                >
                                                    上一篇
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6"
                                                }
                                            >
                                                已经是第一篇了
                                            </div>
                                        </div>
                                    )
                                    : (
                                        // <Link className="flex flex-col" href={`../special-column-content?c=${chapter - 1}&id=${columnId}`}>
                                        <div className="flex flex-col"
                                             onClick={prepost?.isFree || status || columnDetail?.userId === token ? preLink : alertMessage}>
                                            <div className={"flex items-center"}>
                                                <div>
                                                    <Image
                                                        src={"/images/special-column/Double-Left.png"}
                                                        alt={"心智与阅读"}
                                                        width={14}
                                                        height={14}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        "text-[#333] text-3 font-not-italic font-400 lh-6 ml-5px"
                                                    }
                                                >
                                                    上一篇
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6"
                                                }
                                            >
                                                {pretitle}
                                            </div>
                                        </div>
                                    )}
                                {numData <= chapter ? (
                                        <div className="flex flex-col ml-auto">
                                            <div className={"flex items-center justify-end"}>
                                                <div
                                                    className={
                                                        "text-[#333] text-3 font-not-italic font-400 lh-6 "
                                                    }
                                                >
                                                    下一篇
                                                </div>
                                                <div>
                                                    <Image
                                                        src={"/images/special-column/Double-Right.png"}
                                                        alt={"心智与阅读"}
                                                        width={14}
                                                        height={14}
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6 text-right"
                                                }
                                            >
                                                已经是末篇了
                                            </div>
                                        </div>
                                    ) :

                                    // nextpost?.data.isFree || status ? (<div>hellop</div>)
                                    //   : (<div></div>)
                                    <div className="flex flex-col ml-auto"
                                         onClick={nextpost?.isFree || status || columnDetail?.userId === token ? nextLink : alertMessage}>
                                        <div className={"flex items-center justify-end"}>
                                            <div
                                                className={
                                                    "text-[#333] text-3 font-not-italic font-400 lh-6 "
                                                }
                                            >
                                                下一篇
                                            </div>
                                            <div>
                                                <Image
                                                    src={"/images/special-column/Double-Right.png"}
                                                    alt={"心智与阅读"}
                                                    width={14}
                                                    height={14}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6 text-right"
                                            }
                                        >
                                            {nexttitle}
                                        </div>
                                    </div>

                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Page;

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { time2DateString } from "@/tools/timeToString";
import { useEffect } from "react";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import { type DetailPostCard } from "@/server/db/schema";
import Link from "next/link";

const PostCard = ({
  postDetail,
  isSubscribe,
}: {
  postDetail: DetailPostCard;
  isSubscribe: boolean;
}) => {
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    if (postDetail.content && postDetail.content.length > 48) {
      setPostContent(
        (postDetail.content = postDetail.content.substring(0, 48) + "..."),
      );
    } else {
      setPostContent(postDetail.content);
    }
  }, [postDetail, postDetail.content]);

  const handleClickPost = () => {
    if (isSubscribe || postDetail.isFree) {
      link();
    } else {
      alertMessage();
    }
  };

  const router = useRouter();

  const link = () => {
    router.push(
      `/dashboard/special-column/content?c=${postDetail.chapter}&id=${postDetail.columnId}`,
    );
  };

  const alertMessage = () => {
    alert("请先购买专栏");
  };

  return (
    <div
      className={
        "w-91.5% mt-8px ml-16px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] px-2.5 pb-4 pt-4"
      }
    >
      {/*上边*/}
      <div className={"flex w-full items-center"} onClick={handleClickPost}>
        {/*左边图片*/}
        <div className="w-21.25 h-18.625 relative">
          <Image
            placeholder="blur"
            blurDataURL={DefaultLoadingPicture()}
            src={postDetail?.cover ?? DefaultLoadingPicture()}
            alt="小专栏图片"
            quality={100}
            fill
            loading="lazy"
            className="rounded-2 object-cover"
          />
        </div>
        {/*右边文字*/}
        <div className={"ml-8px w-67%"}>
          <div className={"text-3.75 font-500 lh-6 text-3.75 text-[#252525]"}>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                WebkitLineClamp: 2,
              }}
            >
              {postDetail?.name
                ? postDetail.name.length >= 15
                  ? postDetail.name.substring(0, 15) + "..."
                  : postDetail.name
                : "未知专栏"}
            </span>
            {postDetail?.isTop && (
              <span
                className={
                  "border-rd-0.5 text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px shrink-0 bg-[#FDB069] text-[#000]"
                }
              >
                <span>置顶</span>
              </span>
            )}
            {postDetail?.isFree && (
              <span
                className={
                  "border-rd-0.5 text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px shrink-0 bg-[#FDB069] text-[#000]"
                }
              >
                <span>免费</span>
              </span>
            )}
          </div>

          <div
            className={"text-3.25 font-00 pt-5px text-[#666]"}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            dangerouslySetInnerHTML={{ __html: postContent }}
          ></div>
        </div>
      </div>

      {/*下方图标*/}
      <div className="mt-18px flex items-end">
        <Link href={`/dashboard/user/detail?id=${postDetail.userId}`}>
          <div className={"flex items-center"}>
            {/*左边头像*/}
            <div className="w-5.75 h-5.75 relative">
              <Image
                placeholder="blur"
                blurDataURL={DefaultLoadingPicture()}
                src={postDetail.avatar ?? DefaultLoadingPicture()}
                alt="cover"
                quality={100}
                fill
                loading="lazy"
                className="rounded-full object-cover"
              />
            </div>
            {/*昵称，日期，VIP*/}
            <div>
              <div className={"flex items-center"}>
                <div
                  className={
                    "text-2.75 font-not-italic font-500 lh-18px ml-5px text-[#999]"
                  }
                >
                  {postDetail?.userName ? postDetail?.userName : "未知用户"}
                </div>
                {postDetail?.idType === 1 && (
                  <Image
                    src={"/images/special-column/Group 225.png"}
                    alt={"心智与阅读"}
                    width={12}
                    height={12}
                    className={"lh-0"}
                    style={{ marginLeft: "2.5px" }}
                  />
                )}
              </div>
              <div
                className={
                  "text-2.75 font-not-italic font-500 lh-18px ml-5px text-[#999]"
                }
              >
                {time2DateString(postDetail.updatedAt)}发布
              </div>
            </div>
          </div>
        </Link>
        {/*右方点赞数量*/}
        <div className="ml-auto flex items-center">
          <div>
            <Image
              src={"/images/special-column/heart 2.png"}
              alt={"爱心"}
              width={18}
              height={18}
              objectFit="none"
            />
          </div>
          <div
            className={
              "text-2.75 font-not-italic font-500 lh-6 ml-4px text-[#B5B5B5]"
            }
          >
            {postDetail.likeCount}
          </div>
        </div>
        {/*右方浏览数量*/}
        <div className="ml-24px flex items-center">
          <div>
            <Image
              src={"/images/special-column/Preview-open.png"}
              alt={"爱心"}
              width={18}
              height={18}
              objectFit="none"
            />
          </div>
          <div
            className={
              "text-2.75 font-not-italic font-500 lh-6 ml-4px text-[#B5B5B5]"
            }
          >
            {postDetail.readCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

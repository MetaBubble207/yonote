"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { time2DateString } from "@/app/_utils/timeToString";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { type DetailPostCard } from "@/server/db/schema";
import Link from "next/link";
import { message } from "antd";

const MAX_CONTENT_LENGTH = 48;
const MAX_TITLE_LENGTH = 15;

interface PostCardProps {
  postDetail: DetailPostCard;
  isSubscribe: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ postDetail, isSubscribe }) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  // 使用 useMemo 处理文本内容
  const { truncatedContent, truncatedName } = useMemo(() => {
    const content = postDetail.content || "";
    const name = postDetail.name || "未知专栏";

    return {
      truncatedContent: content.length > MAX_CONTENT_LENGTH
        ? content.substring(0, MAX_CONTENT_LENGTH) + "..."
        : content,
      truncatedName: name.length > MAX_TITLE_LENGTH
        ? name.substring(0, MAX_TITLE_LENGTH) + "..."
        : name
    };
  }, [postDetail.content, postDetail.name]);

  const handleClickPost = () => {
    if (isSubscribe || postDetail.isFree) {
      router.push(`/dashboard/special-column/content?c=${postDetail.chapter}&id=${postDetail.columnId}`);
    } else {
      messageApi.error("请先购买专栏");
    }
  };

  const TagBadge = ({ children }: { children: React.ReactNode }) => (
    <span className="border-rd-0.5 text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px shrink-0 bg-[#FDB069] text-[#000]">
      {children}
    </span>
  );

  return (
    <div className="w-91.5% mt-8px ml-16px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] px-2.5 pb-4 pt-4">
      {contextHolder}
      <div className="flex w-full items-center cursor-pointer" onClick={handleClickPost}>
        {/* 封面图片 */}
        <div className="w-21.25 h-18.625 relative">
          <Image
            placeholder="blur"
            blurDataURL={LoadingImage()}
            src={postDetail?.cover ?? NotImage()}
            alt="专栏封面"
            quality={100}
            fill
            loading="lazy"
            className="rounded-2 object-cover"
          />
        </div>
        {/* 文章信息 */}
        <div className="ml-8px w-67%">
          <div className="text-3.75 font-500 lh-6 text-[#252525] flex items-center flex-wrap">
            <span className="truncate block">
              {truncatedName}
            </span>
            {postDetail?.isTop && <TagBadge>置顶</TagBadge>}
            {postDetail?.isFree && <TagBadge>免费</TagBadge>}
          </div>
          <div className="text-3.25 pt-5px text-[#666] line-clamp-2">
            {truncatedContent}
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="mt-18px flex items-end justify-between">
        <Link href={`/dashboard/user/detail?id=${postDetail.userId}`}>
          <div className="flex items-center">
            {/* 用户头像 */}
            <div className="w-5.75 h-5.75 relative">
              <Image
                placeholder="blur"
                blurDataURL={LoadingImage()}
                src={postDetail.avatar ?? NotImage()}
                alt="用户头像"
                quality={100}
                fill
                loading="lazy"
                className="rounded-full object-cover"
              />
            </div>
            {/* 用户信息 */}
            <div className="ml-5px">
              <div className="flex items-center text-2.75 font-500 lh-18px text-[#999]">
                {postDetail.userName || "未知用户"}
                {postDetail.idType === 1 && (
                  <Image
                    src="/images/user/vip.svg"
                    alt="VIP标识"
                    width={12}
                    height={12}
                    className="ml-2.5px"
                  />
                )}
              </div>
              <div className="text-2.75 font-500 lh-18px text-[#999]">
                {time2DateString(postDetail.updatedAt)}发布
              </div>
            </div>
          </div>
        </Link>

        {/* 统计信息 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <Image
              src="/images/special-column/heart 2.png"
              alt="点赞数"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
              {postDetail.likeCount}
            </span>
          </div>
          <div className="flex items-center">
            <Image
              src="/images/special-column/Preview-open.png"
              alt="阅读数"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
              {postDetail.readCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

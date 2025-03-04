"use client";
import React, { useMemo } from "react";
import PostCard from "@/app/_components/dashboard/special-column/PostCard";
import NoData from "@/app/_components/common/NoData";
import { type DetailPostCard } from "@/server/db/schema";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/useRedux";
import { setSearchTag, userColumnSelector } from "@/app/_slice/user-column-slice";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import { Skeleton } from "antd";

const SpecialColumnList = ({
  isSubscribe,
  postData,
  isPostDataLoading,
  isTagsLoading,
  tags,
}: {
  isSubscribe: boolean;
  isPostDataLoading: boolean;
  isTagsLoading: boolean;
  postData: DetailPostCard[];
  tags: string[];
}) => {
  const dispatch = useAppDispatch();
  const { searchTag } = useAppSelector(userColumnSelector);
  // 处理过滤后的文章列表
  const filteredPosts = useMemo(() => {
    if (!postData) return [];

    switch (searchTag) {
      case 'all':
      case 'free':
      case 'top':
        return postData;
      default:
        return postData.filter(item => item.tag?.split(",").includes(searchTag));
    }
  }, [postData, searchTag]);

  const getCategoryStyle = (tag: string) => ({
    backgroundColor: tag === searchTag ? "rgba(69,225,184,0.20)" : "#F5F7FB",
    color: tag === searchTag ? "#1DB48D" : "#999",
  });

  const getDisplayTag = (tag: string) => {
    switch (tag) {
      case 'all': return '全部';
      case 'free': return '免费';
      case 'top': return '置顶';
      default: return tag.length > 10 ? `${tag.substring(0, 10)}...` : tag;
    }
  };

  return (
    <div>
      <div className="mt-23px">
        {isTagsLoading ?
          <div className="flex gap-2 overflow-hidden px-2">
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
            <Skeleton.Button
              active
              size="small"
              className="!h-6 !w-12 rounded-4px"
            />
          </div>
          : <div className="flex overflow-scroll pb-1 pr-3 [&::-webkit-scrollbar]:h-2px [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
            {tags.map((tag) => (
              <div
                key={tag}
                className="text-3.25 font-not-italic font-400 lh-6 border-rd-1 ml-2 mr-2 h-6 shrink-0 pl-3 pr-3 text-center"
                onClick={() => dispatch(setSearchTag(tag))}
                style={getCategoryStyle(tag)}
              >
                {getDisplayTag(tag)}
              </div>
            ))}
          </div>}
      </div>

      {isPostDataLoading ?
        <LoadingSkeleton rows={4} count={5} />
        :
        filteredPosts.length === 0 ? (
          <NoData title="暂无数据噢😯~" />
        ) : (
          filteredPosts.map(item => (
            <PostCard
              key={item.id}
              postDetail={item}
              isSubscribe={isSubscribe}
            />
          ))
        )}
    </div>
  );
};

export default SpecialColumnList;
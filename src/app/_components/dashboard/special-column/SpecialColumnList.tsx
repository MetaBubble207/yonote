"use client";
import React, { useMemo } from "react";
import PostCard from "@/app/_components/dashboard/special-column/PostCard";
import NoData from "@/app/_components/common/NoData";
import { type DetailPostCard } from "@/server/db/schema";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/useRedux";
import { setSearchTag, userColumnSelector } from "@/app/_slice/user-column-slice";

const SpecialColumnList = ({
  isSubscribe,
  postData,
}: {
  isSubscribe: boolean;
  postData: DetailPostCard[];
}) => {
  const dispatch = useAppDispatch();
  const { searchTag } = useAppSelector(userColumnSelector);

  // 处理标签列表
  const tags = useMemo(() => {
    if (!postData.length) return ["all", "free", "top"];
    
    const customTags = postData
      .flatMap(item => item.tag ? item.tag.split(",").map(tag => tag.trim()) : [])
      .filter((item, index, self) => self.indexOf(item) === index && item !== "");

    return ["all", "free", "top", ...customTags];
  }, [postData]);

  // 处理过滤后的文章列表
  const filteredPosts = useMemo(() => {
    console.log('searchTag', searchTag)
    if (!postData) return [];
    
    switch (searchTag) {
      case 'all':
        return postData;
      case 'free':
        return postData.filter(item => item.isFree);
      case 'top':
        return postData.filter(item => item.isTop);
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
      <div className="mt-23px flex overflow-scroll pb-3 pr-3">
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
      </div>

      {filteredPosts.length === 0 ? (
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
"use client";
import React, { useEffect, useState } from "react";
import PostCard from "@/app/_components/dashboard/special-column/PostCard";
import NoData from "@/app/_components/common/NoData";
import { type DetailPostCard } from "@/server/db/schema";

const SpecialColumnList = ({
  status,
  postData,
}: {
  status: boolean;
  postData: DetailPostCard[];
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("全部");

  const [data, setData] = useState<{
    postList: DetailPostCard[];
    tags: string[];
  }>({ postList: [], tags: [] });
  useEffect(() => {
    let conditions = {
      isTop: null,
      isFree: null,
      tag: null,
    };

    // 根据activeCategory设置条件
    switch (activeCategory) {
      case "全部":
        break;
      case "免费":
        conditions.isFree = true;
        break;
      case "置顶":
        conditions.isTop = true;
        break;
      default:
        conditions.tag = activeCategory;
        break;
    }
    if (!postData) {
      return;
    }
    let res = [...postData];
    if (conditions.tag) {
      // 如果设置了tag条件，则过滤出包含该标签的项
      res = res.filter((item) => item.tag?.split(",").includes(conditions.tag));
    }
    if (conditions.isTop) {
      // 如果设置了isTop条件，则过滤出置顶的项
      res = res.filter((item) => item.isTop === true);
    }
    if (conditions.isFree) {
      // 如果设置了isFree条件，则过滤出免费的项
      res = res.filter((item) => item.isFree === true);
    }

    setData({
      postList: res,
      tags: [
        "全部",
        "免费",
        "置顶",
        ...postData.flatMap((item) =>
          item.tag ? item.tag.split(",").map((tag) => tag.trim()) : [],
        ),
      ].filter(
        (item, index, self) => self.indexOf(item) === index && item !== "",
      ),
    });
  }, [activeCategory, postData]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const getCategoryStyle = (category: string) => {
    if (category === activeCategory) {
      return {
        backgroundColor: "rgba(69,225,184,0.20)",
        color: "#1DB48D",
      };
    } else {
      return {
        backgroundColor: "#F5F7FB",
        color: "#999",
      };
    }
  };

  const PostList = () => {
    if (!data || data?.postList.length === 0)
      return <NoData title={"暂无数据噢😯~"} />;
    return (
      <>
        {data.postList.map((item) => (
          <PostCard key={item.id} postDetail={item} status={status} />
        ))}
      </>
    );
  };

  return (
    <div>
      <div className="mt-23px flex overflow-scroll pb-3 pr-3">
        {data?.tags?.map((item, index) => (
          <div
            key={index}
            className="bg-rgba(69,225,184,0.20) text-3.25 font-not-italic font-400 lh-6 border-rd-1 ml-2 mr-2 h-6 shrink-0 pl-3 pr-3 text-center text-[#1DB48D]"
            onClick={() => handleCategoryClick(item)}
            style={getCategoryStyle(item)}
          >
            {item.length > 10 ? item.substring(0, 10) + "..." : item}
          </div>
        ))}
      </div>
      <PostList />
    </div>
  );
};

export default SpecialColumnList;

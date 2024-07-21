"use client"
import { api } from "@/trpc/react";
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Suspense } from "react";
import { SpecialColumnCard } from "@/app/_components/special-column/SpecialColumnCard";
import Loading from "../common/Loading";


export const SortLabel = (props) => {
    const status = props.data;

    const [activeCategory, setActiveCategory] = useState<string>("全部");
    const params = useSearchParams();
    const columnId = params.get("id");
    const userId = api.column.getUserId.useQuery({ id: columnId }).data;
    const user = api.users.getOne.useQuery({ id: userId }).data;

    const tags = api.post.getPostTag.useQuery({
        columnId: columnId
    }).data

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
    };

    const getCategoryStyle = (category: string) => {
        if (category === activeCategory) {
            return {
                backgroundColor: 'rgba(69,225,184,0.20)',
                color: '#1DB48D'
            };
        } else {
            return {
                backgroundColor: '#F5F7FB',
                color: '#999'
            };
        }

    }
    const { data: postInfo, isFetched } = api.post.getAllInOrder.useQuery({
        columnId: columnId,
        limit: 100000,
        offset: 0,
        activeCategory: activeCategory,
    });
    const Body = () => {
        return <>
            <Suspense>
                {!isFetched ? <div className="relative w-full mt-7 bg-#fff h-100"><Loading></Loading></div> : null}
                {postInfo && postInfo.length > 0
                    && postInfo.map((item: any, index) => (
                        <SpecialColumnCard key={item.id} index={index} item={item} user={user} data={status} />
                    ))
                }
                {postInfo && postInfo.length === 0 && <div className="w-full flex pl-6 pt-3">暂无数据</div>}
            </Suspense>
        </>
    };

    return (
        <div>
            <div className="flex mt-23px overflow-scroll pr-3" >
                <div
                    className="pl-3 pr-3 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-2 mr-2 text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("全部")}
                    style={getCategoryStyle("全部")}
                >
                    全部
                </div>
                <div
                    className="pl-3 pr-3 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-2 mr-2 text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("免费")}
                    style={getCategoryStyle("免费")}
                >
                    免费
                </div>
                <div
                    className="pl-3 pr-3 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-2 mr-2 text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("置顶")}
                    style={getCategoryStyle("置顶")}
                >
                    置顶
                </div>
                {/* 自定义标签 */}
                {tags?.map((item, index) => (
                    <div
                        key={index}
                        className="h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-2 mr-2 text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1 pl-3 pr-3"
                        onClick={() => handleCategoryClick(item)}
                        style={getCategoryStyle(item)}
                    >
                        {/* {item.substring(0, 10)} */}
                        {item.length > 10 ? item.substring(0, 10) + "..." : item}
                    </div>
                ))}

            </div>
            <Body />

        </div>
    );

};

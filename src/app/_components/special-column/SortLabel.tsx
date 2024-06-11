"use client"
import { api } from "@/trpc/react";
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Suspense } from "react";
import { SpecialColumnCard } from "@/app/_components/special-column/SpecialColumnCard";


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
        // const sendData = () => {
        //     this.props.onData("Hello from Child");
        // }

        // const render=()=> {
        //     return <button onClick={this.sendData}>Send Data</button>;
        // }


    }
    const postInfo = api.post.getAllInOrder.useQuery({
        columnId: columnId,
        limit: 100000,
        offset: 0,
        activeCategory: activeCategory,
    }).data;
    const Body = () => {
        return <>
            <Suspense>
                {postInfo && postInfo.length > 0
                    && postInfo.map((item: any, index) => (
                        <SpecialColumnCard key={item.id} index={index} item={item} user={user} data={status} />
                    ))
                }
            </Suspense>
        </>
    };

    return (
        <div>
            <div className="flex mt-23px overflow-scroll pr-3">
                <div
                    className="w-15 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-24px text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("全部")}
                    style={getCategoryStyle("全部")}
                >
                    全部
                </div>
                <div
                    className="w-15 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-24px text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("免费")}
                    style={getCategoryStyle("免费")}
                >
                    免费
                </div>
                <div
                    className="w-15 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-24px text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("置顶")}
                    style={getCategoryStyle("置顶")}
                >
                    置顶
                </div>
                {/* 自定义标签 */}
                {tags?.map((item, index) => (
                    <div
                        key={index}
                        className="w-15 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-24px text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                        onClick={() => handleCategoryClick(item)}
                        style={getCategoryStyle(item)}
                    >
                        {item}
                    </div>
                ))}

            </div>
            <Body />

        </div>
    );

};

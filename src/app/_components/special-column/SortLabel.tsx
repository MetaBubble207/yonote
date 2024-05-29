"use client"
import React, { useState } from 'react';

export const SortLabel = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleCategoryClick = (category:string) => {
        setActiveCategory(category);
    };

    const getCategoryStyle = (category:string ) => {
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
    };

    return (
        <div>
            <div className="flex mt-23px">
                <div
                    className="w-15 h-6 shrink-0 bg-rgba(69,225,184,0.20) ml-24px text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("全部")}
                    style={getCategoryStyle("全部")}
                >
                    全部
                </div>
                <div
                    className="w-15 h-6 shrink-0 bg-#F5F7FB ml-24px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("免费")}
                    style={getCategoryStyle("免费")}
                >
                    免费
                </div>
                <div
                    className="w-15 h-6 shrink-0 bg-#F5F7FB ml-24px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("分类1")}
                    style={getCategoryStyle("分类1")}
                >
                    分类1
                </div>
                <div
                    className="w-15 h-6 shrink-0 bg-#F5F7FB ml-24px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1"
                    onClick={() => handleCategoryClick("分类2")}
                    style={getCategoryStyle("分类2")}
                >
                    分类2
                </div>
            </div>
        </div>
    );
};

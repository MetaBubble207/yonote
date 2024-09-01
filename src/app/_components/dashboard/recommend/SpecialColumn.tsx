"use client"
import React, {useEffect, useState} from "react"
import {Button, Skeleton} from "antd";
import Image from "next/image";
import ColumnCard from "@/app/_components/dashboard/find/ColumnCard";
import {api} from "@/trpc/react";
import type {DetailColumnCard} from "@/server/db/schema";

const SpecialColumn = () => {
    const [activeCategory, setActiveCategory] = useState<string>("默认");
    const [currentContent, setCurrentContent] = useState<number>(0);
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState<boolean>(true); // 默认为 true，表示倒序排序

    // 使用 useQuery 钩子获取数据
    const {data: columns, isLoading} = api.column.getColumnFilter.useQuery({conditions: currentContent});

    useEffect(() => {
        setData(columns);
    }, []);

    // 在数据加载完成时更新状态
    useEffect(() => {
        if (columns) {
            // 根据 sortOrder 设置 data 的值
            const sortedData = sortOrder ? [...columns].reverse() : columns;
            setData(sortedData);
        }
    }, [columns, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(!sortOrder);
    };

    return (
        <div>
            <Tabs/>
            <div>
                <Button type={'link'} size={'small'}
                        style={{display: 'flex', paddingLeft: '14px'}}
                        onClick={toggleSortOrder}>
                    <div className="mt-2 text-[#B5B5B5] text-2.5 font-400 lh-6">
                        {sortOrder ? "默认倒序排序" : "顺序排序"}
                    </div>
                    <Image
                        src={"/images/recommend/sort.svg"}
                        alt={"sort"}
                        width={12}
                        height={12}
                        className="w-3 h-3 mt-3.5 ml-1.25"
                    />
                </Button>
            </div>
            <List></List>
        </div>
    );

    function Tabs() {
        const handleCategoryClick = (category: string) => {
            setActiveCategory(category);
            let newConditions = 0
            switch (category) {
                case '默认':
                    newConditions = 0;
                    break;
                case '订阅量':
                    newConditions = 1;
                    break;
                case '内容量':
                    newConditions = 2;
                    break;
                case '发布时间':
                    newConditions = 3;
                    break
                case '创作时间':
                    newConditions = 4;
                    break;
            }
            setCurrentContent(newConditions);
        };

        const getCategoryStyle = (category: string) => {
            if (category === activeCategory) {
                return {
                    backgroundColor: 'rgba(69,225,184,0.20)',
                    color: '#1DB48D'
                };
            } else {
                return {
                    backgroundColor: '#FFFFFF',
                    color: '#999'
                };
            }
        };
        return <div className="pl-4 mt-6 flex w-full h-6">
            <div
                className={`h-6 shrink-0 text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px`}
                onClick={() => handleCategoryClick("默认")}
                style={getCategoryStyle("默认")}
            >
                默认
            </div>
            <div
                className={`h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px`}
                onClick={() => handleCategoryClick("订阅量")}
                style={getCategoryStyle("订阅量")}
            >
                订阅量
            </div>
            <div
                className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
                onClick={() => handleCategoryClick("内容量")}
                style={getCategoryStyle("内容量")}
            >

                内容量
            </div>
            <div
                className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
                onClick={() => handleCategoryClick("发布时间")}
                style={getCategoryStyle("发布时间")}
            >
                发布时间
            </div>
            <div
                className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
                onClick={() => handleCategoryClick("创作时间")}
                style={getCategoryStyle("创作时间")}
            >
                创作时间
            </div>
        </div>
    }

    function List() {
        if(isLoading) return <div className={'px-4'}>
            <Skeleton
                active
                paragraph={{rows: 4}}
                title={false}
                className="w-85.75 h-32 border-rd-5 bg-[#FFF] p4 mt-4"
            />
            <Skeleton
                active
                paragraph={{rows: 4}}
                title={false}
                className="w-85.75 h-32 border-rd-5 bg-[#FFF] p4 mt-4"
            />
            <Skeleton
                active
                paragraph={{rows: 4}}
                title={false}
                className="w-85.75 h-32 border-rd-5 bg-[#FFF] p4 mt-4"
            />
            <Skeleton
                active
                paragraph={{rows: 4}}
                title={false}
                className="w-85.75 h-32 border-rd-5 bg-[#FFF] p4 mt-4"
            />
            <Skeleton
                active
                paragraph={{rows: 4}}
                title={false}
                className="w-85.75 h-32 border-rd-5 bg-[#FFF] p4 mt-4"
            />
        </div>
        return <div>
            {data?.map((item) => (
                <div className="mt-4 flex justify-center" key={item.id}>
                    {/*// @ts-ignore*/}
                    <ColumnCard columnData={item}/>
                </div>
            ))}
        </div>
    }
}

export default SpecialColumn;

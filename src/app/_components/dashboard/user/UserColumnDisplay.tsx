"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "antd";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import type { ColumnSelect, UserSelect } from "@/server/db/schema";

interface ButtonInfo {
    id: number;
    label: string;
}

interface DisplayProps {
    columnInfo: ColumnSelect[] | undefined;
    isLoading: boolean;
    token: string | null;
    userInfo?: UserSelect | null;
}

export function UserColumnDisplay({ columnInfo, isLoading, token, userInfo }: DisplayProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const buttonInfos: ButtonInfo[] = [
        { id: 1, label: "专栏" },
        { id: 2, label: "小课" },
    ];

    const renderButtons = useCallback(() => {
        return buttonInfos.map((button, index) => (
            <div key={index}>
                <button
                    className={`mr-8 bg-transparent ${currentPage === button.id ? "text-#252525" : "text-#B5B5B5"}`}
                    onClick={() => setCurrentPage(button.id)}
                >
                    {button.label}
                </button>
                <div
                    className={`ml-2.25 w-2.75 rounded-2 mt-1 h-1 ${currentPage === button.id ? "bg-#45E1B8" : "bg-#FFF"}`}
                />
            </div>
        ));
    }, [currentPage]);

    const Card = ({ item }: { item: ColumnSelect }) => (
        <Link
            href={`/dashboard/special-column?id=${item.id}`}
            className="mb-4 flex"
            key={item.id}
        >
            <div className="w-15.5 h-19 relative">
                <Image
                    placeholder="blur"
                    blurDataURL={LoadingImage()}
                    src={item?.cover ?? NotImage()}
                    alt="cover"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded object-cover"
                />
            </div>
            <div>
                <div className="w-59.25 text-3.75 font-500 lh-6 ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    「{item?.name ?? "未知专栏"}」
                </div>
                <div className="w-59.25 text-#666 text-3.25 font-400 ml-3 mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item?.introduce ?? "暂无简介"}
                </div>
            </div>
        </Link>
    );

    const Column = () => {
        const filteredColumns = columnInfo?.filter(item => item.type === 0);
        if (!columnInfo || !filteredColumns?.length)
            return (
                <div className="mt-4 h-10 text-center text-[#B5B5B5]">
                    暂无数据哦~
                </div>
            );

        return filteredColumns.slice(0, Math.min(2, filteredColumns.length)).map(item => (
            <Card item={item} key={item.id} />
        ));
    };

    const Course = () => {
        const filteredColumns = columnInfo?.filter(item => item.type === 1);
        if (!columnInfo || !filteredColumns?.length)
            return (
                <div className="mt-4 h-10 text-center text-[#B5B5B5]">
                    暂无数据哦~
                </div>
            );

        return filteredColumns.slice(0, Math.min(2, filteredColumns.length)).map(item => (
            <Card item={item} key={item.id} />
        ));
    };

    if (!token || !userInfo) return null;
    if (!isLoading && (!columnInfo || columnInfo.length === 0)) return null;

    return (
        <div className="border-rd-2.5 bg-#FFF mb-2 w-full pb-2 pl-4 pt-4">
            <div className="flex">{renderButtons()}</div>
            <div className="mt-3">
                {isLoading ? (
                    <Skeleton
                        active
                        paragraph={{ rows: 4 }}
                        title={false}
                        className="border-rd-2.5 bg-#FFF mt-4 w-full pb-2 pl-4 pt-4"
                    />
                ) : currentPage === 1 ? (
                    <Column />
                ) : (
                    <Course />
                )}
            </div>
        </div>
    );
}
"use client"
import { BaseColumnCard } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import NoData from "../../common/NoData";
import Link from "next/link";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import Image from "next/image";
import { time2DateString } from "@/app/_utils/timeToString";
interface CardProps {
    item: BaseColumnCard;
}
const Card = ({ item }: CardProps) => (
    <Link href={`/dashboard/special-column?id=${item.id}`}>
        <div className="h-27 mt-10px border-rd-5 flex w-full items-center border-1 border-[rgba(181,181,181,0.20)] bg-[#FFF] p-2.5">
            <div className="w-17.25 h-23 relative">
                <Image
                    placeholder="blur"
                    blurDataURL={LoadingImage()}
                    src={item.cover ?? NotImage()}
                    alt="cover"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded-2 object-cover"
                />
            </div>
            <div className="ml-8px w-67%">
                <div
                    className="text-3.75 font-500 lh-6 h-12 text-[#252525] truncate"
                >
                    {item.name}
                </div>
                <div className="flex items-center">
                    <div>
                        <div className="flex items-center">
                            <div className="relative w-3.5 h-3.5">
                                <Image
                                    src={item.avatar ?? "/images/special-column/Ellipse 2.png"}
                                    alt={item.userName ?? "用户头像"}
                                    fill
                                    className="rounded-full"
                                />
                            </div>
                            <div className="text-2.75 font-500 lh-18px ml-5px text-[#999]">
                                {item.userName}
                            </div>
                            {item.idType === 1 && (
                                <Image
                                    src="/images/user/vip.svg"
                                    alt="认证标识"
                                    width={12}
                                    height={12}
                                    className="ml-1"
                                />
                            )}
                        </div>
                        <div className="text-2.75 font-500 lh-18px text-[#999]">
                            {time2DateString(item.createdAt)}发布
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Link>
);

// 提取列表组件
export default function SearchResultList({ searchValue }: {
    searchValue: string
}) {

    const { data, isLoading } = api.column.getColumnName.useQuery(
        { searchValue: searchValue },
        { enabled: Boolean(searchValue) }
    );
    if (isLoading) return <LoadingSkeleton className="mt-3" rows={3} count={5} />;

    if (!searchValue) {
        return (
            <div className="mt-10">
                <NoData title="请您搜索想要搜索的内容噢😁~" />
            </div>
        );
    }

    if (searchValue && (!data || data.length === 0)) {
        return (
            <div className="mt-10">
                <NoData title="没有找到相关的结果噢😯~" />
            </div>
        );
    }

    return (
        <>
            {data?.map((item) => (
                <Card key={item.id} item={item} />
            ))}
        </>
    );
};
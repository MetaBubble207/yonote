"use client";
import React from "react";
import {api} from "@/trpc/react";
import {useRouter, useSearchParams} from "next/navigation";
import SearchColumn from "@/app/_components/common/SearchColumn";
import Image from "next/image";
import Navbar from "@/app/_components/common/Navbar";
import {time2DateString} from "@/tools/timeToString";
import Link from "next/link";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import {Button, Skeleton} from "antd";
import NoData from "@/app/_components/common/NoData";

const Page = () => {
    const params = useSearchParams();
    const searchValue = params.get('query');

    const router = useRouter();

    const {data, isLoading} = api.column.getColumnName.useQuery(
        {searchValue: searchValue},
        {enabled: Boolean(searchValue)} // Enable query if searchValue is present
    );

    const handleButtonClick = () => {
        router.push(`/dashboard/find`);
    };

    return (
        <div className="min-h-screen relative bg-#F5F7FB">
            <div className="w-85.75 m-auto pt-8">
                {/* 搜索框和取消按钮 */}
                <div className={"flex items-center justify-between"}>
                    <SearchColumn defaultValue={searchValue}></SearchColumn>
                    <Button style={{color: '#252525', padding: 0}} type={'link'} className={'ml-5'}
                            onClick={handleButtonClick}>取消</Button>
                </div>
                <List/>
            </div>
            <div className="bottom-4 justify-center w-full fixed z-2">
                <Navbar/>
            </div>
        </div>
    );

    function List() {
        if (isLoading) return <>
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="w-100% h-27 mt-10px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] p2.5"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="w-100% h-27 mt-10px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] p2.5"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="w-100% h-27 mt-10px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] p2.5"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="w-100% h-27 mt-10px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] p2.5"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="w-100% h-27 mt-10px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] p2.5"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="w-100% h-27 mt-10px border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] p2.5"
            />

        </>
        if (!searchValue) return <div className={'mt-10'}>
            <NoData title={'请您搜索想要搜索的内容噢😁~'}></NoData>
        </div>

        if (searchValue && data.length === 0) return <div className={'mt-10'}>
            <NoData title={'没有找到相关的结果噢😯~'}></NoData>
        </div>

        return <>
            {data.map(item => (
                <div key={item.id}>
                    <Card item={item}/>
                </div>
            ))}
        </>

    }

    function Card({item}) {
        return <Link href={`/dashboard/special-column?id=${item.id}`}>
            <div
                className={"w-full flex items-start items-center h-27 mt-10px border-rd-5 " +
                    "border-1 border-[rgba(181,181,181,0.20)] bg-[#FFF] p-2.5"}>
                {/* 左边图片 */}
                <div className="relative w-17.25 h-23">
                    <Image
                        placeholder="blur"
                        blurDataURL={DefaultLoadingPicture()}
                        src={item.cover ?? DefaultLoadingPicture()}
                        alt='cover'
                        quality={100}
                        fill
                        loading='lazy'
                        className='rounded-2 object-cover '
                    />
                </div>
                {/* 右边文字 */}
                <div className={"ml-8px w-67% "}>
                    <div className={" text-[#252525] h-12 text-3.75 font-500 lh-6 text-3.75 "}
                         style={{
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap'
                         }}>
                        {item.name}
                    </div>
                    {/* 右边图标 */}
                    <div className="flex items-center">
                        <div>
                            <div className={"flex items-center"}>
                                {/* 左边头像 */}
                                <div className={""}>
                                    <div>
                                        <Image src={"/images/special-column/Ellipse 2.png"}
                                               alt={"心智与阅读"} width={14} height={14}/>
                                    </div>
                                </div>
                                <div
                                    className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>{item.user?.name}</div>
                                {
                                    item.user?.idType === 1 &&
                                    <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12}
                                           height={12} className={"ml-1"}/>
                                }

                            </div>
                            <div
                                className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px"}>{time2DateString(item.createdAt)}发布
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    }
}

export default Page;

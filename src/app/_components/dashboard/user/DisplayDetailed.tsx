'use client'
import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import {api} from "@/trpc/react";
import {Button, Skeleton} from "antd";
import Loading from "@/app/_components/common/Loading";
import NoData from "@/app/_components/common/NoData";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const DisplayDetailed = (props) => {
    const {token, userInfo} = props
    // 导航栏返回响应页面
    const [currentPage, setCurrentPage] = useState<number>(1)

    return <>
        {/* 订阅数量展示 */}
        <StatsDisplayList/>
        {/* 专栏、小课区域 */}
        <div className="rounded-2.5 ml-8 mr-8 mt-4">
            {/* 导航区域 */}
            <Tabs/>
            {/* 内容区域 */}
            <RenderContent/>
        </div>
    </>

    function StatsDisplayList() {
        // 订阅数量
        const subscribeInfos = api.order.getUserOrder.useQuery({userId: userInfo.id}).data
        const {data: columnInfos} =
            api.column.getAllByUserId.useQuery({userId: userInfo.id});
        // 帖子数量
        const postLength = api.post.getNumById.useQuery({id: userInfo.id}).data

        return <div className={'w-full flex justify-center space-x-14 text-neutral text-4 font-bold leading-6'}>
            <StatsDisplay stat={'订阅'} length={subscribeInfos?.length}></StatsDisplay>
            <StatsDisplay stat={'专栏'} length={columnInfos?.length}></StatsDisplay>
            <StatsDisplay stat={'内容'} length={postLength}></StatsDisplay>
        </div>
    }

    function StatsDisplay({length, stat}: { length: number, stat: string }) {
        return <div className="flex flex-col items-center">
            {length || 0}
            <h2 className="text-[#999] text-3 font-normal leading-6">{stat}</h2>
        </div>
    }

    function Tabs() {
        const buttonInfos = [
            {id: 1, label: '更新'},
            {id: 2, label: '专栏'},
            {id: 3, label: '小课'},
        ]

        const handleButtonClick = (button: number) => {
            if (currentPage !== button) {
                setCurrentPage(button)
            }
        }

        return <div className="flex mb-6">
            {buttonInfos.map((button, index) => (
                <div key={index} className={"flex-col"}>
                    <Button type="link" size={'small'}
                            className={`mr-8`}
                            style={{padding: 0}}
                            onClick={() => {
                                handleButtonClick(button.id)
                            }}
                    >
                        {button.label}</Button>
                    <div className={`ml-2.25 mt-1 w-2.75 h-1 rounded-2  
                                     ${currentPage === button.id ? 'bg-primary' : 'bg-#FFF'}`}/>
                </div>
            ))}

        </div>
    }

    // 渲染按钮下对应的局部页面
    function RenderContent() {
        switch (currentPage) {
            case 1:
                return <Update/>;
            case 2:
                return <Column/>;
            case 3:
                return <NoData title={"没有查找到数据噢😯~"}/>;

        }
    }

    function Update() {
        const {data: updateColumnInfos, isLoading: isUpdateColumnInfoLoading} =
            api.column.getUpdate.useQuery({
                writerId: userInfo.id,
                visitorId: token
            });

        if (isUpdateColumnInfoLoading) return <>
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
        </>

        if (updateColumnInfos?.length < 1) return <NoData title={"你已经阅读完该作者所有的帖子了噢😁~"}/>

        return updateColumnInfos.map(item => <ColumnCard {...item} key={item.id}/>)
    }

    function Column() {
        const {data: columnInfos, isLoading: isColumnInfoLoading} =
            api.column.getAllByUserId.useQuery({userId: userInfo.id});

        if (isColumnInfoLoading) return <>
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
            <Skeleton
                active
                paragraph={{rows: 3}}
                title={false}
                className="mb-4 h-19 border-rd-4"
            />
        </>

        return columnInfos.map(item => <ColumnCard {...item} key={item.id}/>)
    }

    function ColumnCard({id, cover, name, introduce}: any) {
        return <Link href={`/dashboard/special-column?id=${id}`} className="flex mb-4">
            <div className="relative w-15.5 h-19">
                <Image
                    placeholder="blur"
                    blurDataURL={DefaultLoadingPicture()}
                    src={cover ?? DefaultLoadingPicture()}
                    alt='cover'
                    quality={100}
                    fill
                    loading='lazy'
                    className='rounded object-cover '
                />
            </div>
            <div>
                <div className="ml-2 w-59.25 text-3.75 font-500 lh-6 text-ellipsis whitespace-nowrap overflow-hidden">
                    {/*「心智与阅读」*/}
                    「{name ?? "未知专栏"}」
                </div>
                <div
                    className='w-59.25 text-#666 text-3.25 font-400 ml-3 mt-2 text-ellipsis whitespace-nowrap overflow-hidden'>
                    {introduce ?? "暂无数据"}
                </div>
            </div>
        </Link>
    }

}

export default DisplayDetailed

'use client'
import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import {api} from "@/trpc/react";
import {Button} from "antd";
import Loading from "@/app/_components/common/Loading";
import NoData from "@/app/_components/common/NoData";

const DisplayDetailed = (props) => {
    const {token, userInfo} = props
    // 导航栏返回响应页面
    const [currentPage, setCurrentPage] = useState<number>(1)
    const {data: columnInfos, isLoading: isColumnInfoLoading} = api.column.getAllByUserId.useQuery({userId: token});
    // 订阅数量
    const subscribeInfos = api.order.getUserOrder.useQuery({userId: token}).data
    // 帖子数量
    const postLength = api.post.getNumById.useQuery({id: userInfo?.id}).data
    if (isColumnInfoLoading) return <Loading/>
    // 渲染按钮下对应的局部页面
    const RenderContent = () => {
        console.log(currentPage,"123")
        switch (currentPage) {
            case 1:
                return <Update/>;
            case 2:
                return <Column/>;
            case 3:
                return <NoData/>;

        }
    }

    const Update = () => {
        return columnInfos.map(item => <ColumnCard {...item} key={item.id}/>)
    }

    const Column = () => {
        return columnInfos.map(item => <ColumnCard {...item} key={item.id}/>)
    }
    const ColumnCard = ({id, logo, name, introduce}: any) => {
        return <Link href={`/special-column?id=${id}`} className="flex mb-4">
            <Image
                src={logo ?? '/images/user/avatar.svg'}
                alt="icon"
                width={74}
                height={100}
                className="rounded object-cover"
                unoptimized
            />
            <div>
                <h2 className="ml-2 w-33.81125 text-3.75 font-500 lh-6 text-ellipsis whitespace-nowrap overflow-hidden">
                    {/*「心智与阅读」*/}
                    「{name ?? "未知专栏"}」
                </h2>
                <p
                    className='w-59.25 text-#666 text-3.25 font-400 ml-3 mt-2 text-ellipsis whitespace-nowrap overflow-hidden'
                >
                    {introduce ?? "暂无数据"}
                </p>
            </div>
        </Link>
    }

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

    const Tabs = () => {
        return <div className="flex mb-6">
            {buttonInfos.map((button, index) => (
                <div key={index} className={"flex-col"}>
                    <Button type="link" size={'small'}
                            className={`mr-8  text-neutral text-3.5 font-500 lh-6 p0`}
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

    const StatsDisplay = ({length, stat}: { length: number, stat: string }) => {
        return <div className="flex flex-col items-center">
            {length || 0}
            <h2 className="text-[#999] text-3 font-normal leading-6">{stat}</h2>
        </div>
    }
    return <>
        {/* 订阅数量展示 */}
        {/* 订阅数量展示 */}
        <div className="w-full flex justify-center space-x-14 text-neutral text-4 font-bold leading-6">
            {/* 订阅数量 */}
            <StatsDisplay stat={'订阅'} length={subscribeInfos?.length}></StatsDisplay>
            <StatsDisplay stat={'专栏'} length={columnInfos?.length}></StatsDisplay>
            <StatsDisplay stat={'内容'} length={postLength}></StatsDisplay>
        </div>
        {/* 专栏、小课区域 */}
        <div className="rounded-2.5 ml-8 mr-8 mt-4">
            {/* 导航区域 */}
            <Tabs/>
            {/* 内容区域 */}
            <RenderContent/>
        </div>


    </>
}
export default DisplayDetailed
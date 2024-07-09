'use client'
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { api } from "@/trpc/react";
import Loading from "../common/Loading";

const Display = (props: { token: string; ColumnInfo: any }) => {
    const { token, ColumnInfo } = props
    // console.log("token============>",token);
    // console.log("ColumnInfo",ColumnInfo);
    console.log("length==============>", ColumnInfo?.length);
    // const columnInfo = api.column.getAll.useQuery().data
    // console.log(columnInfo)


    const buttonInfos = [
        { id: 1, label: '专栏' },
        { id: 2, label: '小课' }
    ]

    const renderContent = () => {
        switch (currentPage) {
            case 1:
                return <Column />;
            case 2:
                return <Course />;

        }
    };
    const handleButtonClick = (button: number) => {
        if (selectButton !== button) {
            setSelectButton(button)
        }
    }

    const renderButtons = () => {
        return buttonInfos.map((button, index) => (
            <div key={index} className={"flex-col"}>
                <button
                    className={` text-3.5 font-500 lh-6 mr-8 ${selectButton === button.id ? "text-[#252525]" : "text-[#B5B5B5]"} `}
                    onClick={() => setCurrentPage(button.id)}
                    onClickCapture={() => handleButtonClick(button.id)}
                >
                    {button.label}
                </button>
                <div
                    className={`ml-2.25 mt-1 w-2.75 h-1 border-rd-2  ${selectButton === button.id ? 'bg-[#45E1B8]' : 'bg-[#FFF]'}`}
                ></div>
            </div>
        ))
    }
    //
    const renderColumn = () => {
        return ColumnInfo?.length > 0 && (
            ColumnInfo?.slice(0, ColumnInfo?.length > 1 ? 2 : 1).map((item, index) => (
                <Link href={`/special-column?id=${item.id}`} className="flex h-14 mb-8" key={item.id}>
                    <div className="relative w-15.5 h-19">
                        <Image
                            placeholder="blur"
                            blurDataURL={item?.logo ?? '/images/user/cover.svg'}
                            src={item?.logo ?? '/images/user/cover.svg'}
                            alt="icon"
                            className="rounded"
                            objectFit="cover"
                            quality={100}
                            layout="fill"
                            // style={{ objectFit: "cover" }}
                            // src="/images/user/cover.svg"
                            // src={Column.logo}
                            // src={'http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png'}
                            
                            // width={74}
                            // height={100}
                            // className="w-15.5 h-19 rounded"
                        />
                    </div>


                    <div>
                        <h2
                            className="ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {/*「心智与阅读」*/}
                            「{item?.name ?? "未知专栏"}」
                        </h2>

                        <p
                            className='w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {item?.introduce ?? "暂无数据"}
                        </p>
                    </div>

                </Link>
            ))
        )
    }
    // return ColumnInfo.map((item,index)=>(
    //     <>
    //
    //     </>
    // ))


    // 按钮选中状态
    const [selectButton, setSelectButton] = useState<number>(1)

    // 导航栏返回响应页面
    const [currentPage, setCurrentPage] = useState<number>(1)

    // 小课
    const Course = () => {
        return (
            <div className={'flex justify-center items-center'}>
                <div className="text-center text-[#B5B5B5] mt-4 h-10">暂无数据哦~</div>
                {/* <h1>暂无数据</h1> */}
                {/*<div className="flex h-14 mb-8">*/}
                {/*    <Image*/}
                {/*        src="/images/user/cover.svg"*/}
                {/*        alt="icon"*/}
                {/*        width={14}*/}
                {/*        height={14}*/}
                {/*        className="w-15.5 h-19"*/}
                {/*    />*/}
                {/*    <div>*/}
                {/*        <h2*/}
                {/*            className={*/}
                {/*                "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"*/}
                {/*            }*/}
                {/*        >*/}
                {/*            /!*「心智与阅读」*!/*/}
                {/*            「心智与阅读」*/}
                {/*        </h2>*/}
                {/*        <p*/}
                {/*            className={*/}
                {/*                'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'*/}
                {/*            }*/}
                {/*        >*/}
                {/*            情绪价值波动，上上签，愤怒，变化，偏执，创造*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="flex h-14 ">*/}
                {/*    <Image*/}
                {/*        src="/images/user/cover.svg"*/}
                {/*        alt="icon"*/}
                {/*        width={14}*/}
                {/*        height={14}*/}
                {/*        className="w-15.5 h-19"*/}
                {/*    />*/}
                {/*    <div>*/}
                {/*        <h2*/}
                {/*            className={*/}
                {/*                "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"*/}
                {/*            }*/}
                {/*        >*/}
                {/*            「心智与阅读」*/}
                {/*        </h2>*/}
                {/*        <p*/}
                {/*            className={*/}
                {/*                'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'*/}
                {/*            }*/}
                {/*        >*/}
                {/*            情绪价值波动，上上签，愤怒，变化，偏执，创造*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

        )
    }


    // 专栏
    const Column = () => {
        return (

            renderColumn()

        )
    }


    return (
        <>
            <div className="w-full pb-2 border-rd-2.5 bg-#FFF pl-4 pt-4 mt-4">

                {/* 导航区域 */}
                <div className="flex ">
                    {renderButtons()}

                </div>
                {/*<Nav></Nav>*/}
                {/*内容区域*/}
                <div className='mt-3'>
                    {ColumnInfo && renderContent()}
                    {!ColumnInfo && Loading()}
                    {ColumnInfo.length === 0 && <div className="flex justify-center items-center text-xs text-gray-500">暂无数据</div>}
                </div>
            </div>
        </>
    )
}
export default Display

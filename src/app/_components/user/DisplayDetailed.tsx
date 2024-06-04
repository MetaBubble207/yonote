'use client'
import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import {api} from "@/trpc/react";

const DisplayDetailed = (props) => {
    const {token, userInfo} = props

    // 按钮选中状态
    const [selectButton, setSelectButton] = useState<number>(1)

    // 导航栏返回响应页面
    const [currentPage, setCurrentPage] = useState<number>(1)
    const columnInfos = api.column.getAllByUserId.useQuery({userId:token }).data
    console.log(columnInfos)




    // 订阅数量
    // const subscribeInfos = api.order.getColumnByBuyer.useQuery({BuyerID:token}).data
    const subscribeInfos = api.order.getUserOrder.useQuery({userID:token}).data


    const postLength = api.post.getNumById.useQuery({id:userInfo?.id}).data
    // console.log("====================>",subscribe.length)


    const buttonInfos = [
        {id: 1, label: '更新'},
        {id: 2, label: '专栏'},
        {id: 3, label: '小课'},
    ]

    const handleButtonClick = (button: number) => {
        if (selectButton !== button) {
            setSelectButton(button)
        }
    }

    // 渲染按钮下对应的局部页面
    const renderContent = () => {
        switch (currentPage) {
            case 1:
                return <Update></Update>;
            case 2:
                return <Column></Column>;
            case 3:
                return <Course></Course>;

        }
    }

    const Update = () => {
        return (
            columnInfos?.length > 0 && (
                columnInfos.map((item, index) => (
                    <Link href={`/special-column?id=${item.id}`} className="flex h-14 mb-8">
                        <Image
                            // src="/images/user/cover.svg"
                            // src={Column.logo}
                            // src={'http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png'}
                            src={item?.logo}
                            alt="icon"
                            width={74}
                            height={100}
                            className="w-15.5 h-19 rounded"

                        />
                        <div>
                            <h2
                                className={
                                    "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"
                                }
                            >
                                {/*「心智与阅读」*/}
                                「{item?.name}」
                            </h2>
                            <p
                                className={
                                    'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'
                                }
                            >
                                {item?.introduce}
                            </p>
                        </div>

                    </Link>
                ))
            ))
        // <div>
        //     <div className="flex h-14 mt-6">
        //         <Image src="/images/user/cover.svg" alt="icon" width={14} height={14}
        //                className="w-15.5 h-19"/>
        //         <div>
        //             <h2 className={"ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"}>「心智与阅读」</h2>
        //             <p className={"w-59.25 text-[#666] font-\"Source Han Sans SC\" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>
        //         </div>
        //     </div>
        //     <div className="flex h-14 mt-8">
        //         <Image src="/images/user/cover.svg" alt="icon" width={14} height={14}
        //                className="w-15.5 h-19"/>
        //         <div>
        //             <h2 className={"ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"}>「心智与阅读」</h2>
        //             <p className={"w-59.25 text-[#666] font-\"Source Han Sans SC\" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>
        //         </div>
        //     </div>
        // </div>
    }

    // const renderColumn = () => {
    //     return ColumnInfo.length > 0 && (
    //         ColumnInfo.slice(0,ColumnInfo.length>1?2:1).map((item, index) => (
    //             <Link href={`/special-column?id=${item.id}`} className="flex h-14 mb-8">
    //                 <Image
    //                     // src="/images/user/cover.svg"
    //                     // src={Column.logo}
    //                     // src={'http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png'}
    //                     src={item?.logo}
    //                     alt="icon"
    //                     width={74}
    //                     height={100}
    //                     className="w-15.5 h-19 rounded"
    //
    //                 />
    //                 <div>
    //                     <h2
    //                         className={
    //                             "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"
    //                         }
    //                     >
    //                         {/*「心智与阅读」*/}
    //                         「{item?.name}」
    //                     </h2>
    //                     <p
    //                         className={
    //                             'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'
    //                         }
    //                     >
    //                         {item?.introduce}
    //                     </p>
    //                 </div>
    //
    //             </Link>
    //         ))
    //     )
    // }



    const Column = () => {
        return columnInfos.length > 0 && (
            columnInfos.map((item, index) => (
                <Link href={`/special-column?id=${item.id}`} className="flex h-14 mb-8">
                    <Image
                        // src="/images/user/cover.svg"
                        // src={Column.logo}
                        // src={'http://yo-note.oss-cn-shenzhen.aliyuncs.com/%E5%8F%AF%E8%BE%BE%E9%B8%AD2.png'}
                        src={item?.logo}
                        alt="icon"
                        width={74}
                        height={100}
                        className="w-15.5 h-19 rounded"

                    />
                    <div>
                        <h2
                            className={
                                "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"
                            }
                        >
                            {/*「心智与阅读」*/}
                            「{item?.name}」
                        </h2>
                        <p
                            className={
                                'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'
                            }
                        >
                            {item?.introduce}
                        </p>
                    </div>

                </Link>
            ))
        )

    }
    const Course = () => {
        return <div className={'flex items-center justify-center mt-8'}>
            <h1>暂无数据</h1>
        </div>
    }

    const renderButtons = () => {
        return <div className="flex mb-8">
            {/*<button*/}
            {/*    className="w-7 h-6 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6">更新*/}
            {/*</button>*/}

            {/*<button*/}
            {/*    className="w-7 h-6 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6">专栏*/}
            {/*</button>*/}

            {buttonInfos.map((button, index) => (
                <div key={index} className={"flex-col"}>
                    <button
                        className={`text-[#252525] w-7 h-6 mr-8 text-3.5 font-500 lh-6`}
                        onClick={() => {
                            setCurrentPage(button.id)
                        }}
                        onClickCapture={() => handleButtonClick(button.id)}
                    >
                        {button.label}</button>
                    <div
                        className={`ml-2.25 mt-1 w-2.75 h-1 border-rd-2  ${selectButton === button.id ? 'bg-[#45E1B8]' : 'bg-[#FFF]'}`}></div>
                </div>
            ))}

        </div>
    }


    const Content = () => {
        return renderContent()
    }
    return <>
        {/* 订阅数量展示 */}
        <div className={"mt-24.5 w-full flex justify-center"}>
            <div className={"flex flex-col items-center "}>
                <p className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6"}>{subscribeInfos?.length?subscribeInfos.length:" "}</p>
                <h2 className={"w-6.5 h-4.75 shrink-0 text-[#999] text-3 font-400 lh-6"}>订阅</h2>
            </div>
            <div className={"flex flex-col items-center ml-14"}>
                <p className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6"}>{columnInfos?.length?columnInfos.length:" "}</p>
                <h2 className={"w-6.5 h-4.75 shrink-0 text-[#999] text-3 font-400 lh-6"}>专栏</h2>
            </div>
            <div className={"flex flex-col items-center ml-14"}>
                <p className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6"}>{postLength?postLength:'0'}</p>
                <h2 className={"w-6.5 h-4.75 shrink-0 text-[#999] text-3 font-400 lh-6"}>内容</h2>
            </div>
        </div>


        {/* 专栏、小课区域 */}
        <div className="w-85.75 h-63.75 border-rd-2.5 bg-#FFF ml-4 pl-4 pt-4 mt-4">

            {/* 导航区域 */}
            {renderButtons()}

            {/* 内容区域 */}
            <Content></Content>

        </div>


    </>
}
export default DisplayDetailed
'use client'
import Link from "next/link";
import Image from "next/image";
import React, {useState} from "react";
import {api} from "@/trpc/react";

const Display = ()=>{

    const columnInfo = api.column.getAll.useQuery().data
    console.log(columnInfo)


    const buttonInfos = [
        {id: 1,label: '小课'},
        {id: 2,label: '专栏'}
    ]

    const renderContent = ()=> {
        switch (currentPage) {
            case 1:
                return <Course/>;
            case 2:
                return <Column/>;

        }
    };
    const handleButtonClick=(button:number)=>{
        if(selectButton !== button){
            setSelectButton(button)
        }
    }

    const renderButtons = ()=>{
        return buttonInfos.map((button,index)=> (
            <div key={index} className={"flex-col"}>
                <button
                    className="text-[#252525] text-3.5 font-500 lh-6 mr-8"
                    onClick={()=>setCurrentPage(button.id)}
                    onClickCapture={()=>handleButtonClick(button.id)}

                >
                    {button.label}
                </button>
                <div
                    className={`ml-2.25 mt-1 w-2.75 h-1 border-rd-2  ${selectButton===button.id ? 'bg-[#45E1B8]':'bg-[#FFF]'}`}
                ></div>
            </div>
        ))
    }

    // 按钮选中状态
    const [selectButton, setSelectButton] = useState<number>(1)

    // 导航栏返回响应页面
    const [currentPage, setCurrentPage] = useState<number>(1)

    // 专栏
    const Column = () => {
        return (
            <div>
                <div className="flex h-14 mt-8">
                    <Image
                        src="/images/user/cover.svg"
                        alt="icon"
                        width={14}
                        height={14}
                        className="w-15.5 h-19"
                    />
                    <div>
                        <h2
                            className={
                                "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"
                            }
                        >
                            「心智与阅读」
                        </h2>
                        <p
                            className={
                                'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'
                            }
                        >
                            情绪价值波动，上上签，愤怒，变化，偏执，创造
                        </p>
                    </div>
                </div>
                <div className="flex h-14 mt-8">
                    <Image
                        src="/images/user/cover.svg"
                        alt="icon"
                        width={14}
                        height={14}
                        className="w-15.5 h-19"
                    />
                    <div>
                        <h2
                            className={
                                "ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"
                            }
                        >
                            「心智与阅读」
                        </h2>
                        <p
                            className={
                                'w-59.25 text-[#666] font-"Source Han Sans SC" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2'
                            }
                        >
                            情绪价值波动，上上签，愤怒，变化，偏执，创造
                        </p>
                    </div>
                </div>
            </div>

        )
    }


    // 专栏和小课按钮
    // const Nav = () => {
    //     return (
    //         <div className="flex ">
    //             <button
    //                 className="w-7 h-6 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6"
    //             >
    //                 专栏
    //             </button>
    //
    //             <div className={"flex-col"}>
    //                 <button className="text-[#252525] text-3.5 font-500 lh-6 mr-8">
    //                     小课
    //                 </button>
    //
    //                 <div
    //                     className={"ml-2.25 mt-1 w-2.75 h-1 border-rd-2 bg-[#45E1B8]"}
    //                 ></div>
    //             </div>
    //
    //         </div>
    //     )
    // }


    // 小课
    const Course = () => {
        return (
            <>
                <h1>111</h1>
            </>
        )
    }




    return (
        <>

            {/* 导航区域 */}
            <div className="flex ">
                {renderButtons()}

            </div>
            {/*<Nav></Nav>*/}
            {/*内容区域*/}
            {renderContent()}

        </>
    )
}
export default Display

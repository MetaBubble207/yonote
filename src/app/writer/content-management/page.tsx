"use client";
import React, {useRef, useState} from 'react';
import MyPagination from '@/app/_components/writer/pagination/MyPagination';
import Date from "@/app/_components/writer/datarange/Date";
import ContentForm from "@/app/_components/writer/ContentForm";
import Link from 'next/link';
import {useSearchParams} from "next/navigation";

const Page = () => {
    let columnId;

    if (typeof window !== "undefined") {
        const params = useSearchParams();
        columnId = params.get("columnId");
    }

    const titleRef = useRef(null);
    const tagRef = useRef(null);
    const [searchParams, setSearchParams] = useState({title: "", tag: ""});

    const handleSearch = () => {
        const titleValue = titleRef.current.value;
        const tagValue = tagRef.current.value;
        console.log("内容标题:", titleValue);
        console.log("标签:", tagValue);
        setSearchParams({title: titleValue, tag: tagValue});
    };

    return (
        <div className={'w-full h-full mt-16px ml-18px'}>
            <div className={'w-97% min-h-155 shrink-0 border-rd-[10px_10px_10px_10px] bg-[#FFF] relative pb-120px'}>
                <div className={'flex items-center pt-51px '}>
                    <div className="text-[#323232] text-4 font-not-italic font-700 lh-6 ml-32.5px">内容管理</div>
                    {/*发布*/}
                    <Link href={`/edit/edit?columnId=${columnId}`}
                          className={'inline-block h-32px border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1db48d] px-16px lh-32px ml-32px'}>+
                        发布</Link>
                </div>

                {/*justify-between*/}
                <div className={'flex ml-32.5px mt-30px'}>
                    <div>
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>内容标题: </label>
                        <input
                            className='ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                            type="text"
                            placeholder="搜索标题"
                            ref={titleRef}
                        />
                    </div>

                    <div className={'ml-32px'}>
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>标签: </label>
                        <input
                            className='ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                            type="text"
                            placeholder="不限"
                            ref={tagRef}
                        />
                    </div>
                    <div className={"flex items-center ml-32px"}>
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 mr-10px'>发布时间: </label>
                        <Date></Date>
                    </div>
                    <button
                        className={'inline-block h-32px border-rd-1 bg-[#1DB48D] text-[#fff] px-16px font-400 text-3.5 lh-32px mx-56px'}
                        onClick={handleSearch}
                    >
                        查询
                    </button>
                </div>

                {/*表格*/}
                <ContentForm title={searchParams.title} tag={searchParams.tag}/>

                {/*底部分页*/}
                <div className={'absolute bottom-10 left-60 flex justify-center items-center'}>
                    {/*<MyPagination/>*/}
                </div>
            </div>
        </div>
    );
};

export default Page;

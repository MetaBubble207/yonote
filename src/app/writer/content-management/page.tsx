"use client";
import React, {useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from "next/navigation";
import {Button, DatePicker} from "antd";
import {api} from "@/trpc/react";
import './table.css'
import TableComponent from "@/app/_components/writer/content/TableComponent";
import dayjs from "dayjs";

const Page = () => {
    const params = useSearchParams();
    const columnId = params.get("columnId");
    const {data: posts} = api.post.getAll.useQuery({columnId: columnId}, {enabled: Boolean(columnId)});
    const [searchParams, setSearchParams] = useState({
        title: '',
        tag: '',
        dateStart: null,
        dateEnd: null,
    })

    return (
        <div className={'w-full rounded-2.5 bg-[#FFF] pl-8 pr-9'}>
            <div className={'flex items-center pt-51px'}>
                <div className="text-[#323232] text-4 font-not-italic font-700 lh-6">内容管理</div>
                {/*发布*/}
                <Link href={`/edit/edit?columnId=${columnId}`}
                      className={'inline-block h-32px border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1db48d] px-16px lh-32px ml-32px'}>+
                    发布</Link>
            </div>
            <ConditionalFiltering/>
            {/*表格*/}
            <div className={"mt-4"}>
                {/*@ts-ignore*/}
                <TableComponent dataSource={posts}/>
            </div>
        </div>
    );

    function ConditionalFiltering() {
        const dateFormat = 'YYYY/MM/DD';

        const handleSearch = () => {
            console.log(searchParams);
        };

        const onTitleChange = (e) => {
            setSearchParams(prev => {
                prev.title = e.target.value;
                return prev;
            })
        }

        const onTagChange = (e) => {
            setSearchParams(prev => {
                prev.tag = e.target.value;
                return prev;
            })
        }

        const onDateChange = (date) => {
            const [date1, date2] = date;
            setSearchParams(prev => {
                prev.dateStart = new Date(date1.$d)
                prev.dateEnd = new Date(date2.$d)
                return prev;
            })
        }

        const disabledDate = (currentDate, info) => {
            return currentDate.isAfter(dayjs(), 'day');
        };
        return (
            <div className={'flex mt-30px'}>
                <div>
                    <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>内容标题: </label>
                    <input
                        className='ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                        type="text"
                        placeholder="搜索标题"
                        onBlur={onTitleChange}
                    />
                </div>

                <div className={'ml-32px'}>
                    <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>标签: </label>
                    <input
                        className='ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                        type="text"
                        placeholder="不限"
                        onBlur={onTagChange}
                    />
                </div>
                <div className={"flex items-center ml-32px"}>
                    <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 mr-10px'>发布时间: </label>
                    {/*<Date></Date>*/}
                    <DatePicker.RangePicker
                        format={dateFormat}
                        onChange={onDateChange}
                        disabledDate={(currentDate, info) => disabledDate(currentDate, info)}
                    />
                </div>
                <Button
                    className={'p0 b-0 h-32px border-rd-1 bg-[#1DB48D] text-[#fff] px-16px font-400 text-3.5 lh-32px mx-56px'}
                    onClick={handleSearch}
                >
                    查询
                </Button>
            </div>
        )
    }
};

export default Page;

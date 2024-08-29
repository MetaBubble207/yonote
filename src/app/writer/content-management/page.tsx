"use client";
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from "next/navigation";
import {Button, DatePicker, Input} from "antd";
import {api} from "@/trpc/react";
import TableComponent from "@/app/_components/writer/content/TableComponent";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import Loading from "@/app/_components/common/Loading";

const Page = () => {
    const params = useSearchParams();
    const columnId = params.get("columnId");

    const [queryParams, setQueryParams] = useState({
        title: '',
        tag: '',
        startDate: null,
        endDate: null,
    })

    const {data: posts, refetch, isLoading} = api.post.getPostFilter.useQuery({
        columnId: columnId,
        title: queryParams.title,
        tag: queryParams.tag,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
    }, {enabled: Boolean(columnId)});

    if (isLoading) return <Loading/>
    return (
        <div className={'w-full h-full rounded-2.5 bg-[#FFF] pl-8 pr-9'}>
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

        const [searchParams, setSearchParams] = useState({
            title: "",
            tag: "",
            startDate: null,
            endDate: null,
        });

        useEffect(() => {
            setSearchParams({...queryParams});
        }, []);

        const handleSearch = () => {
            setQueryParams({
                title: searchParams.title,
                tag: searchParams.tag,
                startDate: searchParams.startDate,
                endDate: searchParams.endDate,
            });
            refetch(); // 在点击查询按钮时才触发重新获取数据
        };

        const onTitleChange = (e) => {
            setSearchParams(prevState => ({...prevState, title: e.target.value}));
        };

        const onTagChange = (e) => {
            setSearchParams(prevState => ({...prevState, tag: e.target.value}));
        };

        const onDateChange = (date) => {
            const [date1, date2] = date;
            setSearchParams((prev) => ({
                ...prev,
                startDate: date1 ? date1.toDate() : null,
                endDate: date2 ? date2.toDate() : null,
            }));
        }

        const disabledDate = (currentDate) => {
            return currentDate.isAfter(dayjs(), 'day');
        };

        return (
            <div className={'flex mt-7.5 text-3.5 font-400'}>
                <div>
                    <label className='lh-5.5'>内容标题：</label>
                    <Input
                        className='ml-4 w-56 h-8 rounded-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF]'
                        type="text"
                        placeholder="搜索标题"
                        value={searchParams.title}
                        onChange={onTitleChange}
                        allowClear
                    />
                </div>

                <div className={'ml-32px'}>
                    <label className='lh-5.5'>标签：</label>
                    <Input
                        className='ml-4 w-56 h-8 rounded-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF]'
                        type="text"
                        placeholder="不限"
                        value={searchParams.tag}
                        onChange={onTagChange}
                        allowClear
                    />
                </div>
                <div className={"flex items-center ml-32px"}>
                    <label className='text-3.5 font-400 lh-5.5 mr-2.5'>发布时间：</label>
                    <DatePicker.RangePicker
                        allowClear
                        value={[
                            searchParams.startDate ? dayjs(searchParams.startDate) : null,
                            searchParams.endDate ? dayjs(searchParams.endDate) : null,
                        ]}
                        format={dateFormat}
                        onChange={onDateChange}
                        disabledDate={(currentDate, info) => disabledDate(currentDate, info)}
                    />
                </div>
                <Button
                    className={'p0 b-0 w-16 h-8 rounded-1 bg-[#1DB48D] text-[#fff] mx-56px'}
                    onClick={handleSearch}
                >
                    查询
                </Button>
            </div>
        )
    }
};

export default Page;

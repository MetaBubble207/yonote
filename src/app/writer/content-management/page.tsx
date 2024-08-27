"use client";
import React, {useRef, useState} from 'react';
import Date from "@/app/_components/writer/datarange/Date";
import ContentForm from "@/app/_components/writer/ContentForm";
import Link from 'next/link';
import {useRouter, useSearchParams} from "next/navigation";
import {Button, Table, TableColumnsType, TableProps} from "antd";
import {api} from "@/trpc/react";
import {Post} from "@/server/db/schema";
import {timeToDateTimeString} from "@/tools/timeToString";
import './table.css'

const Page = () => {
    const router = useRouter()
    const handleEdit = (postId) => {
        // 编辑文章逻辑
        router.push(`/edit?postId=${postId}`);
    };

    const handleToggleTop = (index: number) => {

    }

    const handleToggleFree = (index: number) => {

    }

    const handleClickDelete = (id: number) => {

    }
    const columns: TableColumnsType<Post> = [
        {
            title: <span className={'pl-20'}>内容标题</span>,
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (value) => <span className={'pl-20'}>{value}</span>
        },
        {
            title: '状态',
            dataIndex: 'status',
            sorter: (a, b) => {
                // 定义排序逻辑
                const isTopA = a.isTop;
                const isTopB = b.isTop;
                const isFreeA = a.isFree;
                const isFreeB = b.isFree;

                // 如果置顶状态不同，则按置顶状态排序
                if (isTopA !== isTopB) {
                    return isTopA ? -1 : 1;
                }

                // 如果置顶状态相同，则按免费状态排序
                if (isFreeA !== isFreeB) {
                    return isFreeA ? -1 : 1;
                }

                // 如果置顶和免费状态都相同，则按其他条件排序（例如按 id 排序）
                return a.id - b.id;
            },
            filters: [
                {
                    text: '免费',
                    value: 'free',
                },
                {
                    text: '置顶',
                    value: 'top'
                }
            ],
            onFilter: (value, record) => {
                const {isTop, isFree} = record;
                if (value === 'free') {
                    return isFree;
                }
                if (value === 'top') {
                    return isTop;
                }
                return false;
            },
            render: (status, record) => {
                const {isTop, isFree} = record;
                return (
                    <div className={"flex space-x-2.5 items-center"}>
                        {isTop && <div className={"flex items-center"}>
                            <span className={'w-6px h-6px rounded-full p0 bg-#1DB48D flex'}></span>
                            <span className={'text-14px ml-2'}>置顶</span>
                        </div>}
                        {isFree && <div className={"flex items-center"}>
                            <span className={'w-6px h-6px rounded-full p0 bg-#FDB069 flex'}></span>
                            <span className={'text-14px ml-2'}>免费</span>
                        </div>}
                    </div>
                );
            },
        },
        {
            title: '标签',
            dataIndex: 'tag',
            sorter: (a, b) => {
                // 将标签字符串分割成数组，并计算长度
                const tagLengthA = a.tag.split(',').length;
                const tagLengthB = b.tag.split(',').length;
                // 根据长度进行排序
                return tagLengthA - tagLengthB;
            },
            render: (tags) => tags.split(',').map((tag: string, index: number) => <span key={index}>{tag}</span>),
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.updatedAt > a.updatedAt ? 1 : -1,
            filterSearch: true,
            render: (value) => <span>{timeToDateTimeString(value)}</span>
        },
        {
            title: '发布时间',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt > a.createdAt ? 1 : -1,
            filterSearch: true,
            render: (value) => <span>{timeToDateTimeString(value)}</span>
        },
        {
            title: '操作',
            render: (_, record, index) => (
                <div className={'text-3.5 font-400 lh-5.5 text-[#1DB48D] space-x-2'}>
                    <Link href={`/edit/edit?columnId=${columnId}&postId=${record.id}`}
                          onClick={handleEdit}>编辑</Link>
                    <Button type={'link'} className="w-14 text-[#1DB48D]"
                            onClick={() => handleToggleTop(index)}>{record.isTop ? '取消置顶' : '置顶'}</Button>
                    <Button type={'link'} className="w-14 text-[#1DB48D]"
                            onClick={() => handleToggleFree(index)}>{record.isFree ? '取消免费' : '免费'} </Button>
                    <Button type={'link'} className={'text-[#1DB48D]'}
                            onClick={() => handleClickDelete(record.id)}>删除</Button>
                </div>
            ),
        },
    ];

    const params = useSearchParams();
    const columnId = params.get("columnId");

    const {data: posts} = api.post.getAll.useQuery({
        limit: 5,
        offset: 0,
        columnId: columnId,
    });

    const titleRef = useRef(null);
    const tagRef = useRef(null);

    const handleSearch = () => {
        const titleValue = titleRef.current.value;
        const tagValue = tagRef.current.value;
        console.log("内容标题:", titleValue);
        console.log("标签:", tagValue);
    };
    const onChange: TableProps<Post>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div className={'w-full rounded-2.5 bg-[#FFF] pl-8 pr-9'}>
            <div className={'flex items-center pt-51px'}>
                <div className="text-[#323232] text-4 font-not-italic font-700 lh-6">内容管理</div>
                {/*发布*/}
                <Link href={`/edit/edit?columnId=${columnId}`}
                      className={'inline-block h-32px border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1db48d] px-16px lh-32px ml-32px'}>+
                    发布</Link>
            </div>

            {/*justify-between*/}
            <div className={'flex mt-30px'}>
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
                <Button
                    className={'p0 b-0 h-32px border-rd-1 bg-[#1DB48D] text-[#fff] px-16px font-400 text-3.5 lh-32px mx-56px'}
                    onClick={handleSearch}
                >
                    查询
                </Button>
            </div>

            {/*表格*/}
            <div className={"mt-4"}>
                {/* @ts-ignore*/}
                <Table columns={columns} onChange={onChange}
                       dataSource={posts} pagination={{position: ['bottomCenter']}}
                       rowKey={(record) => record.id}/>
            </div>
            {/*底部分页*/}
        </div>
    );
};

export default Page;

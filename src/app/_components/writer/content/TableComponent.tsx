import {type Post} from "@/server/db/schema";
import {Button, Table, type TableColumnsType, type TableProps} from "antd";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {timeToDateTimeString} from "@/tools/timeToString";
import Link from "next/link";
import {api} from "@/trpc/react";

const TableComponent = ({dataSource}: { dataSource: Post[] }) => {
    const [data, setData] = useState<Post[]>([]);
    useEffect(() => {
        setData(dataSource || []);
    }, [dataSource])
    const router = useRouter()
    const handleEdit = (postId) => {
        // 编辑文章逻辑
        router.push(`/edit?postId=${postId}`);
    };
    const updateIsTopApi = api.post.updateIsTop.useMutation();
    const updateIsFreeApi = api.post.updateIsFree.useMutation();
    const deleteApi = api.post.deletePost.useMutation();
    const handleToggleTop = (id: number, isTop: boolean) => {
        updateIsTopApi.mutate({
            id: id,
            isTop: !isTop,
        })
        const newData = dataSource.map(item => {
            if (item.id === id) {
                item.isTop = !isTop;
            }
            return item
        })
        setData(newData)
    }

    const handleToggleFree = (id: number, isFree: boolean) => {
        updateIsFreeApi.mutate({
            id: id,
            isFree: !isFree,
        })
        const newData = dataSource.map(item => {
            if (item.id === id) {
                item.isFree = !isFree;
            }
            return item
        })
        setData(newData)
    }

    const handleClickDelete = (id: number) => {

    }
    const columns: TableColumnsType<Post> = [
        {
            title: <span className={'pl-20'}>内容标题</span>,
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (value) => <span className={'pl-20'}>{value}</span>,
            width: '25%'
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
            width: '12.5%',
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
            width: '9%',
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.updatedAt > b.updatedAt ? 1 : -1,
            filterSearch: true,
            render: (value) => <span>{timeToDateTimeString(value)}</span>,
            width: '15.5%',
        },
        {
            title: '发布时间',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt > b.createdAt ? 1 : -1,
            filterSearch: true,
            render: (value) => <span>{timeToDateTimeString(value)}</span>,
            width: '15.5%',
        },
        {
            title: '操作',
            render: (_, record, index) => (
                <div className={'text-3.5 font-400 lh-5.5 text-[#1DB48D] space-x-2'}>
                    <Link href={`/edit/edit?columnId=${record.columnId}&postId=${record.id}`}
                          onClick={handleEdit}>编辑</Link>
                    <Button type={'link'} className="w-14 text-[#1DB48D]"
                            onClick={() => handleToggleTop(record.id, record.isTop)}>{record.isTop ? '取消置顶' : '置顶'}</Button>
                    <Button type={'link'} className="w-14 text-[#1DB48D]"
                            onClick={() => handleToggleFree(record.id, record.isFree)}>{record.isFree ? '取消免费' : '免费'} </Button>
                    <Button type={'link'} className={'text-[#1DB48D]'}
                            onClick={() => handleClickDelete(record.id)}>删除</Button>
                </div>
            ),
            width: '24%',
        },
    ];
    const onChange: TableProps<Post>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <Table columns={columns} onChange={onChange}
               dataSource={data} pagination={{position: ['bottomCenter']}}
               rowKey={(record) => record.id}/>
    )
}

export default TableComponent;

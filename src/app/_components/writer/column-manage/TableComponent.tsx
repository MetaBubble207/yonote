import {type OrderBuyer} from "@/server/db/schema";
import {Button, Table, type TableColumnsType, type TableProps} from "antd";
import React, {useEffect, useState} from "react";
import {timeToDateTimeString} from "@/tools/timeToString";
import {api} from "@/trpc/react";

const TableComponent = ({dataSource}: { dataSource: OrderBuyer[] }) => {

    const endSubscriptionApi = api.order.endSubscription.useMutation();
    const [data, setData] = useState<OrderBuyer[]>([]);
    useEffect(() => {
        setData(dataSource || []);
    }, [dataSource])

    const endSubscription = (id:number) => {
        endSubscriptionApi.mutate({id:id})
        const newData = dataSource.map(item => {
            if (item.id === id) {
                item.status = false;
            }
            return item
        })
        setData(newData)
    }

    const columns: TableColumnsType<OrderBuyer> = [
        {
            title: <span className={'pl-2'}>序号</span>,
            dataIndex: '_',
            sorter: (a, b) => a.createdAt > b.createdAt ? 1 : -1,
            render: (_, __, index) => <span className={'pl-2'}>{index + 1}</span>,
            width: '11.5%'
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
            width: '12.5%',
        },
        {
            title: '用户id',
            dataIndex: 'buyerId',
            width: '10%',
        },
        {
            title: '订阅状态',
            dataIndex: 'status',
            render: (value) => <span className={'text-3.5 font-400'}>{value
                ? <span className={'flex items-center'}>
                    <span className={'w-1.5 h-1.5 rounded-full bg-#1DB48D'}></span>
                    <span className={'ml-2'}>订阅中</span>
                </span>
                : <span className={'flex items-center'}>
                    <span className={'w-1.5 h-1.5 rounded-full bg-#BFBFBF'}></span>
                    <span className={'ml-2'}>已结束</span>
                </span>}</span>,
            width: '10%',
        },
        {
            title: '订阅开始时间',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt > b.createdAt ? 1 : -1,
            render: (value) => <span>{timeToDateTimeString(value)}</span>,
            width: '17%',
        },
        {
            title: '订阅结束时间',
            dataIndex: 'endDate',
            sorter: (a, b) => a.endDate > b.endDate ? 1 : -1,
            filterSearch: true,
            render: (value) => <span>{timeToDateTimeString(value)}</span>,
            width: '17%',
        },
        {
            title: '操作',
            render: (_, record) => (
                <div className={'text-3.5 font-400'}>
                    <Button type={'link'} style={{color: '#1DB48D',padding: 0}}
                            onClick={() => endSubscription(record.id)}>结束订阅</Button>
                </div>
            ),
            width: '8%',
        },
    ];

    const onChange: TableProps<OrderBuyer>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Table columns={columns} onChange={onChange}
               dataSource={data} pagination={{position: ['bottomCenter']}}
               rowKey={(record) => record.id}/>
    )
}

export default TableComponent;

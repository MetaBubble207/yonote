'use client';
import React, {Suspense, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import TableComponent from "@/app/_components/writer/column-manage/TableComponent";
import {api} from "@/trpc/react";
import Loading from "@/app/_components/common/Loading";

const Page = () => {
    const params = useSearchParams();
    const columnId = params.get("columnId");
    const [queryParams, setQueryParams] = useState({
        userId: null,
        status: null,
        startDate: null,
        endDate: null,
    })
    const {data, isLoading} = api.order.getSubscriptionFilter.useQuery({
        columnId,
        userId: queryParams.userId,
        status: queryParams.status,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
    });

    if (isLoading) return <Loading/>;
    return (
        <div className='w-full h-full bg-#fff p8'>
            <h3 className='text-[#323232] font-700'>订阅管理</h3>
            {/*// @ts-ignore*/}
            <TableComponent dataSource={data}/>
        </div>
    )
        ;
};

export default Page;

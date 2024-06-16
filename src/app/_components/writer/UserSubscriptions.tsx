'use client'
import React, {Suspense, useEffect, useState} from 'react';
import Image from "next/image";
import Date from '../../_components/datarange/Date'
import MyPagination from "@/app/_components/pagination/page";
import {useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import {subscription, user} from "@/server/db/schema";
import {promise} from "zod";
import {timeToDateString} from "@/tools/timeToString";


const UserSubscriptions = () => {
    // const [mergedData, setMergedData] = useState([])
    //
    // interface Item {
    //     id: string;
    //     avatar: string;
    //     userName: string;
    //     userID: string;
    //     status: string;
    //     start: string;
    //     end: string;
    // }

    const params = useSearchParams();
    // const columnId = params.get("columnId")
    const columnId = 'aasda123'




    // console.log(columnId);
    const buyerInfos = api.order.getOrderByColumnId.useQuery({columnId: columnId}).data
    console.log('buyerInfos================>',buyerInfos);

    // const [items, setItems] = useState<Item[]>([
    //     {
    //         id: '1',
    //         avatar: '/images/writer/avatar1.svg',
    //         userName: '胖头鱼吃瓜',
    //         userID: '1239f7.5',
    //         status: '订阅中',
    //         start: '2017-10-31 23:12:00',
    //         end: '2017-10-31 23:12:00'
    //     }])


    // const newItems = buyerInfos?.map((buyer,index) => ({
    //     id: index,
    //     avatar: buyer.user.avatar,
    //     userName: buyer.user.name,
    //     userID: buyer.user.idNumber,
    //     status: buyer.status,
    //     start: buyer.createdAt,
    //     end: buyer.endDate
    // }));
    // const [items, setItems] = useState(newItems);



    const [userIdValue, setUserIdValue] = useState<string>('')
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`正在查询userID: ${e.target.value}`)
        setUserIdValue(e.target.value)
    }


    const [status, setStatus] = useState<boolean>(true)


    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(`正在查询userID为${userIdValue},订阅状态为${status}的信息`)
    }


    const handleChangeStatus = (idNumber: string,currentStatus: boolean) => {
        // 修改订阅状态
        console.log(`即将修改userId为${idNumber}的订阅状态`)
        const newStatus = !currentStatus;
        updateStatusApi.mutate({userId: idNumber, status: newStatus})
    }

    const updateStatusApi = api.order.updateStatus.useMutation({
        onSuccess:(r)=>{
            console.log('更新成功')
        }
    })


    // 表体内容
    const ItemList: React.FC = () => {
        return (
            <tbody className='text-center'>
            {buyerInfos?.map((item, index) => (
                <tr key={index}
                    className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                    <td>{index + 1}</td>
                    {/*<td>{item.avatar}</td>*/}
                    <td className='relative'><Image
                        className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                        src={item.user.avatar} alt={'avatar'} width={32} height={32}/>
                    </td>
                    <td>{item.user.name}</td>
                    <td>{item.user.idNumber}</td>
                    <td>{item.status?'订阅中':'已结束'}</td>
                    {/*<td>{item.start}</td>*/}
                    <td>{timeToDateString(item.createdAt)}</td>
                    <td>{timeToDateString(item.endDate)?timeToDateString(item.endDate):'无数据'}</td>
                    <td>
                        <button
                            onClick={(e) => {
                                handleChangeStatus(item.buyerId,item.status)
                            }}
                            className='text-[#1DB48D] font-"Microsoft YaHei" text-3.5 font-not-italic font-400 lh-5.5'>结束订阅
                        </button>
                    </td>
                </tr>
            ))}


            </tbody>
        )
    }
    return (

        <div
            className='w-100% min-h-150  relative  mt-4.02   shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]'>
            {/*信息列表*/}
            <div className="mt-4">
                <table
                    className="table-auto w-269.75 h-13.5 shrink-0 border-rd-[4px_4px_0px_0px] bg-[#FAFAFA] lh-13.5 text-[rgba(0,0,0,0.85)] text-3.5 font-400 '">

                    {/*表头*/}
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>用户头像</th>
                        <th>用户名</th>
                        <th>用户ID</th>
                        <th>订阅状态
                            <button className='ml-2'><Image
                                className='inline w-2.5 h-2.4935 shrink-0 fill-#BFBFBF'
                                src={'/images/writer/subscribe_status.svg'} alt={'subscribe_status'}
                                width={2.5}
                                height={2.4935}/></button>
                        </th>

                        <th>
                            <div className='flex justify-center items-center'>
                                <span>订阅开始时间</span>
                                <div className='flex-col ml-2'>
                                    <button className='flex items-center'>
                                        <Image
                                            className='w-1.66275 h-1.0675 shrink-0 fill-#BFBFBF'
                                            src={'/images/writer/up.svg'} alt={'up'} width={5} height={5}/>
                                    </button>
                                    <button className='flex items-center'>
                                        <Image
                                            className=' w-1.66275 h-1.0675 shrink-0 fill-#BFBFBF'
                                            src={'/images/writer/down.svg'} alt={'down'} width={5}
                                            height={5}/>
                                    </button>

                                </div>
                            </div>
                        </th>

                        <th>
                            <div className='flex justify-center items-center'>
                                <span>订阅结束时间</span>
                                <div className='flex-col ml-2'>
                                    <button className='flex items-center'>
                                        <Image
                                            className='w-1.66275 h-1.0675 shrink-0 fill-#BFBFBF'
                                            src={'/images/writer/up.svg'} alt={'up'} width={5} height={5}/>
                                    </button>
                                    <button className='flex items-center'>
                                        <Image
                                            className=' w-1.66275 h-1.0675 shrink-0 fill-#BFBFBF'
                                            src={'/images/writer/down.svg'} alt={'down'} width={5}
                                            height={5}/>
                                    </button>

                                </div>
                            </div>
                        </th>
                        <th>操作</th>
                    </tr>
                    </thead>

                    {/*表体*/}
                    <ItemList/>
                    <div>


                        {/*{mergedData.map((item, index) => (*/}
                        {/*    <div key={index}>*/}
                        {/*        <h3>{item.user?.name}</h3>*/}
                        {/*        <h3>{item.user?.idNumber}</h3>*/}
                        {/*        <img src={item.user?.avatar} alt={`${item.user?.name}'s avatar`}/>*/}
                        {/*        <p>Subscription Start: {item.subscription?.start}</p>*/}
                        {/*        <p>Subscription End: {item.subscription?.end}</p>*/}
                        {/*        <p>Status: {item.subscription?.status}</p>*/}
                        {/*    </div>*/}
                        {/*))}*/}

                    </div>

                </table>
            </div>
        </div>

    )

}
export default UserSubscriptions

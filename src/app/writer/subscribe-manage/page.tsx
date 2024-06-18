'use client'
import React, {Suspense, useEffect, useState} from 'react';
import Image from "next/image";
import Date from '../../_components/datarange/Date'
import MyPagination from "@/app/_components/pagination/page";
import {useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import {user} from "@/server/db/schema";
import UserSubscriptions from "@/app/_components/writer/UserSubscriptions";


const Page = () => {
    interface Item {
        id: string;
        avatar: string;
        userName: string;
        userID: string;
        status: string;
        start: string;
        end: string;
    }

    // const [userData, setUserData] = useState(null);
    // const [SubscriptionData, setSubscriptionData] = useState(null);
    const params = useSearchParams();
    // 获取当前专栏ID
    const columnId = params.get("columnId")
    // const columnId = 'aasda123'


    // 通过当前专栏ID 查阅订阅表，拿订阅用户
    const buyerInfos = api.subscription.getAllBuyers.useQuery({columnId: columnId}).data
    // console.log('=======================>buyerInfos',buyerInfos);
    // const data = api.column.getColumnInfo.useQuery({columnId: columnId}).data
    // const [filteredItems, setFilteredItems] = useState<Item[]>([]);


    // console.log('========================>',buyerInfos===undefined?'null':buyerInfos[0].columnId)
    // console.log('===========================>length',buyerInfos===undefined?'null':buyerInfos.length)
    // console.log('===========================>length',buyerInfos.length)


    // console.log('============?',buyerInfos.length);
    // console.log(buyerInfos[0]);
    // console.log(buyerInfos[1]);

    const mergeArray = []
    for (let i = 0; i < buyerInfos?.length; i++) {
        mergeArray.push({id: buyerInfos[i].userId, columnId: buyerInfos[i].columnId})
        // console.log(buyerInfos[i]);
        // const userId = buyerInfos[i].userId
        // console.log(userId);
        // const columnId = buyerInfos[i].columnId
        // console.log(columnId);
        // const columnInfo = api.column?.getColumnInfo?.useQuery({columnId:columnId})?.data
        // console.log('===================>userInfo',userInfo);
        // console.log('===================>columnInfo',columnInfo);
    }
    // console.log('===============>',mergeArray[0].id);
    // for (const buyerInfo of buyerInfos) {
    //
    //     console.log("=============>", buyerInfo);
    //     console.log('userID===========>', buyerInfo.userId)
    //     const userId = buyerInfo.userId
    //     // api.users.getOne.useQuery({id:userId}).data
    //
    //     const status = buyerInfo.status
    //     const columnInfos = api.column.getColumnInfo.useQuery({columnId: columnId}).data
    //     console.log(columnInfos);
    // }


    // const temp = 'o8BjT6kJqAkEnLlWGVuoJGGzVEsk'
    // const userInfo = api.users.getOne.useQuery({id: temp})?.data
    // console.log(userInfo)


    // 如果buyerInfos不为空，就拿到item的columnId、和userId查专栏表和用户表
    // if(buyerInfos){
    //     buyerInfos.map((item) => {
    //         const userId = item?.userId
    //         console.log('=====================>userId',userId);
    //         const userInfo = api.users.getOne.useQuery({id:userId})?.data
    //         console.log('++++++>',userInfo);
    //     })
    //
    // }

    // 通过订阅buyerID查用户表，拿


    // 通过订阅表columnId查专栏创建日期、结束日期、订阅状态


    // const a = api.post.deletePost.useMutation({
    //     onSuccess: (r) => {
    //         console.log(r)
    //     }
    // });
    //
    // const testQuery = api.test.getAll.useQuery();
    // const [data,setData] = useState(testQuery)
    // const testCreate = api.test.create.useMutation({
    //     onSuccess: (r) => {
    //         console.log(r)
    //         setData(api.test.getAll.useQuery());
    //     }
    // })
    //
    // const clickButton = () => {
    //     testCreate.mutate({
    //         id: 1,
    //         name: '123',
    //         content: "213"
    //     })
    // }
    const [items, setItems] = useState<Item[]>([
        {
            id: '1',
            avatar: '/images/writer/avatar1.svg',
            userName: '胖头鱼吃瓜',
            userID: '1239f7.5',
            status: '订阅中',
            start: '2017-10-31 23:12:00',
            end: '2017-10-31 23:12:00'
        }, {
            id: '2',
            avatar: '/images/writer/avatar2.svg',
            userName: '胖头鱼吃瓜',
            userID: '1239f7.5',
            status: '订阅中',
            start: '2017-10-31 23:12:00',
            end: '2017-10-31 23:12:00'
        }, {
            id: '3',
            avatar: '/images/writer/avatar3.svg',
            userName: '胖头鱼吃瓜',
            userID: '1239f7.5',
            status: '订阅中',
            start: '2017-10-31 23:12:00',
            end: '2017-10-31 23:12:00'
        }, {
            id: '4',
            avatar: '/images/writer/avatar4.svg',
            userName: '胖头鱼吃瓜',
            userID: '1239f7.5',
            status: '订阅中',
            start: '2017-10-31 23:12:00',
            end: '2017-10-31 23:12:00'
        },
    ])


    const [userIdValue, setUserIdValue] = useState<string>('')
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`正在查询userID: ${e.target.value}`)
        setUserIdValue(e.target.value)
    }


    const [status, setStatus] = useState<string>('')
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(`正在查询status: ${e.target.value}`)
        setStatus(e.target.value)
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        console.log(`正在查询userID为${userIdValue},订阅状态为${status}的信息`)
    }


    const handleDelete = (index: number) => {
        const newData = [...items]
        newData.splice(index, 1)
        setItems(newData)
        console.log('即将删除')
    }


    // 表体内容
    const ItemList: React.FC = () => {
        return (
            <tbody className='text-center'>
            {items.map((item, index) => (
                <tr key={index}
                    className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                    <td>{index + 1}</td>
                    {/*<td>{item.avatar}</td>*/}
                    <td className='relative'><Image
                        className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                        src={item.avatar} alt={'avatar'} width={32} height={32}/>
                    </td>
                    <td>{item.userName}</td>
                    <td>{item.userID}</td>
                    <td>{item.status}</td>
                    <td>{item.start}</td>
                    <td>{item.end}</td>
                    <td>
                        <button
                            onClick={(e) => {
                                handleDelete(index)
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
        <Suspense>
            <div className='w-full h-full'>
                <div
                    className='w-92% min-h-150   relative ml-4.465 mt-4.02 pt-8 pl-8  shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]'>
                    <h3 className='text-[#323232] text-4 font-700 lh-6'>订阅管理</h3>
                    <div className='flex items-center mt-2.125'>

                        {/*用户ID*/}
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                        <input
                            className=' ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                            type="text" placeholder="用户ID" value={userIdValue}
                            onChange={(e) => handleUserChange(e)}/>


                        {/*订阅状态*/}
                        <label className='ml-4 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅状态:</label>
                        <select onChange={(e) => handleStatusChange(e)}
                                className='ml-4 pl-3.045 w-56 h-8 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-[rgba(0,0,0,0.65)] text-3.5 font-400'>
                            <option value="订阅中">全部</option>
                            <option value="订阅中">订阅中</option>
                            <option value="已结束">已结束</option>
                        </select>

                        {/*订阅开始时间*/}
                        <label
                            className='ml-5 mr-3 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅开始时间: </label>

                        <Date></Date>
                        {/*<input type="date"*/}
                        {/*    className='ml-4 pl-3.045 w-56 h-8 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-[rgba(0,0,0,0.65)] text-3.5 font-400'*/}
                        {/*    placeholder="订阅开始时间" />*/}
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className='w-16.25 h-8 ml-7 shrink-0 bg-#1DB48D border-rd-2.5 text-[#FFF] text-3.5 font-400 lh-5.5'>查询
                        </button>
                    </div>

                    {/*信息列表*/}
                    <UserSubscriptions/>


                    {/*分页*/}
                    <div className="absolute bottom-10  left-60 flex justify-center items-center">
                        <MyPagination/>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}
export default Page

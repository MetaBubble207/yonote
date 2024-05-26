'use client'
import React, {useState} from 'react';


import Image from "next/image";
import Date from '../../_components/datarange/Date'
import MyPagination from "@/app/_components/pagination/page";
import {api} from "@/trpc/react";


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
    const a = api.post.deletePost.useMutation({
        onSuccess: (r) => {
            console.log(r)
        }
    });

    const testQuery = api.test.getAll.useQuery();
    const [data,setData] = useState(testQuery)
    const testCreate = api.test.create.useMutation({
        onSuccess: (r) => {
            console.log(r)
            setData(api.test.getAll.useQuery());
        }
    })

    const clickButton = () => {
        testCreate.mutate({
            id: 1,
            name: '123',
            content: "213"
        })
    }
    const [items,setItems]  = useState<Item[]>([
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

    const [userIdValue,setUserIdValue] = useState<string>('')
    const handleUserChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(`正在查询userID: ${e.target.value}`)
        setUserIdValue(e.target.value)
    }


    const [status,setStatus] = useState<string>('')
    const handleStatusChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
        console.log(`正在查询status: ${e.target.value}`)
        setStatus(e.target.value)
    }


    // 表体内容
    const ItemList: React.FC = () => {
        return (
            <tbody className='text-center'>
            {items.map((item, index) => (
                <tr key={index}
                    className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                    <td>{item.id}</td>
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
                            className='text-[#1DB48D] font-"Microsoft YaHei" text-3.5 font-not-italic font-400 lh-5.5'>结束订阅
                        </button>
                    </td>
                </tr>
            ))}


            </tbody>
        )
    }

    return (
        <div className='w-100% h-100%'>
            {/*<Compass></Compass>*/}
            <div className='w-100%  flex'>
                {/*<LeftCompass />*/}
                {/*<div className="w-64.77925 h-224.9975 shrink-0 bg-[#FFF]">侧边导航</div>*/}


                {/*订单管理页面*/}
                <div
                    className='w-97.5%  relative ml-4.465 mt-4.02 pt-8 pl-8 h-195 shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]'>
                    <h3 className='text-[#323232] text-4 font-700 lh-6'>订阅管理</h3>
                    <div className='flex items-center mt-2.125'>

                        {/*用户ID*/}
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                        <input
                            className=' ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                            type="text" placeholder="用户ID" value={userIdValue} onChange={(e) => handleUserChange(e)}/>


                        {/*订阅状态*/}
                        <label className='ml-4 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅状态:</label>
                        <select onChange={(e)=>handleStatusChange(e)}
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
                            className='w-16.25 h-8 ml-7 shrink-0 bg-#1DB48D border-rd-2.5 text-[#FFF] text-3.5 font-400 lh-5.5'>查询
                        </button>
                    </div>

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
                                        src={'/images/writer/subscribe_status.svg'} alt={'subscribe_status'} width={2.5}
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
                                                    src={'/images/writer/down.svg'} alt={'down'} width={5} height={5}/>
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
                                                    src={'/images/writer/down.svg'} alt={'down'} width={5} height={5}/>
                                            </button>

                                        </div>
                                    </div>
                                </th>
                                <th>操作</th>
                            </tr>
                            </thead>

                            {/*表体*/}
                            <ItemList/>
                        </table>
                    </div>

                    {/*分页*/}
                    <div className="mt-4 flex flex-col justify-end items-center">
                        <MyPagination/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page

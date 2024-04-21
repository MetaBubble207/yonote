import Compass from "../compass/page"
import React from 'react';


import Image from "next/image";
import MyPagination from "@/app/writer/pagination/page";
import Date from "@/app/writer/datarange/page";
import LeftCompass from "@/app/writer/left-compass/page";
import Page_customized from "@/app/writer/pagination/page";


const Page = () => {
    return (
        <div>
            <Compass></Compass>
            <div className='flex'>
                <LeftCompass></LeftCompass>
                {/*<div className="w-64.77925 h-224.9975 shrink-0 bg-[#FFF]">侧边导航</div>*/}


                {/*订单管理页面*/}
                <div
                    className='relative ml-4.465 mt-4.02 pt-8 pl-8 h-195 shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]'>
                    <h3 className='text-[#323232] text-4 font-700 lh-6'>订阅管理</h3>
                    <div className='flex items-center mt-2.125'>

                        {/*用户ID*/}
                        <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                        <input
                            className=' ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                            type="text" placeholder="用户ID"/>


                        {/*订阅状态*/}
                        <label className='ml-4 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅状态:</label>
                        <select
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
                            <tbody className='text-center'>
                                <tr className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                                    <td>1</td>
                                    <td>头像</td>
                                    <td>1239f7.5</td>
                                    <td>胖头鱼吃瓜</td>
                                    <td>订阅中</td>
                                    <td>2017-10-31 23:12:00</td>
                                    <td>2017-10-31 23:12:00</td>
                                    <td>
                                        <button
                                            className='text-[#1DB48D] font-"Microsoft YaHei" text-3.5 font-not-italic font-400 lh-5.5'>结束订阅
                                        </button>
                                    </td>
                                </tr>
                                <tr className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                                    <td>1</td>
                                    <td>头像</td>
                                    <td>1239f7.5</td>
                                    <td>胖头鱼吃瓜</td>
                                    <td>订阅中</td>
                                    <td>2017-10-31 23:12:00</td>
                                    <td>2017-10-31 23:12:00</td>
                                    <td>
                                        <button
                                            className='text-[#1DB48D] font-"Microsoft YaHei" text-3.5 font-not-italic font-400 lh-5.5'>结束订阅
                                        </button>
                                    </td>
                                </tr>
                                <tr className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                                    <td>1</td>
                                    <td>头像</td>
                                    <td>1239f7.5</td>
                                    <td>胖头鱼吃瓜</td>
                                    <td>订阅中</td>
                                    <td>2017-10-31 23:12:00</td>
                                    <td>2017-10-31 23:12:00</td>
                                    <td>
                                        <button
                                            className='text-[#1DB48D] font-"Microsoft YaHei" text-3.5 font-not-italic font-400 lh-5.5'>结束订阅
                                        </button>
                                    </td>
                                </tr>
                                <tr className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                                <td>1</td>
                                <td>头像</td>
                                <td>1239f7.5</td>
                                <td>胖头鱼吃瓜</td>
                                <td>订阅中</td>
                                <td>2017-10-31 23:12:00</td>
                                <td>2017-10-31 23:12:00</td>
                                <td>
                                    <button
                                        className='text-[#1DB48D] font-"Microsoft YaHei" text-3.5 font-not-italic font-400 lh-5.5'>结束订阅
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/*分页*/}
                    <div className="mt-4 flex flex-col justify-end items-center">
                        <Page_customized/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page
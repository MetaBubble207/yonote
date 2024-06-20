'use client'
import React, {Suspense, useEffect, useState} from 'react';
import Image from "next/image";
import Date from '../../_components/datarange/Date'
import MyPagination from "@/app/_components/pagination/page";
import {useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import {user} from "@/server/db/schema";
import UserSubscriptions from "@/app/_components/writer/UserSubscriptions";
import DatePickerComponent from "@/app/_components/datarange/DatePickerComponent";
import {Dayjs} from "dayjs";


const Page = () => {


    const params = useSearchParams();
    // 获取当前专栏ID
    const columnId = params.get("columnId")


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

        console.log(`正在查询userID为${userIdValue},订阅状态为${status}的信息,订阅开始时间为${startPick}-${endPick}`)
    }




    // 订阅开始日期组件参数
    const [selectedDates, setSelectedDates] = useState<[Dayjs, Dayjs] | null>(null);
    const startPick = selectedDates?selectedDates[0].format("YYYY-MM-DD"):null
    const endPick = selectedDates?selectedDates[1].format("YYYY-MM-DD"):null
    const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
        setSelectedDates(dates);
        console.log("Selected dates in ParentComponent:", dates);

    };
    console.log("=================>订阅开始时间:",startPick,endPick)



    return (
        <Suspense>
            <div className='w-full h-full'>
                <div
                    className='w-92% min-h-150   relative ml-4.465 mt-4.02 pt-8 pl-8  shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]'>
                    <h3 className='text-[#323232] text-4 font-700 lh-6'>订阅管理</h3>

                    {/*/!*条件查询*!/*/}
                    {/*<div className='flex items-center mt-2.125'>*/}

                    {/*    /!*用户ID*!/*/}
                    {/*    <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>用户ID: </label>*/}
                    {/*    <input*/}
                    {/*        className=' ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'*/}
                    {/*        type="text" placeholder="用户ID" value={userIdValue}*/}
                    {/*        onChange={(e) => handleUserChange(e)}/>*/}


                    {/*    /!*订阅状态*!/*/}
                    {/*    <label className='ml-4 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅状态:</label>*/}
                    {/*    <select onChange={(e) => handleStatusChange(e)}*/}
                    {/*            className='ml-4 pl-3.045 w-56 h-8 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-[rgba(0,0,0,0.65)] text-3.5 font-400'>*/}
                    {/*        <option value="订阅中">全部</option>*/}
                    {/*        <option value="订阅中">订阅中</option>*/}
                    {/*        <option value="已结束">已结束</option>*/}
                    {/*    </select>*/}

                    {/*    /!*订阅开始时间*!/*/}
                    {/*    <label*/}
                    {/*        className='ml-5 mr-3 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅开始时间: </label>*/}

                    {/*    /!*日期选择组件*!/*/}
                    {/*    /!*<Date></Date>*!/*/}
                    {/*    <DatePickerComponent onDateChange={handleDateChange}></DatePickerComponent>*/}

                    {/*    /!*<input type="date"*!/*/}
                    {/*    /!*    className='ml-4 pl-3.045 w-56 h-8 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-[rgba(0,0,0,0.65)] text-3.5 font-400'*!/*/}
                    {/*    /!*    placeholder="订阅开始时间" />*!/*/}
                    {/*    <button*/}
                    {/*        onClick={(e) => handleSubmit(e)}*/}
                    {/*        className='w-16.25 h-8 ml-7 shrink-0 bg-#1DB48D border-rd-2.5 text-[#FFF] text-3.5 font-400 lh-5.5'>查询*/}
                    {/*    </button>*/}
                    {/*</div>*/}

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

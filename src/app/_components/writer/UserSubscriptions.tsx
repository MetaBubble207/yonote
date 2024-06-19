'use client';
import React, {useState, useEffect} from 'react';
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import {timeToDateFullTimeString} from "@/tools/timeToString";
import DatePickerComponent from "@/app/_components/datarange/DatePickerComponent";
import {Dayjs} from "dayjs";

const UserSubscriptions = () => {
    const params = useSearchParams();
    const columnId = params.get("columnId");


    // const [isSearch, setIsSearch] = useState<boolean>(false)


    const [userIdValue, setUserIdValue] = useState<string>('')
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`正在查询userID: ${e.target.value}`)
        setUserIdValue(e.target.value)
    }


    const [status, setStatus] = useState<boolean>(null)
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(`正在查询status: ${e.target.value}`)

            if (e.target.value === "订阅中") {
                setStatus(true);
            } else if (e.target.value === "已结束") {
                setStatus(false);
            }else{
                setStatus(null)
            }
    }


// 订阅开始日期组件参数
    const [selectedDates, setSelectedDates] = useState<[Dayjs, Dayjs] | null>(null);
    const startPick = selectedDates ? selectedDates[0].format("YYYY-MM-DD") : null
    const endPick = selectedDates ? selectedDates[1].format("YYYY-MM-DD") : null
    const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
        setSelectedDates(dates);
        // const {data: buyerInfos, refetch} = api.order.getOrderByColumnIdTest.useQuery(queryParams)
        console.log("Selected dates in ParentComponent:", dates);

    };
    console.log("=================>订阅开始时间:", startPick, endPick)


// 构建查询参数
    const queryParams = React.useMemo(() => {
        const params = {};
        if (userIdValue) params.buyerId = userIdValue;
        if (columnId) params.columnId = columnId;
        if (status !== null) params.status = status; // 只在 status 不为 null 时设置
        if (startPick) params.startPick = startPick;
        if (endPick) params.endPick = endPick;

        return params;
    }, [columnId, status, userIdValue, startPick, endPick]);

    console.log('==============>queryParams', queryParams)


// 检测后端多参数查询order接口
// const data =  api.order.getOrderByColumnIdTest.useQuery({columnId:columnId,status:true,buyerId:"1ee86f01f02a4d9",startPick:'2024-06-02',endPick:"2024-06-19"}).data
// console.log('=====================>data',data)



// 使用 useQuery 获取数据
    const {data: buyerInfos, refetch} = api.order.getOrderByColumnIdTest.useQuery(queryParams,
        {enabled: Object.keys(queryParams).length > 0,});
//     const {data: buyerInfos, refetch} = api.order.getOrderByColumnId.useQuery(queryParams)
    // const {data: buyerInfos, refetch} = isSearch? api.order.getOrderByColumnIdTest.useQuery(queryParams)
    //     :api.order.getOrderByColumnIdTest.useQuery({columnId:columnId});


    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(`正在查询userID为${userIdValue},订阅状态为${status}的信息,订阅开始时间为${startPick}-${endPick}`)
        console.log('执行提交前，我的数据是=========》', queryParams)
        // const {data: buyerInfos, refetch} = api.order.getOrderByColumnIdTest.useQuery(queryParams)
        refetch()
    }
// 定义本地状态
    const [items, setItems] = useState([]);

// 使用 useEffect 将 API 数据设置到本地状态
    useEffect(() => {
        if (buyerInfos) {
            setItems(buyerInfos.map((info, index) => ({
                id: index,
                avatar: info.user.avatar,
                userName: info.user.name,
                userID: info.user.idNumber,
                status: info.status,
                start: info.createdAt,
                end: info.endDate,
                buyerId: info.buyerId,
            })));
        }
    }, [buyerInfos]);


    const updateStatusApi = api.order.updateStatus.useMutation({
        onSuccess: (updatedOrder) => {
            console.log('更新成功', updatedOrder);
            refetch()
            setItems(prevItems =>
                prevItems.map(item =>
                    item.buyerId === updatedOrder.buyerId ? {...item, status: updatedOrder.status} : item
                )
            );
        },
    });

    const handleChangeStatus = (buyerId: string, currentStatus: boolean) => {
        console.log(`即将修改 userId 为 ${buyerId} 的订阅状态`);
        updateStatusApi.mutate({userId: buyerId, status: currentStatus, columnId: columnId});
    };

    const ItemList: React.FC = () => {
        return (
            <tbody className="text-center">
            {items.map((item, index) => (
                <tr key={index}
                    className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                    <td>{index + 1}</td>
                    <td className="relative">
                        <Image
                            className="w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8"
                            src={item.avatar}
                            alt="avatar"
                            width={32}
                            height={32}
                        />
                    </td>
                    <td>{item.userName}</td>
                    <td>{item.userID}</td>
                    <td>{item.status ? '订阅中' : '已结束'}</td>
                    <td>{timeToDateFullTimeString(item.start)}</td>
                    <td>{timeToDateFullTimeString(item.end) ? timeToDateFullTimeString(item.end) : '无数据'}</td>
                    <td>
                        <button
                            onClick={() => handleChangeStatus(item.buyerId, item.status)}
                            className="text-[#1DB48D] font-['Microsoft YaHei'] text-3.5 font-not-italic font-400 lh-5.5"
                        >
                            {item.status ? "结束订阅" : "重新订阅"}
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        );
    };

    return (
        <>
            {/*条件查询*/}
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
                    <option value="全部">全部</option>
                    <option value="订阅中">订阅中</option>
                    <option value="已结束">已结束</option>
                </select>

                {/*订阅开始时间*/}
                <label
                    className='ml-5 mr-3 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅开始时间: </label>

                {/*日期选择组件*/}
                {/*<Date></Date>*/}
                <DatePickerComponent onDateChange={handleDateChange}></DatePickerComponent>

                {/*<input type="date"*/}
                {/*    className='ml-4 pl-3.045 w-56 h-8 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-[rgba(0,0,0,0.65)] text-3.5 font-400'*/}
                {/*    placeholder="订阅开始时间" />*/}
                <button
                    onClick={(e) => handleSubmit(e)}
                    className='w-16.25 h-8 ml-7 shrink-0 bg-#1DB48D border-rd-2.5 text-[#FFF] text-3.5 font-400 lh-5.5'>查询
                </button>
            </div>
            <div className="w-100% min-h-150 relative mt-4.02 shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]">
                <div className="mt-4">
                    <table
                        className="table-auto w-269.75 h-13.5 shrink-0 border-rd-[4px_4px_0px_0px] bg-[#FAFAFA] lh-13.5 text-[rgba(0,0,0,0.85)] text-3.5 font-400">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>用户头像</th>
                            <th>用户名</th>
                            <th>用户ID</th>
                            <th>订阅状态</th>
                            <th>订阅开始时间</th>
                            <th>订阅结束时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <ItemList/>
                    </table>
                </div>
            </div>
        </>
    );
};

export default UserSubscriptions;
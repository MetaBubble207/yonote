'use client';
import React, {useState, useEffect} from 'react';
import Image from "next/image";
import {api} from "@/trpc/react";
import {timeToDateFullTimeString} from "@/tools/timeToString";
import DatePickerComponent from "@/app/_components/datarange/DatePickerComponent";
import {Dayjs} from "dayjs";

interface UserSubscriptionsProps {
    columnId: string;
    currentPage: number;
    pageSize: number;
    setTotal: (total: number) => void;
}

type OrderQueryResult = {
    data: Array<{
        buyerId: string;
        status: boolean;
        createdAt: string;
        endDate: string;
        user: {
            avatar: string;
            name: string;
            idNumber: string;
        };
    }>;
    total: number;
};

const UserSubscriptions: React.FC<UserSubscriptionsProps> = ({columnId, currentPage, pageSize, setTotal}) => {
    const [userIdValue, setUserIdValue] = useState<string>('');
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserIdValue(e.target.value);
    };

    const [status, setStatus] = useState<boolean | null>(null);
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "订阅中") {
            setStatus(true);
        } else if (e.target.value === "已结束") {
            setStatus(false);
        } else {
            setStatus(null);
        }
    };

    const [selectedDates, setSelectedDates] = useState<[Dayjs, Dayjs] | null>(null);
    const startPick = selectedDates ? selectedDates[0].format("YYYY-MM-DD") : null;
    const endPick = selectedDates ? selectedDates[1].format("YYYY-MM-DD") : null;
    const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
        setSelectedDates(dates);
    };

    const queryParams = React.useMemo(() => {
        const params: any = {};
        if (userIdValue) params.buyerId = userIdValue.trim(); // 去除空格
        if (columnId) params.columnId = columnId;
        if (status !== null) params.status = status;
        if (startPick) params.startPick = startPick;
        if (endPick) params.endPick = endPick;
        params.pageSize = pageSize;
        params.currentPage = currentPage;
        return params;
    }, [columnId, status, userIdValue, startPick, endPick, currentPage, pageSize]);


    console.log("ppppppppppppppppppppppppp=>", queryParams)
    const {data, refetch} = api.order.getOrderByColumnIdTest.useQuery<OrderQueryResult>(queryParams, {
        enabled: !!columnId // 只在 columnId 存在时启用查询
    });

    const buyerInfos = data?.data || [];

    useEffect(() => {
        if (data) {
            setTotal(data.total); // 设置总记录数
            console.log('data.total==============>', data.total);
        }
    }, [data, setTotal]);

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

    const [items, setItems] = useState([]);
    const updateStatusApi = api.order.updateStatus.useMutation({
        onSuccess: (updatedOrder) => {
            refetch();
            setItems(prevItems =>
                prevItems.map(item =>
                    item.buyerId === updatedOrder.buyerId ? {...item, status: updatedOrder.status} : item
                )
            );
        },
    });

    const handleChangeStatus = (buyerId: string, currentStatus: boolean) => {
        updateStatusApi.mutate({userId: buyerId, status: currentStatus, columnId: columnId});
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        refetch();
    };


    const ItemList: React.FC = () => {
        const offset = (currentPage - 1) * pageSize;
        return (
            <tbody className="text-center">
            {items.map((item, index) => (
                <tr key={index}
                    className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
                    <td>{offset + index + 1}</td>
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
            <div className='flex items-center mt-2.125'>
                <label className='text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                <input
                    className='ml-4 w-56 h-8 pl-3.045 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] lh-8'
                    type="text"
                    placeholder="用户ID"
                    value={userIdValue}
                    onChange={(e) => handleUserChange(e)}
                />
                <label className='ml-4 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅状态:</label>
                <select onChange={(e) => handleStatusChange(e)}
                        className='ml-4 pl-3.045 w-56 h-8 shrink-0 border-rd-0.5 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-[rgba(0,0,0,0.65)] text-3.5 font-400'>
                    <option value="全部">全部</option>
                    <option value="订阅中">订阅中</option>
                    <option value="已结束">已结束</option>
                </select>
                <label className='ml-5 mr-3 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5'>订阅开始时间: </label>
                <DatePickerComponent onDateChange={handleDateChange}></DatePickerComponent>
                <button onClick={handleSubmit}
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

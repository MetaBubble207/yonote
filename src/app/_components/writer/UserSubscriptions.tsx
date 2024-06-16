'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { timeToDateString } from "@/tools/timeToString";

const UserSubscriptions = () => {
    const params = useSearchParams();
    const columnId = 'aasda123';

    // 使用 useQuery 获取数据
    const { data: buyerInfos, refetch } = api.order.getOrderByColumnId.useQuery({ columnId });

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
            setItems(prevItems =>
                prevItems.map(item =>
                    item.buyerId === updatedOrder.buyerId ? { ...item, status: updatedOrder.status } : item
                )
            );
        },
    });

    const handleChangeStatus = (buyerId: string, currentStatus: boolean) => {
        console.log(`即将修改 userId 为 ${buyerId} 的订阅状态`);
        updateStatusApi.mutate({ userId: buyerId, status: currentStatus });
    };

    const ItemList: React.FC = () => {
        return (
            <tbody className="text-center">
            {items.map((item, index) => (
                <tr key={index} className="w-269.75 h-13.5 shrink-0 bg-white text-[rgba(0,0,0,0.85)] text-3.5 font-7.500 lh-5.5">
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
                    <td>{timeToDateString(item.start)}</td>
                    <td>{timeToDateString(item.end) ? timeToDateString(item.end) : '无数据'}</td>
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
        <div className="w-100% min-h-150 relative mt-4.02 shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]">
            <div className="mt-4">
                <table className="table-auto w-269.75 h-13.5 shrink-0 border-rd-[4px_4px_0px_0px] bg-[#FAFAFA] lh-13.5 text-[rgba(0,0,0,0.85)] text-3.5 font-400">
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
                    <ItemList />
                </table>
            </div>
        </div>
    );
};

export default UserSubscriptions
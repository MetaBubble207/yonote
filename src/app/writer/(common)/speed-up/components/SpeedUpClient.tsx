"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import IncentiveSettings from "./IncentiveSettings";
import IncentiveFilter from "./IncentiveFilter";
import TableComponent from "./TableComponent";
import DistributionActivation from "./DistributionActivation";
import { api } from "@/trpc/react";
import type { SpeedUp } from "@/server/db/schema";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { debounce } from "lodash";
import { exportToExcel } from "@/app/_utils/exportToExcel";

interface SpeedUpClientProps {
    columnId: string;
    distributorshipData: any;
    speedUpData: {
        items: SpeedUp[];
        total: number;
        page: number;
        pageSize: number;
    };
    initialUserId?: string;
    initialDateRange?: [Date, Date] | null;
    initialPagination?: {
        current: number;
        pageSize: number;
        total: number;
    };
}

export default function SpeedUpClient({
    columnId,
    distributorshipData,
    speedUpData,
    initialUserId = "",
    initialDateRange = null,
    initialPagination = { current: 1, pageSize: 10, total: 0 }
}: SpeedUpClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [filteredData, setFilteredData] = useState(speedUpData.items || []);
    const [loading, setLoading] = useState(false);
    const [inputUserId, setInputUserId] = useState<string>(initialUserId);
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(initialDateRange);
    const [pagination, setPagination] = useState({
        current: initialPagination.current,
        pageSize: initialPagination.pageSize,
        total: initialPagination.total
    });

    const [token] = useLocalStorage('token', null);
    const { data: userData } = api.users.getOne.useQuery(
        token,
        {
            enabled: Boolean(token)
        }
    );

    // 更新路由参数的函数
    const updateRouteParams = useCallback((params: Record<string, string | undefined>) => {
        const currentParams = new URLSearchParams();

        // 保留columnId
        if (columnId) {
            currentParams.set('columnId', columnId);
        }

        // 添加新参数
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                currentParams.set(key, value);
            } else {
                currentParams.delete(key);
            }
        });

        const queryString = currentParams.toString();
        const newPath = `${pathname}${queryString ? `?${queryString}` : ''}`;

        router.push(newPath);
    }, [router, pathname, columnId]);

    // 防抖处理用户ID搜索
    const debouncedUpdateUserId = useCallback(
        debounce((userId: string) => {
            updateRouteParams({
                userId: userId || undefined,
                currentPage: '1' // 重置到第一页
            });
        }, 500),
        [updateRouteParams]
    );

    // 处理用户ID输入变化
    const handleUserIdChange = (userId: string) => {
        setInputUserId(userId);
        debouncedUpdateUserId(userId);
    };

    // 处理日期范围变化
    const handleDateChange = (dates: [Date, Date] | null) => {
        setDateRange(dates);
        updateRouteParams({
            startPick: dates?.[0] ? dates[0].toISOString() : undefined,
            endPick: dates?.[1] ? dates[1].toISOString() : undefined,
            currentPage: '1' // 重置到第一页
        });
    };

    // 处理分页变化
    const handlePageChange = (page: number, pageSize?: number) => {
        const newPageSize = pageSize || pagination.pageSize;
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: newPageSize
        }));

        updateRouteParams({
            currentPage: page.toString(),
            pageSize: newPageSize.toString()
        });
    };

    // 数据导出功能
    const handleExport = () => {
        const dataToExport = speedUpData.items.map((item, index) => ({
            排名: index + 1,
            用户名: item.username,
            用户ID: item.userId,
            分销数量: item.distributionCount,
            推广数量: item.promotionCount,
            总金额: item.totalPrice,
        }));

        exportToExcel(dataToExport, '数据导出');
    };
    const { refetch: refetchDistributorshipDetail } = api.distributorshipDetail.getOne.useQuery(
        columnId,
        { enabled: false }
    );
    // 处理分销激活
    const handleActivated = async () => {
        setLoading(true);
        try {
            await refetchDistributorshipDetail();
            // 刷新页面以获取新的分销数据
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    // 更新本地数据
    useEffect(() => {
        setFilteredData(speedUpData.items || []);
        setPagination(prev => ({
            ...prev,
            total: speedUpData.total || 0
        }));
    }, [speedUpData]);

    if (!columnId) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-semibold">未选择专栏</h3>
                    <p className="mt-2 text-gray-500">请先选择一个专栏</p>
                </div>
            </div>
        );
    }

    if (!distributorshipData) {
        return (
            <DistributionActivation
                columnId={columnId}
                userData={userData}
                onActivated={handleActivated}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <IncentiveSettings
                    columnId={columnId}
                    isVip={userData?.idType === 1}
                    distributorshipData={distributorshipData}
                />
            </div>

            <div className="mb-6">
                <IncentiveFilter
                    initialUserId={inputUserId}
                    initialDateRange={dateRange}
                    onUserIdChange={handleUserIdChange}
                    onDateChange={handleDateChange}
                    onExport={handleExport}
                />
            </div>

            <TableComponent
                dataSource={filteredData}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: handlePageChange
                }}
            />
        </div>
    );
}
"use client";

import { DatePicker, Input, Select, Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import { chinaMidNightOffsetInMilliseconds, chinaOffsetInMilliseconds } from "@/app/_utils/getCurrentTime";
interface SubscribeSearchParams {
    columnId?: string;
    userId?: string | null;
    status?: number;
    startDate: Date | null;
    endDate: Date | null;
    currentPage?: number;
    pageSize?: number;
}
export const FilterSection = ({ columnId }: { columnId: string }) => {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState<SubscribeSearchParams>({
        userId: "",
        status: 0,
        startDate: null,
        endDate: null,
    });

    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (columnId) params.set("columnId", columnId);
        if (searchParams.userId) params.set("userId", searchParams.userId);
        if (searchParams.status !== null) params.set("status", String(searchParams.status));
        if (searchParams.startDate) params.set("startDate", new Date(searchParams.startDate.getTime() + chinaOffsetInMilliseconds).toISOString());
        if (searchParams.endDate) params.set("endDate", new Date(searchParams.endDate.getTime() + chinaMidNightOffsetInMilliseconds).toISOString());

        router.push(`/writer/subscribe-manage?${params.toString()}`);
    }, [router, columnId, searchParams]);

    const onDateChange = useCallback((dates: any) => {
        if (!dates) {
            setSearchParams(prev => ({ ...prev, startDate: null, endDate: null }));
            return;
        }
        const [date1, date2] = dates;
        setSearchParams(prev => ({
            ...prev,
            startDate: date1 ? date1.toDate() : null,
            endDate: date2 ? date2.toDate() : null,
        }));
    }, []);

    return (
        <div className="mt-7.5 text-3.5 font-normal">
            <div className="flex flex-wrap items-end gap-y-4">
                <div className="flex flex-wrap gap-8 items-end flex-1">
                    <div className="flex items-center min-w-[300px]">
                        <label className="leading-5.5 whitespace-nowrap">用户ID：</label>
                        <Input
                            className="rounded-1 border ml-4 h-8 w-56 border-solid border-[#D9D9D9] bg-[#FFF]"
                            placeholder="搜索用户ID"
                            value={searchParams.userId ?? ""}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, userId: e.target.value }))}
                            allowClear
                        />
                    </div>

                    <div className="flex items-center min-w-[300px]">
                        <label className="leading-5.5 whitespace-nowrap">订阅状态：</label>
                        <Select
                            className="ml-4 h-8 w-56"
                            placeholder="不限"
                            value={searchParams.status}
                            options={[
                                { value: 0, label: "全部" },
                                { value: 1, label: "订阅中" },
                                { value: 2, label: "已结束" },
                            ]}
                            onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
                        />
                    </div>

                    <div className="flex items-center min-w-[400px]">
                        <label className="leading-5.5 whitespace-nowrap">订阅开始时间：</label>
                        <DatePicker.RangePicker
                            className="ml-4"
                            value={[
                                searchParams.startDate ? dayjs(searchParams.startDate) : null,
                                searchParams.endDate ? dayjs(searchParams.endDate) : null,
                            ]}
                            format="YYYY/MM/DD"
                            onChange={onDateChange}
                        />
                    </div>
                </div>

                <Button
                    className="h-8 w-16"
                    style={{
                        backgroundColor: "#1DB48D",
                        color: "#fff",
                        border: "none",
                    }}
                    onClick={handleSearch}
                >
                    查询
                </Button>
            </div>
        </div>
    );
};
"use client";

import { DatePicker, Input, Select, Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import { SubscribeSearchParams } from "../types";

export const FilterSection = ({ columnId }: { columnId: string }) => {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState<SubscribeSearchParams>({
        userId: "",
        status: 0,
        startDate: undefined,
        endDate: undefined,
    });

    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();
        params.set("columnId", columnId)
        if (searchParams.userId) params.set("userId", searchParams.userId);
        if (searchParams.status !== null) params.set("status", String(searchParams.status));
        if (searchParams.startDate) params.set("startDate", searchParams.startDate);
        if (searchParams.endDate) params.set("endDate", searchParams.endDate);

        router.push(`/writer/subscribe-manage?${params.toString()}`);
    }, [router, searchParams]);

    const onDateChange = useCallback((dates: any) => {
        if (!dates) {
            setSearchParams(prev => ({ ...prev, startDate: undefined, endDate: undefined }));
            return;
        }
        const [start, end] = dates;
        setSearchParams(prev => ({
            ...prev,
            startDate: start?.toISOString(),
            endDate: end?.toISOString(),
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
"use client";

import { Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
// 定义查询参数类型
interface QueryParams {
    title: string;
    tag: string;
    startDate: Date | null;
    endDate: Date | null;
}
export const FilterSection = ({ columnId }: { columnId: string | null }) => {
    const [searchParams, setSearchParams] = useState<QueryParams>({
        title: "",
        tag: "",
        startDate: null,
        endDate: null,
    });
    const router = useRouter();
    const dateFormat = "YYYY/MM/DD";

    const handleSearch = useCallback(() => {
        // 构建查询参数
        const params = new URLSearchParams();
        if (columnId) params.set("columnId", columnId);
        if (searchParams.title) params.set("title", searchParams.title);
        if (searchParams.tag) params.set("tag", searchParams.tag);
        if (searchParams.startDate) params.set("startDate", searchParams.startDate.toISOString());
        if (searchParams.endDate) params.set("endDate", searchParams.endDate.toISOString());
        try{
            console.log(1);
        }catch(e){
            console.log(e);
        } finally {
            console.log(2);
        }
        // 导航到带有查询参数的同一页面
        router.push(`/writer/content-management?${params.toString()}`);
    }, [searchParams, columnId, router]);

    const onTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => ({ ...prev, title: e.target.value }));
    }, []);

    const onTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => ({ ...prev, tag: e.target.value }));
    }, []);

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

    const disabledDate = useCallback((currentDate: dayjs.Dayjs) => {
        return currentDate.isAfter(dayjs(), "day");
    }, []);

    return (
        <div className="mt-7.5 text-3.5 font-400">
            <div className="flex flex-wrap items-end gap-y-4">
                <div className="flex flex-wrap gap-8 items-end flex-1">
                    <div className="flex items-center min-w-[360px]">
                        <label className="lh-5.5 whitespace-nowrap w-[70px]">内容标题：</label>
                        <Input
                            className="rounded-1 border-1 ml-4 h-8 w-[270px] border-solid border-[#D9D9D9] bg-[#FFF]"
                            placeholder="搜索标题"
                            value={searchParams.title}
                            onChange={onTitleChange}
                            allowClear
                        />
                    </div>

                    <div className="flex items-center min-w-[360px]">
                        <label className="lh-5.5 whitespace-nowrap w-[90px]">标签：</label>
                        <Input
                            className="rounded-1 border-1 ml-4 h-8 w-[270px] border-solid border-[#D9D9D9] bg-[#FFF]"
                            placeholder="不限"
                            value={searchParams.tag}
                            onChange={onTagChange}
                            allowClear
                        />
                    </div>

                    <div className="flex items-center min-w-[360px]">
                        <label className="text-3.5 font-400 lh-5.5 whitespace-nowrap w-[70px]">
                            发布时间：
                        </label>
                        <div className="ml-4 w-[270px]">
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                allowClear
                                value={[
                                    searchParams.startDate ? dayjs(searchParams.startDate) : null,
                                    searchParams.endDate ? dayjs(searchParams.endDate) : null,
                                ]}
                                format={dateFormat}
                                onChange={onDateChange}
                                disabledDate={disabledDate}
                            />
                        </div>
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
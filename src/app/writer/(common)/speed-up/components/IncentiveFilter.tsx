"use client";
import React from "react";
import { ConfigProvider, DatePicker, Input } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "antd/locale/zh_CN";
import { time2DateString } from "@/app/_utils/timeToString";

const { RangePicker } = DatePicker;

interface IncentiveFilterProps {
    initialUserId?: string;
    initialDateRange?: [Date, Date] | null;
    onUserIdChange?: (userId: string) => void;
    onDateChange?: (dates: [Date, Date] | null) => void;
    onExport?: () => void;
}

// 日期禁用函数
const disabledDate = (currentDate: Dayjs) => {
    // 禁用当前日期之后的日期
    return currentDate.isAfter(dayjs(), "day");
};

const dateFormat = "YYYY/MM/DD";

const IncentiveFilter: React.FC<IncentiveFilterProps> = ({
    initialUserId = "",
    initialDateRange = null,
    onUserIdChange,
    onDateChange,
    onExport,
}) => {
    // 将初始日期转换为 dayjs 对象
    const initialDates = initialDateRange
        ? [dayjs(time2DateString(initialDateRange[0]), dateFormat), dayjs(time2DateString(initialDateRange[1]), dateFormat)]
        : undefined;
    console.log("initialDates ==>", initialDates);

    // 处理日期变化
    const handleDateChange = (dates: any) => {
        if (!dates) {
            onDateChange && onDateChange(null);
            return;
        }

        const [start, end] = dates;
        onDateChange && onDateChange([start.toDate(), end.toDate()]);
    };

    return (
        <div className="flex">
            <div className="mt-7.425 flex items-center">
                <label className="ml-10.5575 text-3.5 font-400 lh-5.5 text-[rgba(0,0,0,0.85)] shrink-0">
                    用户ID：{" "}
                </label>
                <Input
                    className="pl-3 ml-4 w-56! h-8 shrink-0 border-[#D9D9D9] bg-[#FFF]"
                    type="text"
                    placeholder="用户ID"
                    value={initialUserId}
                    onChange={(e) => onUserIdChange && onUserIdChange(e.target.value)}
                />
                <div className="ml-20.5 h-8 w-70">
                    <ConfigProvider locale={locale}>
                        <RangePicker
                            defaultValue={[initialDates && initialDates[0], initialDates && initialDates[1]]}
                            onChange={handleDateChange}
                            disabledDate={disabledDate}
                            placeholder={["开始日期", "结束日期"]}
                        />
                    </ConfigProvider>
                </div>

                <button
                    className="ml-75 w-20.5 border-rd-1 text-3.5 font-400 lh-5.5 h-8 shrink-0 bg-[#1DB48D] text-[#FFF]"
                    onClick={onExport}
                >
                    数据导出
                </button>
            </div>
        </div>
    );
};

export default IncentiveFilter;
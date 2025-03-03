"use client";
import { DatePicker } from "antd";
import React, { Suspense, useState } from "react";
import { Echarts } from "./Echarts";
import Loading from "@/app/_components/common/Loading";
import { ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { date2DateTimeStringSeconds } from "@/app/_utils/timeToString";

const { RangePicker } = DatePicker;

interface ChartContainerProps {
    columnId: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ columnId }) => {
    const dateFormat = "YYYY/MM/DD";
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const onDateChange = (dates: any) => {
        if (!dates || dates.length !== 2) {
            setStartDate(null);
            setEndDate(null);
            return;
        }

        const [date1, date2] = dates;
        setStartDate(date1 ? date2DateTimeStringSeconds(date1.toDate()) : null);
        setEndDate(date2 ? date2DateTimeStringSeconds(date2.toDate()) : null);
    };

    const disabledDate = (currentDate: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return currentDate && currentDate > today;
    };

    return (
        <div className="pt-32px rounded-2.5 w-full bg-[#FFF] pl-8 pr-7">
            <div className={"flex w-full items-center justify-between"}>
                <span className="text-4 font-700 lh-6 text-[#323232]">
                    数据分析图表
                </span>
                <div className="text-3.5 space-x-40px flex items-center">
                    {/* <div className={"flex items-center"}>
                        <div className="rd-5 h-2.5 w-2.5 shrink-0 bg-[#71AFFF] pr-2.5"></div>
                        <div className={"ml-2.5 shrink-0"}>阅读量</div>
                    </div>
                    <div className={"flex items-center"}>
                        <div className="rd-5 h-2.5 w-2.5 shrink-0 bg-[#fdb069] pr-2.5"></div>
                        <div className={"ml-2.5 shrink-0"}>订阅量</div>
                    </div> */}
                    <ConfigProvider locale={locale}>
                        <RangePicker
                            format={dateFormat}
                            onChange={onDateChange}
                            disabledDate={disabledDate}
                            placeholder={["开始日期", "结束日期"]}
                        />
                    </ConfigProvider>
                </div>
            </div>
            <div className="h-90 w-full">
                <Suspense fallback={<Loading />}>
                    {startDate && endDate ? (
                        <Echarts
                            startDate={startDate}
                            endDate={endDate}
                            columnId={columnId}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            请选择日期范围查看数据
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default ChartContainer;
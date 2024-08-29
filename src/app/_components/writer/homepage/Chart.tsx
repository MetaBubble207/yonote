"use client"
import {DatePicker} from "antd";
import React, {useState} from "react";
import dayjs from "dayjs";
import Echarts from "@/app/_components/writer/homepage/Echarts";

const Chart = () => {
    const dateFormat = 'YYYY/MM/DD';
    const [startDate, setStartDate] = useState<Date>(null);
    const [endDate, setEndDate] = useState<Date>(null);
    const onDateChange = (date) => {
        const [date1, date2] = date;
        setStartDate(date1 ? date1.toDate() : null)
        setEndDate(date2 ? date2.toDate() : null)
    };

    const disabledDate = (time: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return time && time > today;
    };

    return (
        <div className="w-full h-118.5 pt-32px pl-8 pr-7 rounded-2.5 bg-[#FFF]">
            <div className={"w-full flex items-center justify-between"}>
                <span className="text-[#323232] text-4 font-700 lh-6">数据分析图表</span>
                <div className=" text-3.5 flex items-center space-x-40px">
                    <div className={"flex items-center"}>
                        <div className="w-2.5 h-2.5 bg-[#71AFFF] rd-5  pr-2.5 shrink-0"></div>
                        <div className={"ml-2.5 shrink-0"}>阅读量</div>
                    </div>
                    <div className={"flex items-center"}>
                        <div className="w-2.5 h-2.5 bg-[#fdb069] rd-5  pr-2.5 shrink-0"></div>
                        <div className={"ml-2.5 shrink-0"}>订阅量</div>
                    </div>
                    <div className={"flex items-center"}>
                        <div className="w-2.5 h-2.5 bg-[#1db48d] rd-5  pr-2.5 shrink-0"></div>
                        <div className={"ml-2.5 shrink-0"}>加速计划</div>
                    </div>
                    <DatePicker.RangePicker
                        value={[
                            startDate ? dayjs(startDate) : null,
                            endDate ? dayjs(endDate) : null,
                        ]}
                        format={dateFormat}
                        onChange={onDateChange}
                        disabledDate={disabledDate}
                    />
                </div>
            </div>
            <div className="w-full h-90">
                <Echarts startDate={startDate} endDate={endDate}></Echarts>
            </div>
        </div>
    )
}
export default Chart;
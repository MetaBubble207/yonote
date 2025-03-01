"use client";
import { DatePicker } from "antd";
import React, { Suspense, useState } from "react";
import dayjs from "dayjs";
import Echarts from "@/app/writer/(common)/homepage/components/Echarts";

const Chart = ({ columnId }: { columnId: string | undefined }) => {
  const dateFormat = "YYYY/MM/DD";
  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);
  const onDateChange = (date) => {
    const [date1, date2] = date;
    setStartDate(date1 ? date1.toDate() : null);
    setEndDate(date2 ? date2.toDate() : null);
  };

  const disabledDate = (time: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return time && time > today;
  };

  return (
    <div className="pt-32px rounded-2.5 w-full bg-[#FFF] pl-8 pr-7">
      <div className={"flex w-full items-center justify-between"}>
        <span className="text-4 font-700 lh-6 text-[#323232]">
          数据分析图表
        </span>
        <div className="text-3.5 space-x-40px flex items-center">
          <div className={"flex items-center"}>
            <div className="rd-5 h-2.5 w-2.5 shrink-0 bg-[#71AFFF] pr-2.5"></div>
            <div className={"ml-2.5 shrink-0"}>阅读量</div>
          </div>
          <div className={"flex items-center"}>
            <div className="rd-5 h-2.5 w-2.5 shrink-0 bg-[#fdb069] pr-2.5"></div>
            <div className={"ml-2.5 shrink-0"}>订阅量</div>
          </div>
          <div className={"flex items-center"}>
            <div className="rd-5 h-2.5 w-2.5 shrink-0 bg-[#1db48d] pr-2.5"></div>
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
      <div className="h-90 w-full">
        <Echarts startDate={startDate} endDate={endDate} columnId={columnId} />
      </div>
    </div>
  );
};
export default Chart;

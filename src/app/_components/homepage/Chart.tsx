"use client"
import {ConfigProvider, DatePicker} from "antd";
import locale from "antd/locale/zh_CN";
import React, {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import Echarts from "@/app/_components/homepage/Echarts";

const Chart = () => {
    const [daterange, setdaterange] = useState<[string, string]>(['', '']);
    const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: any) => {
        if (dates) {
            console.log(dateStrings[0], dateStrings[1]);
            setdaterange(dateStrings);
        } else {
            console.log('Clear');
        }
    };

    const disabledDate = (time: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return time && time > today;
    };
    dayjs.locale('zh-cn');

    return (
        <div className="w-full h-117.49775 pt-32px pl-8 pr-7 border-rd-[10px_10px_0px_0px] bg-[#FFF]">
            <div className={"w-full flex items-center justify-between"}>
                <span className="text-[#323232] text-4 font-700 lh-6">数据分析图表</span>
                <div className=" text-3.5 flex items-center space-x-40px">
                    <div className={"flex items-center"}>
                        <div className="w-2.5 h-2.5 bg-[#71AFFF] rd-5  pr-2.5 shrink-0"></div>
                        <div className={"shrink-0"}>阅读量</div>
                    </div>
                    <div className={"flex items-center"}>
                        <div className="w-2.5 h-2.5 bg-[#fdb069] rd-5  pr-2.5 shrink-0"></div>
                        <div className={"shrink-0"}>订阅量</div>
                    </div>
                    <div className={"flex items-center"}>
                        <div className="w-2.5 h-2.5 bg-[#1db48d] rd-5  pr-2.5 shrink-0"></div>
                        <div className={"shrink-0"}>加速计划</div>
                    </div>
                    <ConfigProvider locale={locale}>
                        <DatePicker.RangePicker style={{width: '100%'}} onChange={onRangeChange}
                                                disabledDate={disabledDate}/>
                    </ConfigProvider>
                </div>
            </div>
            <div className="w-full h-90 ">
                <Echarts daterange={daterange}></Echarts>
            </div>
        </div>
    )
}
export default Chart;
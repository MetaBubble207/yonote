'use client'
import {ConfigProvider, DatePicker} from 'antd';
import dayjs, {type Dayjs} from 'dayjs';
import React from "react";
import 'dayjs/locale/zh-cn';
import locale from "antd/locale/zh_CN";

const {RangePicker} = DatePicker;

interface DisabledDateProps {
    currentDate: Dayjs;
    info?: { from?: Dayjs };
}

const disabledDate = (props: DisabledDateProps) => {
    const { currentDate, info } = props;
    // 禁用当前日期之后的日期
    return currentDate.isAfter(dayjs(), 'day');
};

const dateFormat = 'YYYY/MM/DD';
const Date = () => {
    return (
        <div className='w-56 h-8'>
            <ConfigProvider locale={locale}>
                <RangePicker  defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
                              format={dateFormat} disabledDate={(currentDate, info) => disabledDate({ currentDate, info })}/>
            </ConfigProvider>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
           </div>
    )
}
export default Date

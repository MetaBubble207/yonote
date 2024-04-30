'use client'
import {DatePicker} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import React from "react";
dayjs.extend(weekday)
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
dayjs.extend(localeData)
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
dayjs.extend(customParseFormat);
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
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
            <RangePicker defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
                         format={dateFormat} disabledDate={(currentDate, info) => disabledDate({ currentDate, info })}/>
        </div>
    )
}
export default Date
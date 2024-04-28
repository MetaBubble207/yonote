'use client'
import {DatePicker} from 'antd';
import dayjs from 'dayjs';
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

const dateFormat = 'YYYY/MM/DD';
const Date = () => {
    return (
        <div className='w-56 h-8'>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
            <RangePicker defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
                         format={dateFormat}/>
        </div>
    )
}
export default Date
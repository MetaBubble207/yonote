import React, { useState } from 'react';
import { ConfigProvider, DatePicker, Space } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import data from './imitate.json'
import Echarts from './Echarts';
import { log } from 'console';

const Daterange: React.FC = () => {

    const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
    let dateStrings: string[] = [];
    const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
        if (dates) {
            console.log(dateStrings[0], dateStrings[1]);
        } else {
            console.log('Clear');
        }
    };
    console.log(1232, dateStrings);


    const disabledDate = (time: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return time && time > today;
    };
    dayjs.locale('zh-cn');
    return (
        <ConfigProvider locale={locale}>
            <DatePicker.RangePicker style={{ width: '100%' }} disabledDate={disabledDate} onChange={onRangeChange} />
        </ConfigProvider>
    );
}
export default Daterange;

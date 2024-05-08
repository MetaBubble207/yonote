import React, { useState } from 'react';
import { ConfigProvider, DatePicker, Space } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import data from './imitate.json'
import Echarts from './Echarts';

const Daterange: React.FC = (props,ref) => {

    const [selectedDates] = useState<[Date, Date] | null>(null);
    const [daterange,setdaterange] = useState<[string, string]>(['','']);
    const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings:any) => {
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
        <>
            <ConfigProvider locale={locale}>
                <DatePicker.RangePicker style={{ width: '100%' }} onChange={onRangeChange} disabledDate={disabledDate}/>
            </ConfigProvider>
            <div className='w-1200px h-50px relative right-940px'>
                <Echarts daterange={daterange}></Echarts>
            </div>

        </>

    );
}
export default Daterange;
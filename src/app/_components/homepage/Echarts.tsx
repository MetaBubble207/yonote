"use client"
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import imitate from './imitate.json'

interface EchartsProps {
    daterange: [string, string];
}

const Echarts = ({daterange}: EchartsProps, ref: React.RefObject<any>) => {

    interface ImitateItem {
        date: string;
        read_count: number;
        subscribe_count: number;
        accelerate_plan_count: number;
        work_id: number;
    }

    // 定义数据的类型
    const newxaxis_read: number[] = imitate.map((item: ImitateItem) => {
        return item.read_count;
    });
    const newxaxis_subscribe: number[] = imitate.map((item: ImitateItem) => {
        return item.subscribe_count;
    });
    const newxaxis_accelerate: number[] = imitate.map((item: ImitateItem) => {
        return item.accelerate_plan_count;
    });
    const newyaxis: string[] = imitate.map((item: ImitateItem) => {
        return item.date;
    });

    const splitDate = (daterange: [string, string], date: ImitateItem[]): number[] => {
        const targetStartDate = daterange[0];
        const targetEndDate = daterange[1];
        const targetIndexes: number[] = [];

        for (let i = 0; i < date.length; i++) {
            const currentDate = date[i]?.date;
            if (currentDate && currentDate >= targetStartDate && currentDate <= targetEndDate) {
                targetIndexes.push(i);
            }
        }
        console.log(targetIndexes);

        return targetIndexes;
    };


    // 获取符合条件的数据索引
    const all: number[] = imitate.map((item: ImitateItem) => {
        return item.work_id;
    });
    // 根据筛选出的数据索引，更新图表的数据
    const [targetIndexes, settargetIndexes] = useState<number[]>(all);

    useEffect(() => {
        if (daterange[0] == '' && daterange[1] == '') {
            settargetIndexes(all);
        } else {
            settargetIndexes(splitDate(daterange, imitate));
            console.log(daterange);
        }
    }, [daterange]);


    // 根据筛选出的数据索引，更新图表的数据
    const filteredNewxaxis_read = targetIndexes.map(index => newxaxis_read[index]);
    const filteredNewxaxis_subscribe = targetIndexes.map(index => newxaxis_subscribe[index]);
    const filteredNewxaxis_accelerate = targetIndexes.map(index => newxaxis_accelerate[index]);
    const filteredNewyaxis = targetIndexes.map(index => newyaxis[index]);

    const option = {
        // width: 1146,
        // height: 469,
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: filteredNewyaxis,
        },
        yAxis: {},
        series: [
            {
                name: '阅读量',
                type: 'line',
                smooth: true,
                color: '#71AFFF',
                symbol: 'none',
                data: filteredNewxaxis_read,
            },
            {
                name: '订阅量',
                type: 'line',
                smooth: true,
                color: '#fdb069',
                symbol: 'none',
                data: filteredNewxaxis_subscribe,
            },
            {
                name: '加速计划',
                type: 'line',
                smooth: true,
                color: '#1db48d',
                symbol: 'none',
                data: filteredNewxaxis_accelerate,
            }
        ]
    };

    return (
        <ReactECharts option={option}/>
    );
};

export default Echarts;

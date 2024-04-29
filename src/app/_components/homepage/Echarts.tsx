"use client"
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Hedvig_Letters_Sans } from 'next/font/google';
import imitate from './imitate.json'
import { log } from 'console';
import { any, never, number, set } from 'zod';
import { loggerLink } from '@trpc/client';
import Daterange from './Daterange';

const Echarts = (props: any, ref: any) => {

    const splitDate = (daterange: [string, string], date: Array<any>) => {
        const targetStartDate = daterange[0];
        const targetEndDate = daterange[1];
        const targetIndexes: number[] = [];

        for (let i = 0; i < date.length; i++) {
            const currentDate = date[i].date;
            if (currentDate >= targetStartDate && currentDate <= targetEndDate) {
                targetIndexes.push(i);
            }
        }
        console.log(targetIndexes);

        return targetIndexes;
    };

    const newxaxis_read = imitate.map((item: any) => {
        return item.read_count;
    })
    const newxaxis_subscribe = imitate.map((item: any) => {
        return item.subscribe_count;
    })
    const newxaxis_accelerate = imitate.map((item: any) => {
        return item.accelerate_plan_count;
    })
    const newyaxis = imitate.map((item: any) => {
        return item.date;
    })
    // 获取符合条件的数据索引
    const all = imitate.map((item: any) => {
        return item.work_id;
    })
    const [targetIndexes, settargetIndexes] = useState(all)
    useEffect(() => {
        if(props.daterange == 0){
            settargetIndexes(all);
        }else{
            settargetIndexes(splitDate(props.daterange,imitate))
            console.log(splitDate(props.daterange,imitate));
            
        }
    }, [props.daterange]);
    

    // 根据筛选出的数据索引，更新图表的数据
    const filteredNewxaxis_read = targetIndexes.map(index => newxaxis_read[index]);
    const filteredNewxaxis_subscribe = targetIndexes.map(index => newxaxis_subscribe[index]);
    const filteredNewxaxis_accelerate = targetIndexes.map(index => newxaxis_accelerate[index]);
    const filteredNewyaxis = targetIndexes.map(index => newyaxis[index]);
            
    const option = {
        width: 1010,
        height: 220,
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
        <div>
            <ReactECharts option={option} />
        </div>

    );
};

export default Echarts;

"use client"
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Hedvig_Letters_Sans } from 'next/font/google';
import data from './imitate.json'
import { log } from 'console';



const Echarts = ({ }) => {
    const newxaxis_read = data.map((item: any) => {
        return item.read_count;
    })
    const newxaxis_subscribe = data.map((item: any) => {
        return item.subscribe_count;
    })
    const newxaxis_accelerate = data.map((item: any) => {
        return item.accelerate_plan_count;
    })
    const newyaxis = data.map((item: any) => {
        return item.date;
    })
    console.log();

    const option = {
        width: 1010,
        height: 220,
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: newyaxis,

        },
        yAxis: {},
        series: [
            {
                name: '阅读量',
                type: 'line',
                smooth: true,
                color: '#71AFFF',
                symbol: 'none',
                data: newxaxis_read,
            },
            {
                name: '订阅量',
                type: 'line',
                smooth: true,
                color: '#fdb069',
                symbol: 'none',
                data: newxaxis_subscribe,
            },
            {
                name: '加速计划',
                type: 'line',
                smooth: true,
                color: '#1db48d',
                symbol: 'none',
                data: newxaxis_accelerate,
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



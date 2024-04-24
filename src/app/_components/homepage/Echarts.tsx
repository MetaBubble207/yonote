"use client"
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Hedvig_Letters_Sans } from 'next/font/google';


const Echarts = () => {
    const option = {
        width: 1010,
        height: 220,
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],

        },
        yAxis: {},
        series: [
            {
                name: '阅读量',
                type: 'line',
                smooth: true,
                color: '#71AFFF',
                symbol: 'none',
                data: [5, 20, 36, 10, 10, 20, 30]
            },
            {
                name: '订阅量',
                type: 'line',
                smooth: true,
                color: '#fdb069',
                symbol: 'none',
                data: [5, 50, 30, 50, 20, 20, 4]
            },
            {
                name: '加速计划',
                type: 'line',
                smooth: true,
                color: '#1db48d',
                symbol: 'none',
                data: [6, 30, 50, 22, 35, 62, 70]
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



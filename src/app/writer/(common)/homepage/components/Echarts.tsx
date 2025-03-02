"use client";
import React from "react";
import ReactECharts from "echarts-for-react";
import { api } from "@/trpc/react";
import Loading from "@/app/_components/common/Loading";
import NoData from "@/app/_components/common/NoData";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";

export const Echarts = ({
  startDate,
  endDate,
  columnId,
}: {
  startDate: string;
  endDate: string;
  columnId: string;
}) => {
  const { data, isLoading } = api.read.getHomePageDataRange.useQuery(
    { columnId: columnId, start: startDate, end: endDate },
    { enabled: Boolean(columnId) },
  );

  // 生成日期范围内的所有日期
  const generateDateRange = (start: string, end: string) => {
    const dates = [];
    let current = dayjs(start);
    const endDate = dayjs(end);

    while (current.isSame(endDate) || current.isBefore(endDate)) {
      dates.push(current.format('MM-DD'));
      current = current.add(1, 'day');
    }

    return dates;
  };

  // 生成日期数组
  const dateArr = generateDateRange(startDate, endDate);

  if (isLoading)
    return (
      <div className={"flex h-60 items-center justify-center"}>
        <Loading />
      </div>
    );
  if (!data) return <NoData title={"请先选择日期噢"} />;

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let result = params[0].axisValue + '<br/>';
        params.forEach((param: any) => {
          result += param.marker + ' ' + param.seriesName + ': ' + param.value + '<br/>';
        });
        return result;
      }
    },
    legend: {
      data: ["阅读量", "订阅量", "加速计划"],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateArr,
      axisLabel: {
        rotate: dateArr.length > 12 ? 12 : 0, // 当日期较多时旋转标签
        interval: dateArr.length > 30 ? 'auto' : 0 // 自动间隔显示
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: "阅读量",
        type: "line",
        smooth: true,
        color: "#71AFFF",
        symbol: "circle",
        symbolSize: 5,
        data: data.readCount,
      },
      {
        name: "订阅量",
        type: "line",
        smooth: true,
        color: "#fdb069",
        symbol: "circle",
        symbolSize: 5,
        data: data.subscriptionCount,
      },
      {
        name: "加速计划",
        type: "line",
        smooth: true,
        color: "#1db48d",
        symbol: "circle",
        symbolSize: 5,
        data: data.speedUpCount,
      },
    ],
  };

  return <ReactECharts style={{ height: "100%" }} option={option} />;
};
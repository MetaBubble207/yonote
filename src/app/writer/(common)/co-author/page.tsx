"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Page: React.FC = () => {
  const calculateTimeLeft = (): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } => {
    const targetDate = new Date(
      "Tue May 28 2024 22:04: 36 GMT +0800(中国标准时间)",
    );

    const difference = +targetDate - +new Date();
    let days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0;

    if (difference > 0) {
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((difference / 1000 / 60) % 60);
      seconds = Math.floor((difference / 1000) % 60);
    }

    return { days, hours, minutes, seconds };
  };

  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setDay(newTimeLeft.days);
      setHour(newTimeLeft.hours);
      setMinute(newTimeLeft.minutes);
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="rounded-2.5 relative h-full w-full bg-[#FFF] pt-8">
      <div className="ml-8.5 text-4 font-700 lh-6 text-[#323232]">共创会员</div>

      <div className="mt-8.25 flex h-8 w-full items-center">
        <div className="ml-8.5 border-rd-1 text-3.5 font-400 lh-5.5 flex h-8 w-8 items-center justify-center bg-[rgba(69,225,184,0.20)] text-[#1DB48D]">
          {day}
        </div>
        <div className="w-1.442 text-3.5 font-400 lh-5.5 ml-1 text-[#1DB48D]">
          :
        </div>
        <div className="border-rd-1 text-3.5 font-400 lh-5.5 ml-1 flex h-8 w-8 items-center justify-center bg-[rgba(69,225,184,0.20)] text-[#1DB48D]">
          {hour}
        </div>
        <div className="w-1.442 text-3.5 font-400 lh-5.5 ml-1 text-[#1DB48D]">
          :
        </div>
        <div className="border-rd-1 text-3.5 font-400 lh-5.5 ml-1 flex h-8 w-8 items-center justify-center bg-[rgba(69,225,184,0.20)] text-[#1DB48D]">
          {minute}
        </div>
        <div className="ml-2.7 font-Abel text-3.5 font-400 lh-5.5 flex items-center justify-center text-[rgba(0,0,0,0.65)]">
          到期时间：2024-5-28 21:43:59
        </div>
        <Link
          target="_blank"
          href={"https://work.weixin.qq.com/kfid/kfc3048f784babcb1cc"}
        >
          <div className="w-14.82325 font-Abel text-3 font-400 lh-5.5 ml-4.5 text-[#1DB48D]">
            延长权益
          </div>
        </Link>
      </div>

      <Image
        src={"/images/writer/co-author/painting.svg"}
        alt={"painting"}
        width={20}
        height={20}
        className="ml-82.5 mt-20.85 w-128.82325 h-95.48875"
      />
      <div className="mt-16.75 ml-112 w-63.3 font-Abel text-4 font-400 lh-5.5 text-[rgba(0,0,0,0.65)]">
        更多功能和权益开发中-
        <Link
          target="_blank"
          href={
            "https://eahu7fmu6k6.feishu.cn/wiki/S4elwZgXgig8HTkS9nCcAhd7nwb"
          }
        >
          <div className="inline">查看权益</div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

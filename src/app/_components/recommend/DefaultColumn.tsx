import Image from "next/image";
import {api} from "@/trpc/react";
import React, {useState, useEffect} from "react";
import {timeToDateString} from "@/tools/timeToString";
import Link from "next/link";
import DefaultColumnCard from "@/app/_components/recommend/DefaultColumnCard";

export const DefaultColumn = () => {
   const data = api.column.getAll.useQuery()
    return (
        <div>
            {data.data?.map((data, index) => (
            <DefaultColumnCard key={index} data={data} ></DefaultColumnCard>
            ))}
        </div>
    );
};

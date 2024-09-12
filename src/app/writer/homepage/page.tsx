"use client"
import React from "react";
import HomepageData from "@/app/_components/writer/homepage/HomepageData";
import Chart from "@/app/_components/writer/homepage/Chart";

const Page = ({
                  params,
                  searchParams,
              }: {
    params: { slug: string };
    searchParams: { columnId: string | undefined };
}) => {
    return (
        <div className="w-full h-full">
            <div className="w-full">
                <HomepageData columnId={searchParams?.columnId}/>

            </div>
            <div className="pt-4 w-full">
                <Chart columnId={searchParams?.columnId}/>
            </div>
        </div>
    )
}

export default Page;



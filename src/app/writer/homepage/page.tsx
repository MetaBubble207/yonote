"use client"
import React, {Suspense} from "react";
import HomepageData from "@/app/_components/writer/homepage/HomepageData";
import Chart from "@/app/_components/writer/homepage/Chart";

const Page = () => {
    return (
        <div className="w-full h-full">
            <div className="w-full">
                <Suspense>
                    <HomepageData/>
                </Suspense>

            </div>
            <div className="pt-4 w-full">
                <Chart/>
            </div>
        </div>
    )
}

export default Page;



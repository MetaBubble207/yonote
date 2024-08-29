import React from "react";
import HomepageData from "@/app/_components/writer/homepage/HomepageData";
import Chart from "@/app/_components/writer/homepage/Chart";

const Page = () => {
    return (
        <div className="w-full h-full">
            <div className="w-full">
                <HomepageData/>
            </div>
            <div className="pt-4 w-full">
                <Chart></Chart>
            </div>
        </div>
    )
}

export default Page;



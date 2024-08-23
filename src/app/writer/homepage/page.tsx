import React from "react";
import HomepageData from "@/app/_components/homepage/HomepageData";
import Chart from "@/app/_components/homepage/Chart";

const homepage = () => {

    return (
        <div className="w-full flex flex-col">
            <div className="pt-16px px-18px w-full">
                <HomepageData/>
            </div>
            <div className="pt-16px px-18px w-full">
                <Chart></Chart>
            </div>
        </div>
    )

}

export default homepage;



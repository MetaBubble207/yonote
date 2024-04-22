import React from "react";
import Compass from "../compass/page";
import Homepagedata from "@/app/_components/homepage/Homepagedata";
import Chart from "@/app/_components/homepage/Chart";
import left_compass from "../left-compass/page";
const homepage = () => {

    return (
        <div>
            {Compass()}
            <div className="flex">
                {left_compass()}
                <div className="flex flex-col">
                    <div className="mt-16px ml-18px">
                        <Homepagedata />
                    </div>
                    <div className="mt-16px ml-18px">
                        <Chart></Chart>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default homepage;



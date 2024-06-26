import React, {Suspense} from "react";
import Homepagedata from "@/app/_components/homepage/Homepagedata";
import Chart from "@/app/_components/homepage/Chart";
const homepage = () => {

    return (
        <div className="w-291 flex flex-col">
            <div className="mt-16px ml-18px">
                <Suspense>
                    <Homepagedata/>
                </Suspense>
            </div>
            <div className="mt-16px ml-18px">
                <Chart></Chart>
            </div>
        </div>
    )

}

export default homepage;



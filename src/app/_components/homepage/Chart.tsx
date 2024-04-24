"use client"
import Echarts from "./Echarts";
import Daterange from "./Daterange"

const Chart = () => {
    return (
        <div className="w-286.738 h-117.49775 border-rd-[10px_10px_0px_0px] bg-[#FFF]">
            <div className="flex w-100% h-32px items-center justify-between pt-32px pl-32px pr-28px">
                <span className="text-[#323232] text-4 font-700 lh-6">数据分析图表</span>
                <div className="text-[rgba(0,0,0,0.65)] text-3.5 flex items-center">
                    <div className="mr-40px">
                        <div className="w-2.5 h-2.5 bg-[#71AFFF] rd-5 inline-block mr-10px"></div>
                        阅读量
                    </div>
                    <div className="mr-40px">
                        <div className="w-2.5 h-2.5 bg-[#fdb069] rd-5 inline-block mr-10px"></div>
                        订阅量
                    </div>
                    <div className="mr-40px">
                        <div className="w-2.5 h-2.5 bg-[#1db48d] rd-5 inline-block mr-10px"></div>
                        加速计划
                    </div>
                    <div className="w-55.5 h-8 stroke-0.25 border-1 border-solid border-[#d9d9d9] rd-1">

                    </div>
                </div>
            </div>

            <Echarts></Echarts>
            <Daterange></Daterange>
        </div>
    )
}
export default Chart;
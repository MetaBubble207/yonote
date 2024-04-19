import React from "react";
import Image from "next/image";

const Compass= () => {

    return (
        <div>
            <div className="w-360 h-17.5 shrink-0 bg-[#FFF]">
                <div className="flex items-center w-107.55675 h-11.75 shrink-0 ml-7.1975 mt-2.875">
                    <div className="inline-flex w-20 h-9.48025 items-center">
                        <Image src={"/images/logo.svg"} alt={"logo"} width={30.3} height={30.42} className="w-7.57425 h-8.35625 shrink-0"></Image>
                        <div className="ml-2">
                            <div className=" shrink-0 font-size-4">
                                有记
                            </div>
                            <div className="shrink-0 font-size-2 tracking-1.2">
                                YoNote
                            </div>
                        </div>
                    </div>
                    <div className="text-[#323232] text-3.5 font-not-italic font-400 lh-6 ml-17.5575 ">
                        官网
                        <button></button>
                    </div>
                    <div className="text-[#323232] text-3.5 font-not-italic font-400 lh-6 ml-15">
                        专栏申请
                        <button></button>
                    </div>
                    <div className="text-[#323232] text-3.5 font-not-italic font-400 lh-6 ml-15">
                        反馈社区
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Compass;
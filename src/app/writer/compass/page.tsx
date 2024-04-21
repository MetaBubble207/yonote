import React from "react";
import Image from "next/image";

const Compass= () => {
    const name = "我的昵称"

    return (
        <div>
            <div className="w-360 h-17.5 shrink-0 bg-[#FFF] flex items-center">
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
                    <div className="text-[#323232] text-3.5 font-400 lh-6 ml-17.5575 ">
                        官网
                        <button></button>
                    </div>
                    <div className="text-[#323232] text-3.5 font-400 lh-6 ml-15">
                        专栏申请
                        <button></button>
                    </div>
                    <div className="text-[#323232] text-3.5 font-400 lh-6 ml-15">
                        反馈社区
                    </div>
                </div>
                <div>
                    <Image src={"/images/writer/Ellipse 7.svg"} alt="Ellipse 7" width={44} height={44} className="w-11 h-11 shrink-0 border-rd-11 ml-183"></Image>
                </div>
                <div className="ml-3.4275">
                    {name}
                </div> 
                <div>
                    <select name="" id="">
                        <option value=""> </option>
                        <option value="">退出登录</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
export default Compass;
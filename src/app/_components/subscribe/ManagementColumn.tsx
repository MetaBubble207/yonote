"use client"
import Image from "next/image"
import { Radio, RadioChangeEvent} from "antd";
import {useState} from "react";
const ManagementColumn = () => {
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    return (
        <div className="w-85.75 h-20.471 bg-#fff m-auto border-rd-2.5 flex">
            <div>
                    <Radio.Group onChange={onChange} value={value} className={"flex flex-col"}>
                        <Radio value={1}>
                            <div className={"flex"}>
                                <Image src={"/images/subscribe/cover.png"} width={100} height={100} alt={"cover"} className="w-11.375 h-15.478"></Image>
                                <div className="ml-3 mt-3 flex-1">
                                    <h3 className="text-[#252525] text-3 font-500 lh-6">「显示不够的话开播的第3年，P人沉...」</h3>
                                    <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">显示多少然后开始了...</h4>
                                </div>
                            </div>
                        </Radio>
                        <Radio value={2}>
                            <div className={"flex"}>
                                <Image src={"/images/subscribe/cover.png"} width={100} height={100} alt={"cover"} className="w-11.375 h-15.478"></Image>
                                <div className="ml-3 mt-3 flex-1">
                                    <h3 className="text-[#252525] text-3 font-500 lh-6">「显示不够的话开播的第3年，P人沉...」</h3>
                                    <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">显示多少然后开始了...</h4>
                                </div>
                            </div>
                        </Radio>
                        <Radio value={3}>
                            <div className={"flex"}>
                                <Image src={"/images/subscribe/cover.png"} width={100} height={100} alt={"cover"} className="w-11.375 h-15.478"></Image>
                                <div className="ml-3 mt-3 flex-1">
                                    <h3 className="text-[#252525] text-3 font-500 lh-6">「显示不够的话开播的第3年，P人沉...」</h3>
                                    <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">显示多少然后开始了...</h4>
                                </div>
                            </div>
                        </Radio>
                        <Radio value={4}>
                            <div className={"flex"}>
                                <Image src={"/images/subscribe/cover.png"} width={100} height={100} alt={"cover"} className="w-11.375 h-15.478"></Image>
                                <div className="ml-3 mt-3 flex-1">
                                    <h3 className="text-[#252525] text-3 font-500 lh-6">「显示不够的话开播的第3年，P人沉...」</h3>
                                    <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">显示多少然后开始了...</h4>
                                </div>
                            </div>
                        </Radio>
                    </Radio.Group>


            </div>
        </div>
    )
}

export default ManagementColumn

"use client";

import Image from "next/image"
import React, {useState} from "react"

const wallet = () => {
    let count = 1234.01;
    let frozen = 1234.22;
    let cashable = 1234.78;


    const [selectedButton, setSelectedButton] = useState<number | null>(1); // 追踪选中的按钮

    const handleButtonClick = (button:number) => {
        if (selectedButton !== button) {
            // 如果点击的是当前选中的按钮，则取消选中状态
            setSelectedButton(button);
        } 
    };

    return (
        <div>
            <div className="flex items-center mt-8 justify-center">
                <Image src={"/images/wallet/bg.png"} alt={"bg"} width={343} height={164} className="w-85.75 h-41 shrink-0"></Image>
                <div className="fixed w-85.75 h-41 shrink-0">
                    <div className="flex flex-col"> 
                        <div className="w-16 text-[#FFF] text-4 font-not-italic font-400 lh-6 ml-6 mt-6">
                            账户余额
                        </div>
                        <div className="w-25 text-[#FFF] font-D-DIN text-6 font-not-italic font-700 lh-6 ml-6 mt-2">
                            ¥{count}
                        </div>
                        <div className="flex flex-wrap  h-6 shrink-0 text-[#FFF]">
                            <div className="ml-6 mt-9">
                                冻结中 <span>¥{frozen}</span>
                            </div>
                            <div className="ml-11.75 mt-9">
                                可提现 <span>¥{cashable}</span>
                            </div>
                        </div>
                        <div className="w-7.5 text-[#252525] text-3 font-500 lh-6 ml-73.75 mt--8">
                            <button>提现</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-14 h-7.75 shrink-0 mt-6 ml-9 flex flex-col justify-center items-center">
                <div className="text-[#252525] text-3.5 font-not-italic font-500 lh-6">收支明细</div>
                <div className="w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
            </div>
            <div className="flex mt-4 ml-9">
                <button className={`w-15 h-6 shrink-0 border-rd-1 ${selectedButton === 1 ? 'bg-#daf9f1 text-#1db48d' : 'bg-[#F5F7FB] text-[#252525]'}`} onClick={() => handleButtonClick(1) }>
                    支出
                </button>
                <button className={`w-15 h-6 shrink-0 border-rd-1  ml-6 ${selectedButton === 2 ? 'bg-#daf9f1 text-#1db48d' : ' bg-[#F5F7FB] text-[#252525]'}`} onClick={() => handleButtonClick(2)}>
                    收入
                </button>
            </div>
            <div className="flex items-center justify-center">
                <div></div>
            </div>
        </div>
    );
}

export default wallet;
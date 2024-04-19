"use client";

import React, { useState } from "react";
import Image from "next/image";

const Reserved = () => {
    const [selectedButton, setSelectedButton] = useState<number | null>(null); // 追踪选中的按钮

    const handleButtonClick = (button:number) => {
        if (selectedButton === button) {
            // 如果点击的是当前选中的按钮，则取消选中状态
            setSelectedButton(null);
        } else {
            // 否则设置点击的按钮为选中状态
            setSelectedButton(button);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-36.75 text-[#252525] text-3.75 font-500 lh-6 m-auto mt-2">「心智与阅读系列」</div>
            <div className="mt-6">
                <button className={`w-84.25 h-10 shrink-0 border-rd-1.25 border-1 border-solid bg-[#F5F7FB] justify-center ${selectedButton === 1 ? 'border-[#45E1B8]' : ''}`} onClick={() => handleButtonClick(1)}>
                    <div className="flex ml-2.5 items-center ">
                        <div className="w-4.25 h-6.158 shrink-0 text-[#252525] text-3.5 font-700 lh-6">¥10</div>
                        <div className="w-29.25 ml-1 h-6.158 shrink-0 text-[#B5B5B5] text-3 font-500 lh-6">一次购买，永久有效</div>
                        {selectedButton === 1 && (
                        <Image src="/images/dialog/check.png" alt="check" width={20} height={20} className="ml-39 w-5 h-5" />
                    )}
                    </div>
                    
                </button>
                <button className={`block w-84.25 h-10 shrink-0 border-rd-1.25 border-1 mt-2 border-solid bg-[#F5F7FB] ${selectedButton === 2 ? 'border-[#45E1B8]' : ''}`} onClick={() => handleButtonClick(2)}>
                    <div className="flex ml-2.5 items-center  ">
                        <div className="w-5 text-[#252525] text-3.5 font-700 lh-6">¥20</div>
                        <div className="w-33.5 ml-1 text-[#B5B5B5] text-3 font-500 lh-6 ">限时购买，有效期30天</div>
                        {selectedButton === 2 && (
                        <Image src="/images/dialog/check.png" alt="check" width={20} height={20} className="right-8 absolute w-5 h-5" />
                    )}
                    </div>
                </button>
            </div>
            <div className="w-85 mt-4 text-[#666] text-2.5 font-not-italic font-500 lh-6 m-auto">*内容为第三方个人创建，购买前请知晓内容，服务及相关风险，购买后 24 小时内可申请退款</div>
            <div className="w-85.75 h-10 shrink-0 mt-8">
                <button>
                    {/* 支付跳转 */}
                    <Image src="/images/dialog/pay.png" alt="pay" width={343} height={40} className="h-10 w-85.75" />
                </button>
            </div>
        </div>
    );
}

export default Reserved;
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useSearchParams } from "next/navigation";

const Reserved = ({ onClose, check }) => {
    const params = useSearchParams();
    const columnID = params.get("id");
    const token = useLocalStorage("token", null);
    const column = api.column.getColumnDetail.useQuery({ columnId: columnID }).data;
    const columnUserId = api.column.getUserId.useQuery({ id: columnID });
    const subscribeOrder = api.order.createOrder.useMutation({
        onSuccess: (r) => {
            onClose();
            console.log(r);
            console.log("订阅成功");
        },
        onError: (e) => {
            console.log(e);
            console.log("订阅失败");
        }
    })

    const handle = () => {
        if (check) {
            // 在组件渲染完成后执行订阅订单操作
            subscribeOrder.mutate({
                ownerID: columnUserId.data,
                name: columnID,
                price: 10,
                payment: "alipay",
                status: check,
                buyerID: token[0],
            });
        };
    }

    const [selectedButton, setSelectedButton] = useState<number | null>(null); // 追踪选中的按钮

    const handleButtonClick = (button: number) => {
        if (selectedButton === button) {
            // 如果点击的是当前选中的按钮，则取消选中状态
            setSelectedButton(null);
        } else {
            // 否则设置点击的按钮为选中状态
            setSelectedButton(button);
        }
    };

    return (
        <div className="flex items-center w-93.75 h-full bg-[#606062] z-1">
            <div className="flex flex-col items-center justify-center b-white fixed right-12px top-60 bg-#fff b-r-10">
                <Image src={"/images/dialog/Close-small.png"} alt="close" width={20} height={20} className="w-20px h-20px ml-335px" onClick={onClose}></Image>
                <div className="w-36.75 text-[#252525] text-3.75 font-500 lh-6 m-auto mt-2">「{column.name}」</div>
                <div className="mt-6">
                    <button className={`w-84.25 h-10 shrink-0 border-rd-1.25 border-1 border-solid bg-[#F5F7FB] justify-center ${selectedButton === 1 ? 'border-[#45E1B8]' : ''}`} onClick={() => handleButtonClick(1)}>
                        <div className="flex ml-2.5 items-center ">
                            <div className="shrink-0 text-[#252525] font-700 lh-6 flex">¥
                                {column.price}
                            </div>
                            <div className="w-29.25 ml-1 h-6.158 shrink-0 text-[#B5B5B5] text-3 font-500 lh-6">一次购买，永久有效</div>
                            {selectedButton === 1 && (
                                <Image src="/images/dialog/check.png" alt="check" width={20} height={20} className="ml-39 w-5 h-5" />
                            )}
                        </div>
                    </button>
                    <button className={`block w-84.25 h-10 shrink-0 border-rd-1.25 border-1 mt-2 border-solid bg-[#F5F7FB] ${selectedButton === 2 ? 'border-[#45E1B8]' : ''}`} onClick={() => handleButtonClick(2)}>
                        <div className="flex ml-2.5 items-center  ">
                            <div className=" text-[#252525] text-3.5 font-700 lh-6">¥{column.price}</div>
                            <div className="w-33.5 ml-1 text-[#B5B5B5] text-3 font-500 lh-6 ">限时购买，有效期30天</div>
                            {selectedButton === 2 && (
                                <Image src="/images/dialog/check.png" alt="check" width={20} height={20} className="right-8 absolute w-5 h-5" />
                            )}
                        </div>
                    </button>
                </div>
                <div className="w-85 mt-4 text-[#666] text-2.5 font-not-italic font-500 lh-6 m-auto">*内容为第三方个人创建，购买前请知晓内容，服务及相关风险，购买后 24 小时内可申请退款</div>
                <div className="w-85.75 h-10 shrink-0 mt-8">
                    <button onClick={handle}>
                        {/* 支付跳转 */}
                        <Image src="/images/dialog/pay.png" alt="pay" width={343} height={40} className="h-10 w-85.75" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reserved;
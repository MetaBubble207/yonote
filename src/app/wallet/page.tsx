"use client";
import Image from "next/image"
import React, {useState, useEffect} from "react"
import {api} from "@/trpc/react";
import Loading from "../_components/common/Loading";
import useLocalStorage from "@/tools/useStore";

interface WalletData {
    balance: number;
    frozenAmount: number;
    cashableAmount: number;
}

const Wallet = () => {
    const [token] = useLocalStorage('token', null);
    const {data: walletData, isLoading} = api.wallet.getByUserId.useQuery({id: token}, {enabled: !!token});
    const [transactionType, setTransactionType] = useState("expenditure"); // 跟踪交易类型


    const [selectedButton, setSelectedButton] = useState(1); // 追踪选中的按钮

    const handleButtonClick = (button: number, type: string) => {
        if (selectedButton !== button) {
            // 如果点击的是当前选中的按钮，则取消选中状态
            setSelectedButton(button);
            setTransactionType(type);
        }
    };
    if(isLoading) return <Loading/>
    return (
        <div>
            <div className="flex items-center mt-8 justify-center">
                <div className="w-85.75 h-41 relative">
                    <Image src={"/images/wallet/bg.svg"} alt={"bg"} width={343} height={164}
                           className="w-85.75 h-41 shrink-0"></Image>
                    <div className=" w-85.75 h-41 shrink-0 absolute top-0">
                        <div className="flex flex-col">
                            <div className="w-16 text-[#FFF] text-4 font-not-italic font-400 lh-6 ml-6 mt-6">
                                账户余额
                            </div>
                            <div className="w-25 text-[#FFF] font-D-DIN text-6 font-not-italic font-700 lh-6 ml-6 mt-2">
                                ¥{walletData?.amountWithdraw + walletData?.freezeIncome}
                            </div>
                            <div className="flex flex-wrap  h-6 shrink-0 text-[#FFF]">
                                <div className="ml-6 mt-9">
                                    冻结中 <span>¥{walletData?.freezeIncome}</span>
                                </div>
                                <div className="ml-11.75 mt-9">
                                    可提现 <span>¥{walletData?.amountWithdraw}</span>
                                </div>
                            </div>
                            <div className="w-7.5 text-[#252525] text-3 font-500 lh-6 ml-73.75 mt--8">
                                <button>提现</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <div className="w-14 h-7.75 shrink-0 mt-6 ml-9 flex flex-col justify-center items-center">
                <div className="text-[#252525] text-3.5 font-not-italic font-500 lh-6">收支明细</div>
                <div className="w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
            </div>
            <div className="flex mt-4 ml-9">
                <button
                    className={`w-15 h-6 shrink-0 border-rd-1 ${selectedButton === 1 ? 'bg-#daf9f1 text-#1db48d' : 'bg-[#F5F7FB] text-[#252525]'}`}
                    onClick={() => handleButtonClick(1, "expenditure")}>
                    支出
                </button>
                <button
                    className={`w-15 h-6 shrink-0 border-rd-1  ml-6 ${selectedButton === 2 ? 'bg-#daf9f1 text-#1db48d' : ' bg-[#F5F7FB] text-[#252525]'}`}
                    onClick={() => handleButtonClick(2, "income")}>
                    收入
                </button>
            </div>
            <div>
                <div className="flex items-center justify-center mt-4 ml-6.5 w-80.5 h-14.25 shrink-0 ">
                    {/*<div className="w-80.5 h-14.25 shrink-0  ">*/}
                    {/*    {payments.map((payment, index) => (*/}
                    {/*        <div key={index}>*/}
                    {/*            {transactionType === "expenditure" && payment.sign === "-¥" && (*/}
                    {/*                <div>*/}
                    {/*                    <div className="ml-0">*/}
                    {/*                        <div*/}
                    {/*                            className="w-27 text-[#252525] text-3.25 font-not-italic font-400 lh-6">{payment.name}</div>*/}
                    {/*                        <div*/}
                    {/*                            className="w-26.5 h-6.25 shrink-0 text-[#999] text-2.75 font-not-italic font-400 lh-6 mt--1">{payment.date} {payment.time}</div>*/}
                    {/*                    </div>*/}
                    {/*                    <div*/}
                    {/*                        className="w-20.75 h-5.5 shrink-0 text-[#252525] text-3.75 font-700 lh-6 ml-62.75 mt--11">{payment.sign}{payment.amount}</div>*/}
                    {/*                    <div className="border-1 mt-5"></div>*/}
                    {/*                    <div className="mt-4"></div>*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*            {transactionType === "income" && payment.sign === "+¥" && (*/}
                    {/*                <div>*/}
                    {/*                    <div className="ml-0">*/}
                    {/*                        <div*/}
                    {/*                            className="w-27 text-[#252525] text-3.25 font-not-italic font-400 lh-6">{payment.name}</div>*/}
                    {/*                        <div*/}
                    {/*                            className="w-26.5 h-6.25 shrink-0 text-[#999] text-2.75 font-not-italic font-400 lh-6 mt--1">{payment.date} {payment.time}</div>*/}
                    {/*                    </div>*/}
                    {/*                    <div*/}
                    {/*                        className="w-20.75 h-5.5 shrink-0 text-[#252525] text-3.75 font-700 lh-6 ml-62.75 mt--11">{payment.sign}{payment.amount}</div>*/}
                    {/*                    <div className="border-1 mt-5"></div>*/}
                    {/*                    <div className="mt-4"></div>*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default Wallet;
"use client";

import React, {useState} from "react";
import Image from "next/image";
import {api} from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import {useSearchParams} from "next/navigation";
import process from "process";
import {message} from "antd";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import Loading from "@/app/_components/common/Loading";

const Reserved = ({onClose, check}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const params = useSearchParams();
    const columnId = params.get("id");
    const invitationCode = params.get("invitationCode");
    const [token] = useLocalStorage("token", null);
    const columnUserId = api.column.getUserId.useQuery({id: columnId});
    const {data: column, isLoading: isColumnLoading} = api.column.getColumnDetail.useQuery({columnId: columnId});
    const priceListData = api.priceList
        .getByColumnId.useQuery({columnId: columnId}, {enabled: !!columnId}).data
        ?.sort((a, b) => a.id - b.id);
    const walletData = api.wallet.getByUserId.useQuery({id: token}, {enabled: !!token}).data;
    const subscribeOrder = api.order.createOrder.useMutation({
        onSuccess: (r) => {
            onClose();
            console.log(r);
            console.log("订阅成功");
            window.location.reload();
        },
        onError: (e) => {
            console.log(e);
            console.log("订阅失败");
        }
    })
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [showConfirmPayModal, setConfirmPayModal] = useState(false);
    const handleClickPay = () => {
        setShowTopUpModal(false);
        setConfirmPayModal(true);
    }


    const [selectedItem, setSelectedItem] = useState(null); // 追踪选中的item

    const handleButtonClick = (item) => {
        if (selectedItem === item) {
            // 如果点击的是当前选中的item，则取消选中状态
            setSelectedItem(null);
        } else {
            // 否则设置点击的item为选中状态
            setSelectedItem(item);
        }
    };

    const popUp = () => {
        setShowTopUpModal(false);
        setConfirmPayModal(true);
    }
    const pay = async () => {
        if (!selectedItem) {
            messageApi.error("请先选择支付策略噢~😁");
            setConfirmPayModal(false);
            return false;
        }
        if (!walletData || walletData.freezeIncome + walletData.amountWithdraw < selectedItem) {
            messageApi.error("钱包余额不足，请先充值噢~😁");
            setShowTopUpModal(true);
            setConfirmPayModal(false);
            return false;
        }
        // 支付
        if (check) {
            // 在组件渲染完成后执行订阅订单操作
            subscribeOrder.mutate({
                ownerId: columnUserId.data,
                columnId: columnId,
                priceListId: selectedItem.id,
                payment: "wallet",
                status: check,
                buyerId: token,
                referrerId: invitationCode
            });
        }
    }
    const createOrder = async () => {
        try {
            const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';

            const reqdata = {
                amount: {
                    total: 100,
                    currency: 'CNY'
                },
                mchid: '1900006891',
                description: 'Image形象店-深圳腾大-QQ公仔',
                notify_url: 'https://www.weixin.qq.com/wxpay/pay.php',
                payer: {
                    openid: token
                },
                out_trade_no: '1217752501201407033233388881',
                goods_tag: 'WXG',
                appid: process.env.NEXT_PUBLIC_APP_ID
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(reqdata)
            });

            if (response.status === 200) {
                const responseData = await response.json();
                console.log('success, return body = ', responseData);
                return responseData;
            } else if (response.status === 204) {
                console.log('success');
            } else {
                const errorData = await response.text();
                console.log('failed, resp code = ', response.status, ', return body = ', errorData);
                throw new Error('request failed');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const placeAnOrderOnWechatPay = async () => {
        await fetch('https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi', {
            method: 'post',
            body: JSON.stringify({
                mchid: process.env.NEXT_PUBLIC_MCHID,
                out_trade_no: "asd1123",
                appid: process.env.NEXT_PUBLIC_APP_ID,
                description: "测试文章购买",
                notify_url: "https://www.weixin.qq.com/wxpay/pay.php",
                amount: {
                    total: 1,
                    currency: "CNY"
                },
                payer: {
                    openid: token
                }
            })
        })
    }
//     function onBridgeReady() {
//         WeixinJSBridge.invoke('getBrandWCPayRequest', {
//                 "appId": "wx2421b1c4370ecxxx",   // 公众号ID，由商户传入
//                 "timeStamp": "1395712654",       // 时间戳，自1970年以来的秒数
//                 "nonceStr": "e61463f8efa94090b1f366cccfbbb444", // 随机串
//                 "package": "prepay_id=wx21201855730335ac86f8c43d1889123400",
//                 "signType": "RSA",               // 微信签名方式
//                 "paySign": "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==" // 微信签名
//             },
//             function(res) {
//                 if (res.err_msg == "get_brand_wcpay_request:ok") {
//                     // 使用以上方式判断前端返回,微信团队郑重提示：
//                     // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
//                 }
//             });
//     }
//
// // 检查 WeixinJSBridge 是否已定义
//     if (typeof WeixinJSBridge == "undefined") {
//         // 如果 WeixinJSBridge 未定义，添加事件监听器
//         if (document.addEventListener) {
//             document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
//         } else if (document.attachEvent) {
//             document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
//             document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
//         }
//     } else {
//         // 如果 WeixinJSBridge 已定义，直接调用 onBridgeReady
//         onBridgeReady();
//     }

    const TopUpModal = () => {
        return <W100H50Modal>
            <div>
                <label htmlFor="">输入充值金额</label>
                <input type="text"/>
            </div>
            <button onClick={() => popUp()}>充值</button>
        </W100H50Modal>
    }
    const ConfirmPayModal = () => {
        return <W100H50Modal>
            <div>确定是否购买该专栏</div>
            <button onClick={pay}>确认</button>
        </W100H50Modal>
    }
    if (isColumnLoading) return <Loading/>
    return (
        <div className="flex items-center w-full h-full z-1 justify-center">
            {contextHolder}
            {showTopUpModal && <TopUpModal/>}
            {showConfirmPayModal && <ConfirmPayModal/>}
            <div className="flex flex-col w-full items-center justify-center b-white fixed bottom-0 bg-#fff pb-10">
                <Image src={"/images/dialog/Close-small.png"} alt="close" width={20} height={20}
                       className="w-20px h-20px ml-335px" onClick={onClose}></Image>
                <div
                    className=" text-[#252525] text-3.75 font-500 lh-6  mt-2 justify-center items-center">「{column?.name?.length >= 18 ? column?.name?.substring(0, 18) + "..." : column.name}」
                </div>
                <div className="mt-6 pl-5">
                    {priceListData?.map((strategy, index) => (
                        <button
                            key={index}
                            className={`w-84.25 h-10 shrink-0 border-rd-1.25 border-1 border-solid bg-[#F5F7FB] justify-center ${selectedItem === strategy ? 'border-[#45E1B8]' : ''} ${index > 0 ? 'mt-2' : ''}`}
                            onClick={() => handleButtonClick(strategy)}
                        >
                            <div className="flex ml-2.5 items-center relative">
                                <div className="shrink-0 text-[#252525] font-700 lh-6">¥{strategy.price}</div>
                                <div className="ml-1 text-[#B5B5B5] text-3 font-500 lh-6">
                                    {strategy.timeLimit >= 99999
                                        ? '一次购买，永久有效'
                                        : `限时购买，有效期${strategy.timeLimit}天`}
                                </div>
                                {selectedItem === strategy && (
                                    <Image
                                        src="/images/dialog/check.png"
                                        alt="check"
                                        width={24}
                                        height={24}
                                        className="absolute right-2.5"
                                    />
                                )}
                            </div>
                        </button>
                    ))}
                    {(!priceListData || priceListData?.length < 1) && <span>该专栏还没设置定价策略噢~</span>}
                </div>
                <div
                    className="w-85 mt-4 text-[#666] text-2.5 font-not-italic font-500 lh-6 m-auto">*内容为第三方个人创建，购买前请知晓内容，服务及相关风险，购买后
                    24 小时内可申请退款
                </div>
                <div className="w-85.75 h-10 shrink-0 mt-8">
                    <button onClick={handleClickPay}>
                        {/* 支付跳转 */}
                        <Image src="/images/dialog/pay.png" alt="pay" width={343} height={40} className="h-10 w-85.75"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reserved;

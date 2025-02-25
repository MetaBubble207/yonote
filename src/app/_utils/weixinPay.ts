import { WeixinPayData } from "../dashboard/user/wallet/types";

export const initWeixinBridge = (callback: (data: WeixinPayData) => void) => {
    if (typeof window.WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", () => callback, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", () => callback);
            document.attachEvent("onWeixinJSBridgeReady", () => callback);
        }
    }
};

export const handleWeixinPay = (data: WeixinPayData, onSuccess: () => void) => {
    window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
            appId: data.appId,
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
        },
        (res) => {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
                onSuccess();
            }
        }
    );
};
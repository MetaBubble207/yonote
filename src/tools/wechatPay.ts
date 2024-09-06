// eslint-disable-next-line @typescript-eslint/no-var-requires
const ApeWeChatPay = require("ape-node-wechatpay-v3");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const wechatPay = new ApeWeChatPay({
    appid: process.env.WECHAT_APP_ID,         // 公众号的appid
    mchid: process.env.WECHAT_MERCHANT_ID,    // 微信商户号
    serial_no: process.env.WECHAT_SERIAL_NO,  // 商户证书序列号
    apiclientCert: fs.readFileSync("path/to/apiclient_cert.pem"), // 商户API证书
    apiclientkey: fs.readFileSync("path/to/apiclient_key.pem"),   // 商户API私钥
    APIv3: process.env.WECHAT_API_V3_KEY,     // 微信APIv3密钥
});

export default wechatPay;

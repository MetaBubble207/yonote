import wechatPay from "@/tools/wechatPay";

export default async function handler(req, res) {
    try {
        const signature = req.headers["wechatpay-signature"];
        const timestamp = req.headers["wechatpay-timestamp"];
        const nonce = req.headers["wechatpay-nonce"];
        const body = req.body;

        // 验证签名
        const isValid = wechatPay.verifySignature({
            signature,
            timestamp,
            nonce,
            body: JSON.stringify(body)
        });

        if (!isValid) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // 处理支付成功的业务逻辑
        const { out_trade_no, transaction_id } = body;

        // 查询订单，更新用户钱包金额
        // 注意：确保订单号和用户钱包的更新逻辑匹配，避免重复调用

        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("WeChat Notify Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

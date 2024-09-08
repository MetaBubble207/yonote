declare global {
    interface Window {
        'WeixinJSBridge': any,
    }
    interface Document {
        'attachEvent': any,
    }
}
export { }

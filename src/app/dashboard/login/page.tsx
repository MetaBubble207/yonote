"use client";
import React, { useState } from "react";
import Image from "next/image";

const Login = () => {
    const [checked, setChecked] = useState("false");

    // const [scanning, setScanning] = useState(false);
    // const handleScanLogin = () => {
    //      // 在此处可以触发后端请求，以获取微信用户的授权信息
    //     // 这里只是演示，在实际应用中需要与后端进行交互

    //     // 模拟扫码登录的过程，设置扫码状态为 true
    //     setScanning(true);

    //     // 模拟扫码登录的延时
    //     setTimeout(() => {
    //         // 扫码登录完成后，设置扫码状态为 false
    //         setScanning(false);
    //         // 这里可以执行其他操作，例如跳转页面等
    //         console.log("扫码登录成功！");
    //     }, 3000); // 模拟3秒钟后扫码登录完成
    // }

    return (
        <div>
            <div className="flex justify-center mt-73.6">
                <Image src={"/images/logo.png"} alt={"logo"} width={41} height={45}></Image>
                <div className="ml-10px">
                    <div className={"shrink-0 font-size-8.4 "}>
                        有记
                    </div>
                    <div className="shrink-0 font-size-3.2">
                        YoNote
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-37.6">
                <button className="w-115.6 h-18.4 shrink-0 border-rd-10 bg-[#45E1B8] font-size-5.6">微信登录</button>
                <button className="w-115.6 h-18.4 shrink-0  border-rd-10 border bg-[#fffdfc] mt-6 font-size-5.6">取消</button>
                <div className="flex w-108.4 h-9.6 mt-13.7 font-size-4.8 " >
                    <input type="checkbox" value={checked} onChange={(e) => setChecked(e.target.value)} className="w-8 h-8"/>
                    <div className="ml-2.8">我已阅读并同意《用户协议》和《隐私协议》</div>
                </div>
            </div>
        </div>
    );
}



export default Login;
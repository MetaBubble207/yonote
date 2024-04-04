"use client";

import React, { useState } from "react";
import Image from "next/image";
import GeneralModal from "../_components/dialog/dialog"; // 引入GeneralModal组件
import { useRouter } from "next/navigation";

const Login = () => {
    const [checked, setChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // 用于管理模态框可见性的状态
    const router = useRouter();


    const handleCancel = () => {
        // 处理模态框取消/关闭的函数
        setModalVisible(false); // 当取消时隐藏模态框
        router.back();
    };

      // 定义关闭模态框的函数
    const closeModal = () => {
        setModalVisible(false);
    };

    
    const handleLogin = () => {
    if (checked) {
        setModalVisible(true);
    } else {
        alert("请先勾选同意!");
    }
    };

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
            <div className="flex justify-center items-center mt-46">
                <Image src={"/images/logo.png"} alt={"logo"} width={41} height={45}></Image>
                <div className="ml-10px">
                    <div className={"shrink-0 font-size-5.25 "}>
                        有记
                    </div>
                    <div className="shrink-0 font-size-2">
                        YoNote
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-23.5">
                <button className="w-72.25 h-11.5 shrink-0 border-rd-10 bg-[#45E1B8] font-size-3.5" onClick={handleLogin}>微信登录</button>
                <button className="w-72.25 h-11.5 shrink-0  border-rd-10 border bg-[#fffdfc] mt-3.75 font-size-3.5" onClick={handleCancel}>取消</button>
                <div className="flex w-67.75 h-6 mt-8.5575 text-3" >
                    <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked) } className="w-5 h-5" />
                    <div className="ml-1.5">我已阅读并同意《用户协议》和《隐私协议》</div>
                </div>
            </div>
            <div>
                <GeneralModal isOpen={modalVisible} onClick={closeModal}>
                    {/* 这里放入模态框内部的内容 */}
                    <div>此处放入微信二维码</div>
                </GeneralModal>
            </div>
        </div>
    );
}
export default Login;
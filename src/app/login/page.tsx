"use client";
import React, { useState } from "react";
import { Modal, Button } from "antd"; // 从 Ant Design 中导入 Modal 和 Button 组件
import Image from "next/image";

const Login = () => {
    const [checked, setChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // 用于管理模态框可见性的状态

    const handleWechatLogin = () => {
        // 处理微信登录按钮点击的函数
        setModalVisible(true); // 当点击微信登录按钮时显示模态框
    };

    const handleCancel = () => {
        // 处理模态框取消/关闭的函数
        setModalVisible(false); // 当取消时隐藏模态框
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
                <button className="w-115.6 h-18.4 shrink-0 border-rd-10 bg-[#45E1B8] font-size-5.6" onClick={handleWechatLogin}>微信登录</button>
                <button className="w-115.6 h-18.4 shrink-0  border-rd-10 border bg-[#fffdfc] mt-6 font-size-5.6">取消</button>
                <div className="flex w-108.4 h-9.6 mt-13.7 font-size-4.8 " >
                    <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-8 h-8"/>
                    <div className="ml-2.8">我已阅读并同意《用户协议》和《隐私协议》</div>
                </div>
            </div>

            {/* Ant Design 的 Modal */}
            <Modal
                title="微信登录" // 模态框标题
                visible={modalVisible} // 控制模态框的可见性
                onCancel={handleCancel} // 处理取消/关闭的函数
                footer={[ // 底部按钮
                    <Button key="cancel" onClick={handleCancel}>取消</Button>, // 取消按钮
                    <Button key="submit" type="primary" onClick={handleCancel}>确定</Button>, // 确定按钮
                ]}
            >
                {/* 模态框内容 */}
                <p>这是微信登录的模态框内容。</p>
            </Modal>
        </div>
    );
}
export default Login;


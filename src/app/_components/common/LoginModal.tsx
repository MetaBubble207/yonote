"use client"
import Image from "next/image";
import GeneralModal from "@/app/_components/dialog/dialog/dialog";
import React, {useState} from "react";
// import {useRouter} from "next/navigation";

export const LoginModal = () => {
    const [modalVisible, setModalVisible] = useState(false); // 用于管理模态框可见性的状态
    // const router = useRouter()
    // const handleCancel = () => {
    //     // 处理模态框取消/关闭的函数
    //     setModalVisible(false); // 当取消时隐藏模态框
    //     router.back();
    // };

    // 定义关闭模态框的函数
    const closeModal = () => {
        setModalVisible(false);
    };

    return <GeneralModal isOpen={modalVisible} onClick={closeModal}>
        {/* 这里放入模态框内部的内容 */}
        <div>
            <Image
                src={"/images/writer/image 1.svg"}
                alt={"erweima"}
                width={240}
                height={240}
                className="w-60 h-60 shrink-0 mt-14.5725 m-auto "
            ></Image>
        </div>
    </GeneralModal>
}

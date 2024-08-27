"use client"
import Image from "next/image";
import React, {useEffect, useState} from 'react';
import SpecialColumnIntroduce from "@/app/_components/special-column/SpecialColumnIntroduce";
import {api} from "@/trpc/react";
import Reserved from "@/app/_components/dialog/Reserved";
import {useRouter, useSearchParams} from "next/navigation";
import useLocalStorage from "@/tools/useStore";
import {message} from "antd";
import SpecialColumnList from "@/app/_components/special-column/SpecialColumnList";

const SpecialColumnBody = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const code = params.get("code");
    const [token, setToken] = useLocalStorage("token", null);

    const [check, setCheck] = useState(false);
    const [isSubscribe, setIsSubscribe] = useState(false);
    const [currentContent, setCurrentContent] = useState<number>(1);
    const status = api.order.getUserStatus.useQuery({
        userId: token,
        columnId: columnId,
    }).data
    // 获取所有文章
    const read = api.post.getAllPost.useQuery({columnId: columnId});
    const order = api.order.getColumnOrder.useQuery({columnId: columnId})

    const active = "text-[#252525] font-500 border-b-3 border-[#45E1B8]";
    useEffect(() => {
        const isBack = params.get("isBack");
        if (!token && !userInfo && !isBack) {
            // messageApi.info("请先登录再进行订阅噢😯~");
            const origin = encodeURIComponent(`/dashboard/special-column?id=${columnId}&invitationCode=${token}&isBack=true`);
            router.push(`/login?origin=${origin}`)
        }
    }, []);

    // 是否加载订阅按钮
    const ShowButton = () => {
        return <>
            {status && <button
                className={"w-91% h-40px shrink-0 border-rd-11.25 bg-[#5CE5C1] ml-16px mt-17px mb-36px text-center lh-40px text-[#252525] text-4.5 font-not-italic font-500 fixed bottom-2"}
                onClick={setting}>
                订阅
            </button>
            }
        </>
    }

    const RenderContent = () => {
        switch (currentContent) {
            case 1:
                return <SpecialColumnList data={status}></SpecialColumnList>;
            case 2:
                return <SpecialColumnIntroduce></SpecialColumnIntroduce>;

        }
    }

    const setting = () => {
        setIsSubscribe(!isSubscribe);
        setCheck(!check);
    }

    //这个地址是提前给微信登录接口重定向，默认微信那边会传回code和state两个query参数，通过useSearchParams可以拿到
    const userInfoQuery = api.users.login.useQuery({code: code}, {enabled: !!code && token === null});
    const userInfo = userInfoQuery.data;
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (userInfo && !token) {
            messageApi.success("登录成功！😆，欢迎继续订阅专栏😯~");
            setToken(userInfo.id);
        }
    }, [userInfo, setToken]);
    const router = useRouter();

    const search = () => {

    }

    return (
        <div className={"w-full"}>
            {contextHolder}
            {/*订阅栏*/}
            <div className={"ml-37.8% text-[#999] text-3 font-not-italic font-400 lh-6 pt-10px"}>
                <span
                    className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6 mr-5px"}>{order.data?.length}</span>
                订阅
                <span
                    className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6 mr-5px ml-20px"}>{read.data?.length}</span>
                内容
            </div>
            <div className="flex mt-11px items-center ml-16px">
                <div
                    className={currentContent === 2 ? active : "text-[#B5B5B5] text-3.5 font-not-italic font-400 lh-6 "}
                    onClick={() => setCurrentContent(2)} style={{marginRight: '40px'}}>介绍
                </div>
                <div
                    className={currentContent === 1 ? active : "text-[#B5B5B5] text-3.5 font-not-italic font-400 lh-6 "}
                    onClick={() => setCurrentContent(1)}>内容
                </div>
                <div className="ml-auto mr-24px">
                    <Image src={"/images/special-column/Magnifying glass.png"} alt={"心智与阅读"} width={18} height={18}
                           onClick={search}/>
                </div>
                <div className={"mr-16px"}>
                    <Image src={"/images/special-column/Sort.png"} alt={"心智与阅读"} width={18} height={18}/>
                </div>
            </div>
            {RenderContent()}

            <ShowButton/>

            <div className="fixed  top-200px   w-full">
                {isSubscribe && <Reserved onClose={() => setIsSubscribe(false)} check={check}></Reserved>}
            </div>
        </div>
    )
}

export default SpecialColumnBody;
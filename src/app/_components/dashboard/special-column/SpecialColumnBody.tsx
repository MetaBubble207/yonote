"use client"
import Image from "next/image";
import React, {useEffect, useState} from 'react';
import SpecialColumnIntroduce from "@/app/_components/dashboard/special-column/SpecialColumnIntroduce";
import {api} from "@/trpc/react";
import Reserved from "@/app/_components/dialog/Reserved";
import {useRouter, useSearchParams} from "next/navigation";
import useLocalStorage from "@/tools/useStore";
import {Button, message} from "antd";
import SpecialColumnList from "@/app/_components/dashboard/special-column/SpecialColumnList";
import Loading from "@/app/_components/common/Loading";

const active = "text-[#252525] font-500 border-b-3 border-[#45E1B8]";

const SpecialColumnBody = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const code = params.get("code");
    const [token, setToken] = useLocalStorage("token", null);
    const status = api.order.getUserStatus.useQuery({
        userId: token,
        columnId: columnId,
    }).data

    const [check, setCheck] = useState(false);
    const [isSubscribe, setIsSubscribe] = useState(false);
    const [currentContent, setCurrentContent] = useState<number>(1);

    const {data: detailPost, isLoading} = api.order.getColumnOrder.useQuery({columnId: columnId})

    useEffect(() => {
        const isBack = params.get("isBack");
        if (!token && !userInfo && !isBack) {
            // messageApi.info("请先登录再进行订阅噢😯~");
            const origin = encodeURIComponent(`/dashboard/special-column?id=${columnId}&invitationCode=${token}&isBack=true`);
            router.push(`/login?origin=${origin}`)
        }
    }, []);

    //这个地址是提前给微信登录接口重定向，默认微信那边会传回code和state两个query参数，通过useSearchParams可以拿到
    const {data: userInfo} = api.users.login.useQuery({code: code}, {enabled: !!code && token === null});
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
    if (isLoading) return <Loading/>
    return (
        <div className={"w-full"}>
            {contextHolder}
            {/*订阅栏*/}
            <div className={"ml-37.8% text-[#999] text-3 font-not-italic font-400 lh-6 pt-10px"}>
                <span
                    className={"shrink-0 text-[#252525] text-4 font-700 lh-6 mr-5px"}>{detailPost?.subscriptCount}</span>
                订阅
                <span
                    className={"shrink-0 text-[#252525] text-4 font-700 lh-6 mr-5px ml-20px"}>{detailPost?.detailPostCard.length}</span>
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
            <div className={'mb-15'}>
                <RenderContent/>
            </div>

            <div className={'fixed bottom-2'}>
                <ShowButton/>
            </div>

            <div className="fixed  top-200px   w-full">
                {isSubscribe && <Reserved onClose={() => setIsSubscribe(false)} check={check}></Reserved>}
            </div>
        </div>
    )

    // 是否加载订阅按钮
    function ShowButton() {
        return <>
            {!status && <div className={'w-85.75 h-10  ml-16px   rounded-full'}>
                <Button
                    type='primary'
                    size='small'
                    style={{width: '100%', height: '100%', borderRadius: '9999px',}}
                    className={" bg-[#5CE5C1]"}
                    onClick={setting}>
                    订阅
                </Button>
            </div>
            }
        </>
    }

    function RenderContent() {
        switch (currentContent) {
            case 1:
                // @ts-ignore
                return <SpecialColumnList status={status} postData={detailPost.detailPostCard}></SpecialColumnList>;
            case 2:
                return <SpecialColumnIntroduce></SpecialColumnIntroduce>;

        }
    }

    function setting() {
        setIsSubscribe(!isSubscribe);
        setCheck(!check);
    }

}

export default SpecialColumnBody;

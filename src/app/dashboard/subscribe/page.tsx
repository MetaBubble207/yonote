"use client";
import Navbar from "@/app/_components/common/Navbar";
import Image from "next/image";
import Link from "next/link";
import {api} from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import SearchColumn from "@/app/_components/common/SearchColumn";
import {Button, Skeleton} from "antd";
import SubscribeMain from "@/app/_components/dashboard/subscribe/SubscribeMain";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import withTheme from "@/theme";

const Subscribe = function Subscribe() {
    const router = useRouter();
    const [token] = useLocalStorage("token", null);
    useEffect(() => {
        if(!token){
            router.push("/login");
        }
    }, []);
    const {data: recentRead, isLoading} =
        api.read.getRecentRead.useQuery({userId: token});

    const link = () => {
        router.push(`/dashboard/special-column/content?c=${recentRead?.chapter}&id=${recentRead?.columnId}`);
    };

    const recentColumn = api.column.getColumnDetail.useQuery({
        columnId: recentRead?.columnId,
    },{enabled: Boolean(recentRead)}).data;

    const [readContent, setReadContent] = useState(recentRead?.content);

    function extractText(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }

    useEffect(() => {
        if (recentRead && recentRead.content.length > 15) {
            const text = extractText(recentRead.content);
            setReadContent(text.substring(0, 15) + "...");
        } else {
            const text = extractText(recentRead?.content);
            setReadContent(text);
        }
    }, [recentRead]);

    const RecentlyReadCard = () => {
        if (isLoading) {
            return <Skeleton
                active
                paragraph={{rows: 2}}
                title={false}
                className="h-20.5 w-full rounded-2.5 p-2.5 bg-[#FFF]"
            />
        }
        return <div className="h-20.5 w-full rounded-2.5 bg-[#FFF] flex relative p-2.5">
            <div className="relative w-11.375 h-15.5">
                <Image
                    placeholder="blur"
                    blurDataURL={DefaultLoadingPicture()}
                    src={recentColumn?.cover ?? DefaultLoadingPicture()}
                    alt='cover'
                    quality={100}
                    fill
                    loading='lazy'
                    className='rounded-2 object-cover '
                />
            </div>
            <div className="pl-2 pt-1">
                {recentRead && (
                    <>
                        <div className="text-3 text-[#252525] font-500 pb-1.5 lh-6">
                            {recentRead.name?.length > 15 ? recentRead.name.substring(0, 15) + "..." : recentRead.name}
                        </div>
                        <div
                            className="text-2.5 text-[#666] lh-3 pl-1"
                            dangerouslySetInnerHTML={{__html: readContent}}
                        ></div>
                    </>
                )}
            </div>
            <div className={'rounded-full absolute right-2.5 bottom-2.5 b-0'}>
                <Button size={'small'}
                        type={'primary'}
                        onClick={link}
                        style={{
                            borderRadius: '9999px',
                            fontSize: '12px',
                            width: '18.25',
                            height: '7.75',
                            color: '#1db48d',
                            backgroundColor: '#DAF9F1'
                        }}>
                    继续阅读
                </Button>
            </div>
        </div>
    }

    return (
        <div>
            <div className="w-full min-h-screen px-4 pt-8 pb-15 bg-#F5F7FB">
                {/*搜索框*/}
                <Link href='/dashboard/find/search-result'><SearchColumn defaultValue={''}/></Link>
                {/*最近观看*/}
                <div className={'mt-8'}>
                    <RecentlyReadCard/>
                </div>
                {/*列表*/}
                <div className={'mt-4'}>
                    <SubscribeMain/>
                </div>
                <div
                    className={'z-1 h-20 flex items-center justify-center text-gray text-3 w-full'}>
                    ICP备案号：
                    <Link href={'http://beian.miit.gov.cn/ '}> 京ICP备2024064381号-1</Link>
                </div>
            </div>
            {/*工具栏*/}
            <div className="bottom-4 w-full justify-center fixed z-2">
                <Navbar/>
            </div>
        </div>
    );
};

const Page = () => {
    return withTheme(<Subscribe/>)
}

export default Page;

"use client";
import Navbar from "@/app/_components/common/Navbar";
import Image from "next/image";
import Link from "next/link";
import {api} from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/app/_components/common/Loading";
import {SearchColumn} from "@/app/_components/common/SearchColumn";
import {Button} from "antd";
import SubscribeMain from "@/app/_components/subscribe/SubscribeMain";

const Subscribe = () => {
    const router = useRouter();
    const [token] = useLocalStorage("token", null);
    const {data: recentRead, isLoading} =
        api.read.getRecentRead.useQuery({userId: token});

    const link = () => {
        router.push(`/special-column-content?c=${recentRead?.chapter}&id=${recentRead?.columnId}`);
    };

    const recentColumn = api.column.getColumnDetail.useQuery({
        columnId: recentRead?.columnId,
    }).data;

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
        return <div className="h-20.5 w-full rounded-2.5 bg-[#FFF] flex relative p-2.5">
            <Image
                unoptimized
                src={recentColumn?.logo ?? "/images/subscribe/cover.png"}
                alt="cover"
                width={45.5}
                height={62}
                placeholder="empty"
                className="rounded-2"
            ></Image>
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
            <Button size={'small'}
                    onClick={link}
                    className="w-18.25 h-7.75 text-3 text-[#1db48d] bg-#DAF9F1 p0 lh-7.75 rounded-full absolute right-2.5 bottom-2.5"
            >
                继续阅读
            </Button>
        </div>
    }
    if (isLoading) return <Loading/>

    return (
        <div className="min-h-screen px-4 pt-8 pb-15 bg-#F5F7FB">
            {/*搜索框*/}
            <Link href={'find/search-result'}><SearchColumn/></Link>
            {/*最近观看*/}
            <div className={'mt-8'}>
                <RecentlyReadCard/>
            </div>
            {/*列表*/}
            <div className={'mt-4'}>
                <SubscribeMain/>
            </div>
            {/*工具栏*/}
            <div className="bottom-4 justify-center w-full fixed">
                <Navbar/>
            </div>
        </div>
    );
};

export default Subscribe;

"use client"
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";
import { Skeleton } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import useCheckLoginState from "@/app/_hooks/useCheckLoginState";
import { isValid } from "@/tools/isValid";

const MAX_TEXT_LENGTH = 15;

const extractText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
};

const truncateText = (text: string) =>
    text.length > MAX_TEXT_LENGTH ? `${text.substring(0, MAX_TEXT_LENGTH)}...` : text;

export default function RecentlyReadCard() {
    const router = useRouter();
    const [token] = useLocalStorage("token", null);
    useCheckLoginState('/login');

    const { data: recentRead, isLoading } = api.read.getRecentRead.useQuery({
        userId: token,
    });
    const { data: recentColumn } = api.column.getColumnDetail.useQuery(
        recentRead?.columnId ?? "",
        { enabled: Boolean(isValid(recentRead)) },
    );
    const [readContent, setReadContent] = useState("");
    useEffect(() => {
        if (!recentRead?.content) return;
        const text = extractText(recentRead.content);
        setReadContent(truncateText(text));
    }, [recentRead]);
    const handleContinueReading = () => {
        router.push(`/dashboard/special-column/content?c=${recentRead?.chapter}&id=${recentRead?.columnId}`);
    };

    if (!recentRead) return null;
    if (isLoading) {
        return (
            <Skeleton
                active
                paragraph={{ rows: 2 }}
                title={false}
                className="h-20.5 rounded-2.5 w-full bg-[#FFF] p-2.5"
            />
        );
    }
    const truncatedName = recentRead.name ? truncateText(recentRead.name) : "";
    return (
        <div className="h-20.5 rounded-2.5 relative flex w-full bg-[#FFF] p-2.5">
            <div className="w-11.375 h-15.5 relative">
                <Image
                    placeholder="blur"
                    blurDataURL={LoadingImage()}
                    src={recentColumn?.cover ?? NotImage()}
                    alt="cover"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded-2 object-cover"
                />
            </div>
            <div className="pl-2 pt-1">
                {recentRead && (
                    <>
                        <div className="text-3 font-500 lh-6 pb-1.5 text-[#252525]">
                            {truncatedName}
                        </div>
                        <div
                            className="text-2.5 lh-3 pl-1 text-[#666]"
                            dangerouslySetInnerHTML={{ __html: readContent }}
                        />
                    </>
                )}
            </div>
            <div className="b-0 absolute bottom-2.5 right-2.5 rounded-full">
                <button
                    onClick={handleContinueReading}
                    className="text-2.5 font-500 lh-3 text-[#1DB48D] bg-[#DAF9F1] rounded-full px-2.5 py-1.5"
                >
                    继续阅读
                </button>
            </div>
        </div>
    );
}
"use client"
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { Skeleton } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import useCheckLoginState from "@/app/_hooks/useCheckLoginState";
import { isValid } from "@/app/_utils/isValid";
import useCheckOnClient from "@/app/_hooks/useCheckOnClient";

const MAX_TEXT_LENGTH = 15;

const RecentlyReadCard = ({ code }: { code?: string }) => {
    const router = useRouter();
    const mounted = useCheckOnClient();
    const { token } = useCheckLoginState('/login?origin=/dashboard/subscribe', code);

    const { data: recentRead, isLoading: isRecentReadLoading } = api.read.getRecentRead.useQuery(
        token!,
        { enabled: Boolean(token) }
    );

    const { data: recentColumn, isLoading: isRecentColumnLoading } = api.column.getById.useQuery(
        recentRead?.columnId ?? "",
        { enabled: Boolean(isValid(recentRead)) }
    );

    const { truncatedName, readContent } = useMemo(() => {
        if (!recentRead) {
            return { truncatedName: "", readContent: "" };
        }

        const name = recentRead.name || "";
        const truncatedName = name.length > MAX_TEXT_LENGTH
            ? `${name.substring(0, MAX_TEXT_LENGTH)}...`
            : name;

        if (!recentRead.content) {
            return { truncatedName, readContent: "" };
        }

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = recentRead.content;
        const text = tempDiv.textContent || tempDiv.innerText || "";
        const readContent = text.length > MAX_TEXT_LENGTH
            ? `${text.substring(0, MAX_TEXT_LENGTH)}...`
            : text;

        return { truncatedName, readContent };
    }, [recentRead]);

    const handleContinueReading = () => {
        if (!recentRead?.chapter || !recentRead?.columnId) return;
        router.push(`/dashboard/special-column/content?c=${recentRead.chapter}&id=${recentRead.columnId}`);
    };

    if (!mounted || isRecentReadLoading || isRecentColumnLoading) {
        return (
            <Skeleton
                active
                paragraph={{ rows: 2 }}
                title={false}
                className="h-20.5 rounded-2.5 w-full bg-[#FFF] p-2.5"
            />
        );
    }

    if (!recentRead) return null;

    return (
        <div className="h-20.5 rounded-2.5 relative flex w-full bg-[#FFF] p-2.5">
            <div className="w-11.375 h-15.5 relative">
                <Image
                    placeholder="blur"
                    blurDataURL={LoadingImage()}
                    src={recentColumn?.cover ?? NotImage()}
                    alt="最近阅读封面"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded-2 object-cover"
                />
            </div>
            <div className="pl-2 pt-1 flex-1">
                <div className="text-3 font-500 lh-6 pb-1.5 text-[#252525]">
                    {truncatedName}
                </div>
                <div className="text-2.5 lh-3 pl-1 text-[#666]">
                    {readContent}
                </div>
            </div>
            <div className="absolute bottom-2.5 right-2.5">
                <button
                    onClick={handleContinueReading}
                    className="text-2.5 font-500 lh-3 text-[#1DB48D] bg-[#DAF9F1] rounded-full px-2.5 py-1.5 transition-colors hover:bg-[#c5f0e5]"
                >
                    继续阅读
                </button>
            </div>
        </div>
    );
};

export default RecentlyReadCard;
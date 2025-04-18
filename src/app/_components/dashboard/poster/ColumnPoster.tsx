"use client";
import React from "react";
import Image from "next/image";
import Loading from "@/app/_components/common/Loading";
import { useScreenshot } from "@/app/_hooks/useScreenshot";
import { AuthorInfo } from "./AuthorInfo";
import { FooterInfo } from "./FooterInfo";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { ColumnSelect, UserSelect } from "@/server/db/schema";
import { ColumnContent } from "./ColumnContent";
import { api } from "@/trpc/react";
import { Empty } from "antd";

interface ColumnPosterProp {
    user: UserSelect;
    ContentCount: number;
    subscribeCount: number;
    column: ColumnSelect;
}

export const ColumnPoster = ({ user, column, ContentCount, subscribeCount }: ColumnPosterProp) => {
    const [token] = useLocalStorage('token', null);
    const { data: shareUser, isLoading } = api.users.getOne.useQuery(token, { enabled: !!token });
    const originURL = typeof window !== 'undefined' ? window.location.origin : '';
    const qrCodeURL = `${originURL}/dashboard/special-column?&id=${column.id}&invitationCode=${token}`;

    const { png, pngUrl, isScreenshot, handleScreenshotClick } = useScreenshot();
    if (isLoading) return <Loading className="mt-30" />
    if (!shareUser) return <Empty description="找不到数据" />
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#999999]">
            {isScreenshot && (
                <div className={"z-100 absolute flex h-screen w-full items-center justify-center"}>
                    <Loading />
                </div>
            )}
            {pngUrl !== "" ? (
                <div className={"w-88 h-140 relative"}>
                    <Image src={pngUrl} alt={"poster"} fill quality={100} />
                </div>
            ) : (
                <div ref={png} className="h-129.5005 mx-4 w-full bg-[#ffffff] px-4.2 pb-10 flex flex-col">
                    <AuthorInfo user={user}>
                        <div className="ml-2.25 flex items-center">
                            <div
                                className={
                                    "text-3.5 font-700 lh-6 text-[#252525]"
                                }
                            >
                                {subscribeCount}
                            </div>
                            <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                                订阅
                            </div>
                            <div className="text-3.5 font-700 lh-6 ml-1 text-[#252525]">
                                {ContentCount}
                            </div>
                            <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                                内容
                            </div>
                        </div>
                    </AuthorInfo>
                    <ColumnContent column={column} />
                    <FooterInfo
                        userInfo={shareUser}
                        qrCodeURL={qrCodeURL}
                        onScreenshot={handleScreenshotClick}
                        type={column.type === 0 ? "column" : "course"}
                    />
                </div>
            )}
        </div>
    );
};
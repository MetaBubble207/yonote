"use client";
import Image from "next/image";
import {api} from "@/trpc/react";
import {useSearchParams} from "next/navigation";
import Loading from "../common/Loading";
import {useRouter} from "next/navigation";
import {Button} from "antd";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const SpecialColumnHeader = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const {data, isLoading} =
        api.column.getColumnUser.useQuery({columnId: columnId});

    const router = useRouter();

    if (isLoading) return <div className={"bg-white"}><Loading/></div>
    const {column, user} = data;
    const toShare = () => {
        router.push(`/dashboard/poster/column?id=${column.id}`)
    };
    const toUserDetail = () => {
        router.push(`/dashboard/user/detail?id=${user.id}`)
    }

    return (
        <>
            <div className={"w-full absolute top-0 z-1 filter blur-sm"}>
                <Image
                    placeholder="blur"
                    blurDataURL={DefaultLoadingPicture()}
                    src={column.logo ?? DefaultLoadingPicture()}
                    alt={"bg"}
                    width={375}
                    height={74.5}
                    style={{width: "100%"}}
                />

                <div className="absolute inset-0 bg-black opacity-20"></div>
            </div>
            <div className={"w-full absolute top-2.5 left-0 z-3"}>
                <div className={"flex justify-end items-center"}>
                    <Button size={'small'} className={"w-14 h-6 text-[#252525] bg-#5CE5C1 text-2.5 rounded-full"}>
                        加速计划
                    </Button>
                    {/* 点击分享，跳转海报 */}
                    <Button type={'link'} size={'small'} className={"ml-10px mr-16px"} onClick={toShare}>
                        <Image
                            src={"/images/special-column/Share-two (分享2).png"}
                            alt={"分享"}
                            width={12}
                            height={12}
                        />
                    </Button>
                </div>
                <div className={"flex items-start mt-6px w-full pl-5"}>
                    <Image
                        src={column?.logo ? column?.logo : "/images/recommend/cover.svg"}
                        width={111}
                        height={156}
                        alt="img"
                        className={'w-27.7 h-39 object-cover object-top-center rounded-10px'}
                    />

                    <div className={"flex flex-col ml-10px"}>
                        <div
                            className={"text-[#FFF] text-4.5"}
                        >
                            {column?.name ? (
                                    column?.name.length >= 10
                                        ? column?.name.substring(0, 10) + "..."
                                        : column?.name) :
                                "未知专栏"}
                        </div>
                        <div
                            className={" text-[#F2F2F2] text-3.5 pt-5px w-50"}>
                            {column?.description ? (
                                    column?.description?.length >= 20
                                        ? column?.description.substring(0, 20) + "..."
                                        : column?.description) :
                                "暂时没有数据"}
                        </div>
                        <div className={"flex mt-2 "}>
                            <Image src={user?.avatar ? user?.avatar : "/images/recommend/cover.svg"} alt={"avatar"}
                                   width={18} height={18}
                                   onClick={toUserDetail}/>
                            <div
                                className={"text-[#DFDFDF] text-2.75 lh-18px ml-5px"}>
                                {user?.name ? user?.name : "未知用户"}
                            </div>
                            <Image
                                src={"/images/special-column/Group 225.png"}
                                alt={"icon"}
                                width={12}
                                height={12}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SpecialColumnHeader;
"use client";
import Image from "next/image";
import Navbar from "@/app/_components/common/Navbar";
import Link from "next/link";
import useLocalStorage from "@/tools/useStore";
import React, {useEffect, useState} from "react";
import {api} from "@/trpc/react";
import {Button, Skeleton} from "antd";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import {useRouter} from "next/navigation";
import withTheme from "@/theme";

const User = function User({code}: { code: string | undefined }) {
    const logout = () => {
        localStorage.removeItem("token");
    };
    const router = useRouter();
    const [token, setToken] = useLocalStorage('token', null);
    const {data: userInfo, isLoading: isUserInfoLoading} =
        api.users.getOne.useQuery({id: token}, {enabled: Boolean(token)});

    const {data: columnInfo, isLoading: isColumnInfoLoading} =
        api.column.getAllByUserId.useQuery({
            userId: userInfo?.id,
        }, {enabled: Boolean(token)});
    const {data: loginData, isSuccess} = api.users.login.useQuery({code}, {
        enabled: Boolean(code && !token),
    });

    useEffect(() => {
        if (isSuccess) {
            setToken(loginData.id);
        }
    }, [loginData]);

    return (
        <div>
            {/* 背景颜色*/}
            <div className="w-full min-h-screen pb-15 px-4
                bg-gradient-to-rb from-custom-user_gradient_1 via-custom-user_gradient_2 to-custom-user_gradient_3">
                {/* 顶部 */}
                <UserTop/>
                {/* 专栏、小课区域 */}
                <Display/>
                {/*  我的服务模块*/}
                <Service/>
            </div>
            <div className="bottom-4 justify-center w-full fixed">
                <Navbar/>
            </div>
        </div>
    );

    function UserTop() {
        return (
            <div className="pt-9 flex flex-row items-center">
                {token && userInfo ? (
                    <div className="relative w-20.75 h-20.75">
                        <Image
                            placeholder="blur"
                            blurDataURL={DefaultLoadingPicture()}
                            src={userInfo.avatar ?? DefaultLoadingPicture()}
                            alt='cover'
                            quality={100}
                            fill
                            loading='lazy'
                            className='rounded-full object-cover '
                        />
                    </div>
                ) : (
                    <Image
                        src={"/images/user/NotLoggedIn.svg"}
                        alt="avatar"
                        width={83}
                        height={83}
                        className={"rounded-full"}
                        onClick={() => router.push("/login")}
                    />
                )}

                {/* 用户信息 */}
                <div className="ml-3 flex-1">
                    <div className="flex align-center">
                        <h1 className=" text-[#252525] text-3 font-500 lh-6">
                            {token && userInfo ? userInfo.name : "请点击头像登录"}
                        </h1>
                        <Image
                            src="/images/user/Rank.svg"
                            alt="group"
                            width={20}
                            height={20}
                            className="ml-2"
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="cover flex w-3.5 h-3.5 items-center">
                            <Image
                                src="/images/user/I_logo.svg"
                                alt="group"
                                width={7.44}
                                height={7.44}
                                className="w-1.4775 h-1.86 shrink-0 fill-#666"
                            />
                            <Image
                                src="/images/user/D_logo.svg"
                                alt="group"
                                width={7.44}
                                height={7.44}
                                className="w-1.4775 h-1.86 shrink-0 fill-#666"
                            />
                        </div>
                        <span
                            className="ml-1 w-18 text-[#999] font-Source Han Sans SC text-2.5 font-not-italic font-400 lh-6 items-center">
                {userInfo?.idNumber}
              </span>
                    </div>
                </div>
                <div className="pl-2.5">
                    {/* 编辑资料 */}
                    <Button
                        type={'primary'}
                        style={{
                            width: '20',
                            height: '6',
                            fontSize: '10px',
                            border: 0,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: '9999px'
                        }}
                        disabled={!token || !userInfo}>
                        <Image
                            src="/images/user/icon_edit.png"
                            alt="icon"
                            width={16}
                            height={16}
                        />
                        <Link href="/dashboard/user/message" prefetch={false} className={'ml-2'}>编辑资料</Link>
                    </Button>
                </div>
            </div>
        )
    }

    function Service() {
        const linkStyles = "flex flex-col items-center";
        const cardStyles = "flex flex-col items-center w-1/4 mt-2 mb-2";
        const navItems = [
            {
                href: `/dashboard/user/detail?id=${token}`,
                iconSrc: '/images/user/HomePage.svg',
                text: '个人主页'
            },
            {
                href: '',
                iconSrc: '/images/user/KnowledgePlanet.svg',
                text: '知识星球'
            },
            {
                href: 'https://eahu7fmu6k6.feishu.cn/wiki/JtU0wJWhfiBygNkEoCBc2VUIndb?from=from_copylink',
                iconSrc: '/images/user/Usage.svg',
                text: '使用说明'
            },
            {
                href: '/dashboard/user/wallet',
                iconSrc: '/images/user/Income.svg',
                text: '收入提现'
            },
            {
                href: 'https://eahu7fmu6k6.feishu.cn/share/base/form/shrcnM3bJTp21SwwwwAcZ39Q2EL',
                iconSrc: '/images/user/Feedback.svg',
                text: '意见反馈'
            },
            {
                href: 'https://work.weixin.qq.com/kfid/kfcef6edb33788c7a32',
                iconSrc: '/images/user/Contact.svg',
                text: '联系客服'
            }
        ]
        return <div className={"w-full h-51.5 rounded-2.5 bg-#FFF mt-1.5 py-4.5"}>
            {/*标题*/}
            <div className={"text-[#252525] text-3.5 font-500 lh-6 pl-5.5"}>我的服务</div>
            <ul className={"flex flex-wrap mt-4"}>
                {navItems.map((item, index) => (
                    <li key={index} className={cardStyles}>
                        <Link href={item.href} className={linkStyles}>
                            <Image src={item.iconSrc} alt={item.text} width={24} height={24}/>
                            <div className="text-center text-gray-800 text-sm font-normal leading-relaxed">
                                {item.text}
                            </div>
                        </Link>
                    </li>
                ))}
                <li className={cardStyles}>
                    <Link href="/login" className={linkStyles}>
                        <Image src={"/images/user/SignOut.svg"} alt={"退出登录"} width={24} height={24}/>
                        <div
                            className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                            onClick={() => logout()}
                        >
                            退出登录
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    }

    function Display() {
        const [currentPage, setCurrentPage] = useState<number>(1);

        const buttonInfos = [
            {id: 1, label: '专栏'},
            {id: 2, label: '小课'}
        ];

        const renderButtons = () => {
            return buttonInfos.map((button, index) => (
                <div key={index}>
                    <Button
                        type={'link'}
                        size={'small'}
                        className={'mr-8'}
                        style={currentPage === button.id ? {color: '#252525', padding: 0} : {
                            color: '#B5B5B5',
                            padding: 0
                        }}
                        onClick={() => setCurrentPage(button.id)}
                    >
                        {button.label}
                    </Button>
                    <div
                        className={`ml-2.25 mt-1 w-2.75 h-1 rounded-2  ${currentPage === button.id ? 'bg-#45E1B8' : 'bg-#FFF'}`}
                    ></div>
                </div>
            ));
        };

        const Column = () => {
            return columnInfo?.slice(0, columnInfo?.length > 1 ? 2 : 1).map((item) => (
                <Link href={`/dashboard/special-column?id=${item.id}`} className="flex mb-4" key={item.id}>
                    <div className="relative w-15.5 h-19">
                        <Image
                            placeholder="blur"
                            blurDataURL={DefaultLoadingPicture()}
                            src={item?.cover ?? DefaultLoadingPicture()}
                            alt='cover'
                            quality={100}
                            fill
                            loading='lazy'
                            className='rounded object-cover'
                        />
                    </div>
                    <div>
                        <div
                            className="ml-2 w-59.25 text-3.75 font-500 lh-6 text-ellipsis whitespace-nowrap overflow-hidden">
                            「{item?.name ?? "未知专栏"}」
                        </div>
                        <div
                            className='w-59.25 text-#666 text-3.25 font-400 ml-3 mt-2 text-ellipsis whitespace-nowrap overflow-hidden'>
                            {item?.introduce ?? "暂无简介"}
                        </div>
                    </div>
                </Link>
            ));
        };

        const Course = () => {
            return (
                <div className={'flex justify-center items-center'}>
                    <div className="text-center text-[#B5B5B5] mt-4 h-10">暂无数据哦~</div>
                </div>
            );
        };

        if (!token || !userInfo) return <></>;

        return (
            <>
                <div className="w-full pb-2 border-rd-2.5 bg-#FFF pl-4 pt-4 mt-4">
                    {/* 导航区域 */}
                    <div className="flex">
                        {renderButtons()}
                    </div>
                    {/* 内容区域 */}
                    <div className='mt-3'>
                        {isUserInfoLoading || isColumnInfoLoading
                            ?
                            <Skeleton
                                active
                                paragraph={{rows: 4}}
                                title={false}
                                className="w-full pb-2 border-rd-2.5 bg-#FFF pl-4 pt-4 mt-4"
                            />
                            :
                            currentPage === 1 ? <Column/> : <Course/>}
                    </div>
                </div>
            </>
        );
    }

};

const Page = ({
                  params,
                  searchParams,
              }: {
    params: { slug: string };
    searchParams: { code: string | undefined };
}) => {
    return withTheme(<User code={searchParams?.code}/>)
}
export default Page;

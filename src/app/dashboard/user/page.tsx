"use client";
import Image from "next/image";
import Navbar from "@/app/_components/common/Navbar";
import Link from "next/link";
import UserTop from "@/app/_components/user/UserTop";
import useLocalStorage from "@/tools/useStore";
import React, {useState} from "react";
import {api} from "@/trpc/react";
import Loading from "@/app/_components/common/Loading";
import {Button} from "antd";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const Page = () => {
    const logout = () => {
        localStorage.removeItem("token");
    };
    const [token] = useLocalStorage('token', null);

    const Service = () => {
        const linkStyles = "flex flex-col items-center";
        const cardStyles = "flex flex-col items-center w-1/4 mt-2 mb-2";
        const navItems = [
            {
                href: `user/detail?id=${token}`,
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
                href: '../wallet',
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
                    <Link href="../login" className={linkStyles}>
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

    const Display = () => {
        const [currentPage, setCurrentPage] = useState<number>(1)
        const {data: userInfo, isLoading: isUserInfoLoading} =
            api.users.getOne.useQuery({id: token});

        // 检测当前用户ID是否有专栏，如果没有，display组件就不渲染
        const {data: columnInfo, isLoading: isColumnInfoLoading} =
            api.column.getAllByUserId.useQuery({
                userId: userInfo?.id,
            });

        if (isUserInfoLoading || isColumnInfoLoading) return <Loading/>

        const buttonInfos = [
            {id: 1, label: '专栏'},
            {id: 2, label: '小课'}
        ]

        const renderButtons = () => {
            return buttonInfos.map((button, index) => (
                <div key={index}>
                    <Button
                        type={'link'} size={'small'}
                        className={` text-3.5 p0 font-500 lh-6 mr-8 ${currentPage === button.id ? "text-#252525" : "text-#B5B5B5"} `}
                        onClick={() => setCurrentPage(button.id)}
                    >
                        {button.label}
                    </Button>
                    <div
                        className={`ml-2.25 mt-1 w-2.75 h-1 rounded-2  ${currentPage === button.id ? 'bg-#45E1B8' : 'bg-#FFF'}`}
                    ></div>
                </div>
            ))
        }

        const Column = () => {
            return columnInfo?.slice(0, columnInfo?.length > 1 ? 2 : 1).map((item, index) => (
                <Link href={`/special-column?id=${item.id}`} className="flex mb-4" key={item.id}>
                    <div className="relative w-15.5 h-19">
                        <Image
                            placeholder="blur"
                            blurDataURL={DefaultLoadingPicture()}
                            src={item?.logo ?? '/images/user/cover.svg'}
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
            ))
        }

        // 小课
        const Course = () => {
            return (
                <div className={'flex justify-center items-center'}>
                    <div className="text-center text-[#B5B5B5] mt-4 h-10">暂无数据哦~</div>
                </div>
            )
        }

        return (
            <>
                <div className="w-full pb-2 border-rd-2.5 bg-#FFF pl-4 pt-4 mt-4">
                    {/* 导航区域 */}
                    <div className="flex">
                        {renderButtons()}
                    </div>
                    {/*内容区域*/}
                    <div className='mt-3'>
                        {currentPage === 1 ? <Column/> : <Course/>}
                    </div>
                </div>
            </>
        )
    }

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
    )
        ;
};

export default Page;

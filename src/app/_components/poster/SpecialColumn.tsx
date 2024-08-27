"use client"
import Image from "next/image"
import {useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import {useEffect, useRef, useState} from "react";
import QRCode from "qrcode.react";
import {domToPng} from 'modern-screenshot';
import {Button} from "antd";
import Loading from "@/app/_components/common/Loading";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const SpecialColumn = () => {
    const params = useSearchParams();
    const columnId = params.get("id");
    const userId = api.column.getUserId.useQuery({
        id: columnId,
    });

    const {data: user, isLoading: isUserLoading} = api.users?.getOne.useQuery({
        id: userId.data,
    });

    const column = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    }).data;

    //分享的用户数据
    let userInfo;
    const [token, setToken] = useLocalStorage("token", null);
    if (typeof window !== "undefined") {
        const searchParams = useSearchParams();
        const code = searchParams.get("code");
        if (code && token === null) {
            userInfo = api.users.login.useQuery({
                code: code
            }).data;
            if (userInfo) {
                setToken(userInfo.id);
            }
        }
        if (token) {
            userInfo = api.users.getOne.useQuery({id: token}).data;
        }
    }

    const {data: orderData, isLoading: isOrderLoading} = api.order.getColumnOrder.useQuery({
        columnId: columnId,
    })

    const {data: readData, isLoading: isReadLoading} = api.post.getAllPost.useQuery({
        columnId: columnId
    });

    const [columnIntro, setColumnIntro] = useState("");
    useEffect(() => {
        if (column && column.introduce) {
            if (column.introduce.length > 176) {
                setColumnIntro(column.introduce.substring(0, 101) + "...");
            } else {
                setColumnIntro(column.introduce);
            }
        } else {
            setColumnIntro("暂无数据");
        }
    }, [column]);

    //生成分享二维码
    const originURL = window?.location?.origin;
    const qrcodeURL = originURL + `/special-column?id=${columnId}&code=${token} `

    const png = useRef(null);
    // 处理截图按钮点击事件
    const handleScreenshotClick = async () => {
        try {
            const dataUrl = await domToPng(png.current);
            // 创建一个<a>元素用于下载截图
            const link = document.createElement('a')
            link.download = 'screenshot.png'
            link.href = dataUrl
            link.click()
        } catch (error) {
            alert('无法截图，请重试。');
        }
    };

    if (isUserLoading || isOrderLoading || isReadLoading) return <div
        className={"h-screen w-full flex items-center justify-center"}><Loading/></div>

    return <div className="min-h-screen bg-[#999999] flex justify-center items-center px-4">
        <div ref={png} className="w-full h-124 bg-[#ffffff]">
            {/* 顶部作者信息 */}
            <div className="flex">
                <div className="flex items-center w-full h-19.375">
                    {/* 作者头像与名称 */}
                    <div className="relative w-12.25 h-12.25 ml-5.25 mt-7.125">
                        <Image
                            placeholder="blur"
                            blurDataURL={DefaultLoadingPicture()}
                            src={user?.avatar ?? DefaultLoadingPicture()}
                            alt='cover'
                            quality={100}
                            fill
                            loading='lazy'
                            className='rounded-full object-cover '
                        />
                    </div>
                    <div className="flex flex-col h-20">
                        <div className="text-[#333333] text-3.5 font-500 lh-6 h-5 ml-2.25 mt-8 "
                             style={{
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 whiteSpace: 'nowrap'
                             }}>
                            {user?.name ? user?.name : "未知用户"}
                        </div>
                        {/* 专栏订阅数和内容数 */}
                        <div className="flex items-center ml-2.25">
                            <div
                                className={"text-[#252525] font-D-DIN text-3.5 font-700 lh-6"}>{orderData?.length}</div>
                            <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25 mt-0.5">订阅</div>
                            <div
                                className="text-[#252525] font-D-DIN text-3.5 font-700 lh-6 ml-1">{readData?.length}</div>
                            <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25 mt-0.5">内容</div>
                        </div>
                    </div>
                </div>
                <Image src={"/images/poster/wholeLogo.svg"}
                       alt="wholeLogo"
                       width={2}
                       height={2}
                       className="w-9.5 h-4.29725 mt-7 mr-5">
                </Image>

            </div>

            {/* 专栏名称 */}
            <div className="h-5.387 text-[#333] text-3.5 font-500 lh-6 mt-9 ml-4.5 mx-10 break-words">
                {column?.name ? column?.name : "暂无数据"}
            </div>


            {/* 专栏内容 */}
            <div className=" w-73 h-44.5 ml-4.5 mt-4">
                <Image src={"/images/poster/title1.svg"} alt="title1" width={2} height={2} className="w-14.75 h-5.25"/>
                <div className="flex justify-center items-center mt-3.375">
                    <div className="relative w-25 h-32">
                        <Image
                            placeholder="blur"
                            blurDataURL={DefaultLoadingPicture()}
                            src={column?.logo ?? DefaultLoadingPicture()}
                            alt='cover'
                            quality={100}
                            fill
                            loading='lazy'
                            className='rounded object-cover '
                        />
                    </div>
                    {/* 简介内容 */}
                    <div className="w-44.744 h-35 text-[#666] text-2.5 font-500 lh-6 ml-2.75 mt-2"
                         style={{
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             display: '-webkit-flex',
                             WebkitLineClamp: 6
                         }}
                    >
                        {columnIntro}
                    </div>
                </div>
            </div>

            {/* 底部用户信息 */}
            <div className="flex ml-4.375 mt-14">
                <div className="w-40 mt-2">
                    <Button type={'link'} size={'small'} onClick={handleScreenshotClick}
                            className="flex items-center w-20 h-3">
                        <Image src={"/images/poster/triangle.svg"} alt="triangle" width={2} height={2}
                               className="w-2.58125 h-2.58125 "/>
                        <div className="h-5.7 text-[#666] text-2.5 font-500 lh-6 ml-1.5">保存到相册</div>
                    </Button>

                    {/* 用户头像和名称 */}
                    <div className="flex items-center mt-3.5">
                        <div className="relative w-4.5 h-4.5">
                            <Image
                                placeholder="blur"
                                blurDataURL={DefaultLoadingPicture()}
                                src={userInfo?.avatar ?? DefaultLoadingPicture()}
                                alt='cover'
                                quality={100}
                                fill
                                loading='lazy'
                                className='rounded-full object-cover '
                            />
                        </div>
                        <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6 ml-1.25">
                            {token ? userInfo?.name : "未知用户"}
                        </div>
                    </div>

                    <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6">
                        分享了一篇专栏
                    </div>
                </div>

                <div className="ml-18.5">
                    <div
                        className="w-16 h-16 mx-auto flex items-center justify-center rounded-1.5 border-1.5 border-[#c1c1c1] ">
                        <QRCode
                            id="columnQrCode"
                            value={qrcodeURL}
                            size={50}
                        />
                    </div>
                    <div className="h-5.75 text-[#999] text-2.5 font-400 lh-6 mt-1.25">扫码查看详情</div>
                </div>
            </div>
        </div>
    </div>
};

export default SpecialColumn;

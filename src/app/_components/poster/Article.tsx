"use client"
import Image from "next/image"
import {useSearchParams } from "next/navigation";
import React, {useRef, useState} from "react";
import {api} from "@/trpc/react";
import {useEffect} from "react";
import useLocalStorage from "@/tools/useStore";
import  QRCode  from 'qrcode.react';
import { domToPng } from 'modern-screenshot';

export const Article = () => {
    const params = useSearchParams();
    const chapter = params ? parseInt(params.get("c")) : null;
    const columnId = params ? params.get("id") : null;

    const { data: postData} = api.post.getById.useQuery({
        id: columnId,
        chapter: chapter
      });
    
    const userId = api.column.getUserId.useQuery({
    id: columnId,
    });

    const { data: user} = api.users?.getOne.useQuery({
    id: userId.data,
    });
    
    //分享的用户数据
    let userInfo;
    const [token, setToken] = useLocalStorage("token", null);
    if (typeof window !== "undefined"){
        const searchParams = useSearchParams();
        const code = searchParams.get("code");
        if (code && token === null){
            userInfo = api.users.login.useQuery({
                code:code
            }).data;
            if (userInfo){
                setToken(userInfo.id);
            }
        }
        if (token) {
            userInfo = api.users.getOne.useQuery({ id: token }).data;
        }
    }

    // 点赞数
    const likeCount = api.like.getLikeCount.useQuery({
        postId: postData?.id || null
    }).data;
    
    // 阅读数
    const readCount = api.read.getPostRead.useQuery({
        postId: postData?.id || null
    }).data;
    
    // 文章内容截断处理
    const [postContent, setPostContent] = useState("");
    useEffect(() => {
        if (postData?.content && postData.content.length > 176) {
            setPostContent(postData.content.substring(0, 176) + "...");
        } else {
            setPostContent(postData?.content)
        }
    }, [postData?.content || null])

    // 生成分享二维码
    const originURL = window?.location?.origin;
    const qrcodeURL = `${originURL}/special-column-content?c=${chapter}&id=${columnId}&code=${token}`;

    // useRef来获取截图按钮的引用
    const screenshotButtonRef = useRef(null);

    // 处理截图按钮点击事件
    const handleScreenshotClick = async () => {
        try {
            const dataUrl = await domToPng(document.querySelector('#poster'));

            // 创建一个<a>元素用于下载截图
            const link = document.createElement('a');
            link.download = 'screenshotArticle.png';  
            link.href = dataUrl; 
            link.classList.add('hidden'); 
            // console.log(link.href);  //查看生成的图片

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('保存成功！');
        } catch (error) {
            console.error('截图失败:', error);
            alert('无法截图，请重试。');
        }
    };

    // useEffect来监听截图按钮的点击事件
    useEffect(() => {
        const button = screenshotButtonRef.current;
        if (button) {
            button.addEventListener('click', handleScreenshotClick);
        }
        return () => {
            if (button) {
                button.removeEventListener('click', handleScreenshotClick);
            }
        };
    }, []); 

    return (
        <div className="relative min-h-screen bg-[#999999] pt-25.75">
            <div id="poster" className="w-85.75 h-129.5005 bg-[#ffffff] ml-4">
                {/* 顶部作者信息 */}
                <div className="flex">
                    <div className="flex items-center w-full h-19.375">
                        {/* 作者头像与名称 */}
                        <Image
                            src={user?.avatar ? user?.avatar : "/images/recommend/cover.svg"}
                            alt={"usericon"}
                            width={49}
                            height={49}
                            className="w-12.25 h-12.25 shrink-0 ml-5.25 mt-7.125"
                        />
                        <div className="flex flex-col h-20">
                            <div className="text-[#333333] text-3.5 font-500 lh-6 h-5 ml-2.25 mt-8"
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                {user?.name ? user?.name : "未知用户"}
                            </div>
                            {/* 文章点赞数和浏览数 */}
                            <div className="flex items-center ml-2.25">
                                <div className="text-[#252525] font-D-DIN text-3.5 font-700 lh-6">{likeCount}</div>
                                <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25 mt-0.5">点赞</div>
                                <div className="text-[#252525] font-D-DIN text-3.5 font-700 lh-6 ml-1">{readCount}</div>
                                <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25 mt-0.5">浏览</div>
                            </div>
                        </div>
                    </div>
                    <Image src={"/images/poster/wholeLogo.svg"} alt="wholeLogo" width={2} height={2} className="w-9.5 h-4.29725 mt-7 mr-5"></Image>
                </div>

                {/* 文章标题 */}
                <div className="h-5.387 text-[#333] text-3.5 font-500 lh-6 mt-9 ml-4.5 mx-10"
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                    {postData?.name ? postData?.name : "暂无数据"}
                </div>

                {/* 文章内容 */}
                <div className="relative w-72.462 h-43.25 mt-4 ml-4.5">
                    <Image src={"/images/poster/title2.svg"} alt="title2" width={2} height={2} className="w-14.75 h-5.25" />
                    <div className="w-72.462 h-35 text-[#666] text-2.5 font-500 lh-6 mt-1.25"
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 6,
                        }}
                        dangerouslySetInnerHTML={{ __html: postContent }}>
                    </div>
                </div>

                {/* 底部用户信息 */}
                <div className="flex h-40 ml-4.375 mt-14">
                    <div className="w-40 mt-2">
                        <button ref={screenshotButtonRef} className="flex items-center w-20 h-3">
                            <Image src={"/images/poster/triangle.svg"} alt="triangle" width={2} height={2} className="w-2.58125 h-2.58125" />
                            <div className="h-5.7 text-[#666] text-2.5 font-500 lh-6 ml-1.5">保存到相册</div>
                        </button>

                        {/* 用户头像和名称 */}
                        <div className="flex items-center mt-3.5">
                            <Image
                                placeholder="blur"
                                blurDataURL={userInfo?.avatar ?? "/images/user/Loading.svg"}
                                src={userInfo?.avatar ?? "/images/user/Loading.svg"}
                                alt="avatar"
                                width={83}
                                height={83}
                                className="w-4.5 h-4.5 rounded-full stroke-0.25 stroke-[#FFF]"
                            />
                            <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6 ml-1.25">
                                {token ? userInfo?.name : "未知用户"}
                            </div>
                        </div>

                        <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6">分享了一篇文章</div>
                    </div>

                    <div className="ml-18.5">
                        <div className="w-12 h-12 mx-auto rounded-1.5 border-1.5 border-[#c1c1c1] bg-white">
                            <QRCode
                                id="articleQrCode"
                                value={qrcodeURL}
                                size={35}
                                className="mt-1.25 ml-1.25"
                            />
                        </div>
                        <div className="h-5.75 text-[#999] text-2.5 font-400 lh-6 mt-1.25">扫码查看详情</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

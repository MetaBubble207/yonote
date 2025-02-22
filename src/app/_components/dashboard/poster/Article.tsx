"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import QRCode from "qrcode.react";
import { domToPng } from "modern-screenshot";
import { Button } from "antd";
import Loading from "@/app/_components/common/Loading";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const Article = ({ chapter, columnId }: { chapter: number, columnId: string }) => {

  const { data: postData, isLoading: isPostDataLoading } =
    api.post.getById.useQuery({
      id: columnId,
      chapter: chapter,
    });

  const userId = api.column.getUserId.useQuery({
    id: columnId,
  });

  const { data: user, isLoading: isUserLoading } = api.users?.getOne.useQuery({
    id: userId.data!,
  });

  //分享的用户数据
  let userInfo;
  const [token, setToken] = useLocalStorage("token", null);
  if (typeof window !== "undefined") {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    if (code && token === null) {
      userInfo = api.users.login.useQuery({
        code: code,
      }).data;
      if (userInfo) {
        setToken(userInfo.id);
      }
    }
    if (token) {
      userInfo = api.users.getOne.useQuery({ id: token }).data;
    }
  }
  // 点赞数
  const { data: likeCount, isLoading: isLikeLoading } =
    api.like.getLikeCount.useQuery({
      postId: postData?.id || null,
    });

  // 阅读数
  const { data: readCount, isLoading: isReadLoading } =
    api.read.getPostRead.useQuery({
      postId: postData?.id || null,
    });

  // 文章内容截断处理
  const [postContent, setPostContent] = useState("");
  useEffect(() => {
    if (postData?.content && postData.content.length > 176) {
      setPostContent(postData.content.substring(0, 176) + "...");
    } else {
      setPostContent(postData?.content);
    }
  }, [postData?.content || null]);

  // 生成分享二维码
  const originURL = window?.location?.origin;
  const qrcodeURL = `${originURL}/dashboard/special-column/content?c=${chapter}&id=${columnId}&invitationCode=${token}`;

  const png = useRef(null);
  const [pngUrl, setPngUrl] = useState<string>("");
  const [isScreenshot, setScreenshot] = useState(false);
  // 处理截图按钮点击事件
  const handleScreenshotClick = async () => {
    try {
      setScreenshot(true);
      const dataUrl = await domToPng(png.current!, {
        scale: 2,
        quality: 1,
      });
      setPngUrl(dataUrl);
    } catch (error) {
      alert("无法截图，请重试。");
    }
  };
  useEffect(() => {
    if (pngUrl) {
      setScreenshot(false);
    }
  }, [pngUrl]);
  if (isUserLoading || isPostDataLoading || isReadLoading || isLikeLoading)
    return (
      <div className={"flex h-screen w-full items-center justify-center"}>
        <Loading />
      </div>
    );
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#999999]">
      {isScreenshot && (
        <div
          className={
            "z-100 absolute flex h-screen w-full items-center justify-center"
          }
        >
          <Loading />
        </div>
      )}
      {pngUrl !== "" ? (
        <div className={"w-88 h-140 relative"}>
          <Image src={pngUrl} alt={"poster"} fill quality={100} />
        </div>
      ) : (
        <div ref={png} className="h-129.5005 mx-4 w-full bg-[#ffffff]">
          {/* 顶部作者信息 */}
          <div className="flex">
            <div className="h-19.375 flex w-full items-center">
              {/* 作者头像与名称 */}
              <div className="w-12.25 h-12.25 ml-5.25 mt-7.125 relative">
                <Image
                  placeholder="blur"
                  blurDataURL={DefaultLoadingPicture()}
                  src={user?.avatar ?? DefaultLoadingPicture()}
                  alt="cover"
                  quality={100}
                  fill
                  loading="lazy"
                  className="rounded-4 object-cover"
                />
              </div>
              <div className="flex h-20 flex-col">
                <div
                  className="text-3.5 font-500 lh-6 ml-2.25 mt-8 h-5 text-[#333333]"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name ? user?.name : "未知用户"}
                </div>
                {/* 文章点赞数和浏览数 */}
                <div className="ml-2.25 flex items-center">
                  <div className="font-D-DIN text-3.5 font-700 lh-6 text-[#252525]">
                    {likeCount}
                  </div>
                  <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                    点赞
                  </div>
                  <div className="font-D-DIN text-3.5 font-700 lh-6 ml-1 text-[#252525]">
                    {readCount}
                  </div>
                  <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                    浏览
                  </div>
                </div>
              </div>
            </div>
            <Image
              src={"/images/poster/wholeLogo.svg"}
              alt="wholeLogo"
              width={2}
              height={2}
              className="mr-5 mt-7 h-12 w-16"
            ></Image>
          </div>

          {/* 文章标题 */}
          <div
            className="h-5.387 text-3.5 font-500 lh-6 ml-4.5 mx-10 mt-9 text-[#333]"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {postData?.name ? postData?.name : "暂无数据"}
          </div>

          {/* 文章内容 */}
          <div className="w-72.462 h-43.25 ml-4.5 relative mt-4">
            <Image
              src={"/images/poster/title2.svg"}
              alt="title2"
              width={2}
              height={2}
              className="w-14.75 h-5.25"
            />
            <div
              className="w-72.462 h-35 text-2.5 font-500 lh-6 mt-1.25 text-[#666]"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 6,
              }}
              dangerouslySetInnerHTML={{ __html: postContent }}
            ></div>
          </div>

          {/* 底部用户信息 */}
          <div className="ml-4.375 mt-14 flex h-40">
            <div className="mt-2 w-40">
              <Button
                type={"link"}
                size={"small"}
                onClick={handleScreenshotClick}
              >
                <div className="flex items-center">
                  <Image
                    src={"/images/poster/triangle.svg"}
                    alt="triangle"
                    width={2}
                    height={2}
                    className="w-2.58125 h-2.58125"
                  />
                  <div className="text-2.5 font-500 ml-1.5 text-[#666]">
                    点击生成图片后长按保存
                  </div>
                </div>
              </Button>

              {/* 用户头像和名称 */}
              <div className="mt-3.5 flex items-center">
                <div className="w-4.5 h-4.5 relative">
                  <Image
                    placeholder="blur"
                    blurDataURL={DefaultLoadingPicture()}
                    src={userInfo?.avatar ?? DefaultLoadingPicture()}
                    alt="cover"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="h-5.75 text-2.5 font-500 lh-6 ml-1.25 text-[#999]">
                  {token ? userInfo?.name : "未知用户"}
                </div>
              </div>

              <div className="h-5.75 text-2.5 font-500 lh-6 text-[#999]">
                分享了一篇文章
              </div>
            </div>

            <div className="ml-18.5">
              <div className="rounded-1.5 border-1.5 mx-auto flex h-16 w-16 items-center justify-center border-[#c1c1c1]">
                <QRCode id="columnQrCode" value={qrcodeURL} size={50} />
              </div>
              <div className="h-5.75 text-2.5 font-400 lh-6 mt-1.25 text-[#999]">
                扫码查看详情
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Article;

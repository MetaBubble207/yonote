"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import { domToPng } from "modern-screenshot";
import { Button } from "antd";
import Loading from "@/app/_components/common/Loading";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";

const SpecialColumn = () => {
  const params = useSearchParams();
  const columnId = params.get("id");
  const { data: user, isLoading: isUserLoading } = api.users.getOneByColumnId.useQuery(columnId!);
  const column = api.column.getColumnDetail.useQuery(columnId!).data;

  //分享的用户数据
  let userInfo;
  const [token, setToken] = useLocalStorage("token", null);
  if (typeof window !== "undefined") {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    if (code && token === null) {
      userInfo = api.users.login.useQuery(code).data;
      if (userInfo) {
        setToken(userInfo.id);
      }
    }
    if (token) {
      userInfo = api.users.getOne.useQuery(token).data;
    }
  }

  const { data: orderData, isLoading: isOrderLoading } =
    api.order.getColumnOrder.useQuery({columnId: columnId!});

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
  const qrcodeURL =
    originURL +
    `/dashboard/special-column?id=${columnId}&invitationCode=${token} `;

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
  if (isUserLoading || isOrderLoading)
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
        <div ref={png} className="h-124 mx-4 w-full bg-[#ffffff]">
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
                  className="rounded-full object-cover"
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
                {/* 专栏订阅数和内容数 */}
                <div className="ml-2.25 flex items-center">
                  <div
                    className={
                      "font-D-DIN text-3.5 font-700 lh-6 text-[#252525]"
                    }
                  >
                    {orderData?.subscriptCount}
                  </div>
                  <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                    订阅
                  </div>
                  <div className="font-D-DIN text-3.5 font-700 lh-6 ml-1 text-[#252525]">
                    {orderData!.detailPostCard.length}
                  </div>
                  <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                    内容
                  </div>
                </div>
              </div>
            </div>
            <Image
              src={"/images/poster/wholeLogo.svg"}
              alt="wholeLogo"
              width={2}
              height={2}
              className="w-9.5 h-4.29725 mr-5 mt-7"
            ></Image>
          </div>

          {/* 专栏名称 */}
          <div className="h-5.387 text-3.5 font-500 lh-6 ml-4.5 mx-10 mt-9 break-words text-[#333]">
            {column?.name ? column?.name : "暂无数据"}
          </div>

          {/* 专栏内容 */}
          <div className="w-73 h-44.5 ml-4.5 mt-4">
            <Image
              src={"/images/poster/title1.svg"}
              alt="title1"
              width={2}
              height={2}
              className="w-14.75 h-5.25"
            />
            <div className="mt-3.375 flex items-center justify-center">
              <div className="w-25 relative h-32">
                <Image
                  placeholder="blur"
                  blurDataURL={DefaultLoadingPicture()}
                  src={column?.cover ?? DefaultLoadingPicture()}
                  alt="cover"
                  quality={100}
                  fill
                  loading="lazy"
                  className="rounded object-cover"
                />
              </div>
              {/* 简介内容 */}
              <div
                className="w-44.744 h-35 text-2.5 font-500 lh-6 ml-2.75 mt-2 text-[#666]"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-flex",
                  WebkitLineClamp: 6,
                }}
              >
                {columnIntro}
              </div>
            </div>
          </div>

          {/* 底部用户信息 */}
          <div className="ml-4.375 mt-14 flex">
            <div className="mt-2 w-40">
              <Button
                type={"link"}
                size={"small"}
                onClick={handleScreenshotClick}
              >
                <div className={"flex items-center"}>
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
                分享了一篇专栏
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

export default SpecialColumn;

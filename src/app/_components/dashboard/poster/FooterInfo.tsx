import Image from "next/image";
import { Button } from "antd";
import QRCode from "qrcode.react";
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";
import { UserSelect } from "@/server/db/schema";

interface BottomInfoProps {
  userInfo: UserSelect;
  token: string | null;
  qrcodeURL: string;
  onScreenshot: () => void;
}

export const FooterInfo = ({ userInfo, token, qrcodeURL, onScreenshot }: BottomInfoProps) => {
  return (
    <div className="ml-4.375 mt-14 flex h-40">
      <div className="mt-2 w-40">
        <Button type={"link"} size={"small"} onClick={onScreenshot}>
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

        <div className="mt-3.5 flex items-center">
          <div className="w-4.5 h-4.5 relative">
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={userInfo?.avatar ?? NotImage()}
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
  );
};
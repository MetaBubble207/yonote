import Image from "next/image";
import { Button } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { UserSelect } from "@/server/db/schema";

interface BottomInfoProps {
  userInfo: UserSelect;
  qrCodeURL: string;
  onScreenshot: () => void;
  type: "column" | "post" | "course";
}

export const FooterInfo = ({ userInfo, qrCodeURL, onScreenshot, type }: BottomInfoProps) => {
  const renderText = () => {
    if (type === "column") {
      return "一个专栏";
    } else if (type === "post") {
      return "一篇文章";
    } else if (type === "course") {
      return "一个小课";
    }
  };
  return (
    <div className="mt-14 flex justify-between text-2.5 font-medium ">
      <div className="mt-2 w-40">
        <Button type={"link"} size={"small"} onClick={onScreenshot} className="pl-[0]!">
          <div className="flex items-center">
            <Image
              src={"/images/poster/triangle.svg"}
              alt="triangle"
              width={2}
              height={2}
              className="w-2.58125 h-2.58125"
            />
            <div className="text-2.5 font-medium ml-1.5 text-[#666]">
              点击生成图片后长按保存
            </div>
          </div>
        </Button>

        <div className="mt-3.5 flex items-center">
          <div className="w-4.5 h-4.5 relative">
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={userInfo.avatar ?? NotImage()}
              alt="cover"
              quality={100}
              fill
              loading="lazy"
              className="rounded-full object-cover"
            />
          </div>
          <div className="ml-1.25 text-[#999]">
            {userInfo.name}
          </div>
        </div>

        <div className="text-[#999]">
          分享了{renderText()}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="rounded-1.5 border mx-auto flex h-16 w-16 items-center justify-center border-[#c1c1c1] border-solid">
          <QRCodeCanvas id="columnQrCode" value={qrCodeURL} size={50} />
        </div>
        <div className="mt-1.25 text-[#999]">
          扫码查看详情
        </div>
      </div>
    </div>
  );
};
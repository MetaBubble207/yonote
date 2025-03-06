"use client";
import Image from "next/image";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import ActionButtons from "./ActionButton";
import { message, Skeleton } from "antd";
import { ShareDialog } from "../../dialog/ShareDialog";

const CONSTANTS = {
  MAX_NAME_LENGTH: 10,
  MAX_INTRO_LENGTH: 20,
  HEADER_IMAGE: {
    WIDTH: 375,
    HEIGHT: 74.5
  },
  COVER_IMAGE: {
    WIDTH: 111,
    HEIGHT: 156
  },
  AVATAR_SIZE: 18,
  VIP_ICON_SIZE: 12
} as const;

const SpecialColumnHeader = ({ columnId, showSpeedPlanIcon }: { columnId: string, showSpeedPlanIcon: boolean }) => {
  const router = useRouter();

  const { data, isLoading } = api.column.getColumnUser.useQuery(
    columnId,
    { enabled: Boolean(columnId) }
  );

  const handleUserDetail = () => {
    if (!data?.userId) return;
    router.push(`/dashboard/user/detail?id=${data.userId}`);
  };
  const [messageApi, contextHolder] = message.useMessage();

  const [openShare, setOpenShare] = useState(false);

  // 使用 useCallback 来记忆化函数，避免不必要的重渲染
  const handleClickShare = useCallback(() => {
    setOpenShare(false);
    router.push(`/dashboard/poster/column?id=${columnId}`);
  }, [columnId, router]);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    messageApi.success("复制成功");
    setOpenShare(false);
  };

  const handleClickCopy = () => {
    const currentUrl = `${window.location.origin}/dashboard/special-column?id=${columnId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).catch(() => fallbackCopyTextToClipboard(currentUrl));
      messageApi.success("复制成功");
      setOpenShare(false);
    } else {
      fallbackCopyTextToClipboard(currentUrl);
    }
  };
  const handleClickShareIcon = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenShare(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpenShare(false);
  }, []);

  // 使用 useEffect 来监听状态变化
  useEffect(() => {
    console.log("openShare state changed:", openShare);
  }, [openShare]);

  // const handleClickCopy = () => {
  //   setOpenShare(false);
  //   const currentUrl = `${window.location.origin}/dashboard/special-column?id=${columnId}`;
  //   navigator.clipboard.writeText(currentUrl)
  //     .then(() => {
  //       messageApi.success('链接已复制到剪贴板');
  //     })
  //     .catch(() => {
  //       messageApi.error('复制失败，请重试');
  //     });
  // };
  // console.log("handle ===>", openShare);

  // const handleClickShareIcon = () => {
  //   setOpenShare(true);
  // }
  const truncateText = useMemo(() => (text: string | undefined | null, maxLength: number) => {
    if (!text) return "";
    return text.length >= maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  const renderHeaderImage = () => (
    <div className="z-1 absolute top-0 w-full blur-sm filter">
      <Image
        placeholder="blur"
        blurDataURL={LoadingImage()}
        src={data?.cover ?? NotImage()}
        alt="background"
        width={CONSTANTS.HEADER_IMAGE.WIDTH}
        height={CONSTANTS.HEADER_IMAGE.HEIGHT}
        style={{ width: "100%" }}
      />
      <div className="absolute inset-0 bg-black opacity-20" />
    </div>
  );

  const renderColumnInfo = () => (
    <div className="ml-10px flex flex-col">
      <div className="text-4.5 text-[#FFF]">
        {truncateText(data?.name, CONSTANTS.MAX_NAME_LENGTH) || "未知专栏"}
      </div>
      <div className="text-3.5 pt-5px w-50 text-[#F2F2F2]">
        {truncateText(data?.introduce, CONSTANTS.MAX_INTRO_LENGTH) || "暂时没有数据"}
      </div>
      <div className="mt-2 flex items-center">
        <Image
          placeholder="blur"
          blurDataURL={LoadingImage()}
          src={data?.avatar ?? NotImage()}
          alt="avatar"
          width={CONSTANTS.AVATAR_SIZE}
          height={CONSTANTS.AVATAR_SIZE}
          onClick={handleUserDetail}
          className="cursor-pointer"
        />
        <div className="text-2.75 lh-18px ml-5px text-[#DFDFDF]">
          {data?.userName || "未知用户"}
        </div>
        {data?.idType === 1 && (
          <Image
            src="/images/user/vip.svg"
            alt="VIP图标"
            width={CONSTANTS.VIP_ICON_SIZE}
            height={CONSTANTS.VIP_ICON_SIZE}
            className="ml-1"
          />
        )}
      </div>
    </div>
  );

  const renderSkeletonHeader = () => (
    <>
      {/* <div className="z-1 absolute top-0 w-full ">
        <Skeleton.Image active className="!h-74.5 !w-full" />
      </div> */}
      <div className="z-3 absolute left-0 top-2.5 w-full">
        <ActionButtons handleClickShareIcon={handleClickShareIcon} showSpeedPlanIcon={showSpeedPlanIcon} />
        <div className="mt-6px flex w-full items-start pl-5">
          <Skeleton.Image active className="!h-39 !w-27.7 rounded-10px" />
          <div className="ml-10px flex flex-col">
            <Skeleton.Input active size="small" className="!w-40" />
            <Skeleton.Input active size="small" className="!mt-2 !w-50" />
            <div className="mt-2 flex items-center">
              <Skeleton.Avatar active size="small" className="!h-[18px] !w-[18px]" />
              <Skeleton.Input active size="small" className="!ml-2 !w-20" />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return renderSkeletonHeader();
  }
  if (!data) {
    return null;
  }
  return (
    <>
      {renderHeaderImage()}
      <div className="z-3 absolute left-0 top-2.5 w-full">
        <ActionButtons handleClickShareIcon={handleClickShareIcon} showSpeedPlanIcon={showSpeedPlanIcon} />
        <div className="mt-6px flex w-full items-start pl-5">
          <Image
            placeholder="blur"
            blurDataURL={LoadingImage()}
            src={data?.cover ?? NotImage()}
            width={CONSTANTS.COVER_IMAGE.WIDTH}
            height={CONSTANTS.COVER_IMAGE.HEIGHT}
            alt="封面"
            className="w-27.7 h-39 object-top-center rounded-10px object-cover"
          />
          {renderColumnInfo()}
        </div>
      </div>
      <ShareDialog open={openShare} onClose={handleClose}
        columnData={data} handleClickShare={handleClickShare} handleClickCopy={handleClickCopy}
      />
      {contextHolder}
    </>
  );
};

export default memo(SpecialColumnHeader);

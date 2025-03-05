"use client";
import Image from "next/image";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { useMemo } from "react";
import ActionButtons from "./ActionButton";
import { Skeleton } from "antd";

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
        <ActionButtons url={`/dashboard/poster/column?id=${columnId}`} showSpeedPlanIcon={showSpeedPlanIcon}/>
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
  return (
    <>
      {renderHeaderImage()}
      <div className="z-3 absolute left-0 top-2.5 w-full">
        <ActionButtons url={`/dashboard/poster/column?id=${columnId}`} showSpeedPlanIcon={showSpeedPlanIcon}/>
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
    </>
  );
};

export default SpecialColumnHeader;

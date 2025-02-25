"use client";
import Image from "next/image";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import Loading from "@/app/_components/common/Loading";
import { useMemo } from "react";

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
  AVATAR_SIZE: 18
} as const;

const SpecialColumnHeader = ({ columnId }: { columnId: string }) => {
  const router = useRouter();

  const { data, isLoading } = api.column.getColumnUser.useQuery(
    { columnId: columnId! },
    { enabled: Boolean(columnId) }
  );

  const handleShare = () => {
    if (!data?.id) return;
    router.push(`/dashboard/poster/column?id=${data.id}`);
  };

  const handleUserDetail = () => {
    if (!data?.userId) return;
    router.push(`/dashboard/user/detail?id=${data.userId}`);
  };

  const truncateText = useMemo(() => (text: string | undefined | null, maxLength: number) => {
    if (!text) return "";
    return text.length >= maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  if (isLoading) {
    return (
      <div className="mt-10 bg-white">
        <Loading />
      </div>
    );
  }

  const renderHeaderImage = () => (
    <div className="z-1 absolute top-0 w-full blur-sm filter">
      <Image
        placeholder="blur"
        blurDataURL={DefaultLoadingPicture()}
        src={data?.cover ?? DefaultLoadingPicture()}
        alt="background"
        width={CONSTANTS.HEADER_IMAGE.WIDTH}
        height={CONSTANTS.HEADER_IMAGE.HEIGHT}
        style={{ width: "100%" }}
      />
      <div className="absolute inset-0 bg-black opacity-20" />
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex items-center justify-end">
      <button
        className="rounded-full text-[10px] bg-#45E1B8"
        style={{ width: 56, height: 24 }}
      >
        加速计划
      </button>
      <button
        className="mr-16px ml-2.5 bg-transparent"
        onClick={handleShare}
      >
        <Image
          src="/images/special-column/Share-two.png"
          alt="分享"
          width={12}
          height={12}
        />
      </button>
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
          blurDataURL={DefaultLoadingPicture()}
          src={data?.avatar ?? DefaultLoadingPicture()}
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
            src="/images/special-column/Group 225.png"
            alt="VIP图标"
            width={CONSTANTS.AVATAR_SIZE}
            height={CONSTANTS.AVATAR_SIZE}
            className="ml-1"
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {renderHeaderImage()}
      <div className="z-3 absolute left-0 top-2.5 w-full">
        {renderActionButtons()}
        <div className="mt-6px flex w-full items-start pl-5">
          <Image
            placeholder="blur"
            blurDataURL={DefaultLoadingPicture()}
            src={data?.cover ?? DefaultLoadingPicture()}
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

"use client";
import Image from "next/image";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import Loading from "@/app/_components/common/Loading";

const SpecialColumnHeader = () => {
  const params = useSearchParams();
  const columnId = params.get("id");
  const { data, isLoading } = api.column.getColumnUser.useQuery({
    columnId: columnId,
  });

  const router = useRouter();

  const toShare = () => {
    router.push(`/dashboard/poster/column?id=${data.id}`);
  };
  const toUserDetail = () => {
    router.push(`/dashboard/user/detail?id=${data.userId}`);
  };

  if (isLoading)
    return (
      <div className={"mt-10 bg-white"}>
        <Loading />
      </div>
    );

  return (
    <>
      <div className={"z-1 absolute top-0 w-full blur-sm filter"}>
        <Image
          placeholder="blur"
          blurDataURL={DefaultLoadingPicture()}
          src={data?.cover ?? DefaultLoadingPicture()}
          alt={"bg"}
          width={375}
          height={74.5}
          style={{ width: "100%" }}
        />

        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
      <div className={"z-3 absolute left-0 top-2.5 w-full"}>
        <div className={"flex items-center justify-end"}>
          <Button
            type={"primary"}
            size={"small"}
            style={{
              width: "14",
              height: "6",
              borderRadius: "9999px",
              fontSize: "10px",
            }}
          >
            加速计划
          </Button>
          {/* 点击分享，跳转海报 */}
          <Button
            type={"link"}
            size={"small"}
            className={"mr-16px ml-2.5"}
            onClick={toShare}
          >
            <Image
              src={"/images/special-column/Share-two.png"}
              alt={"分享"}
              width={12}
              height={12}
            />
          </Button>
        </div>
        <div className={"mt-6px flex w-full items-start pl-5"}>
          <Image
            placeholder="blur"
            blurDataURL={DefaultLoadingPicture()}
            src={data?.cover ?? DefaultLoadingPicture()}
            width={111}
            height={156}
            alt="img"
            className={
              "w-27.7 h-39 object-top-center rounded-10px object-cover"
            }
          />

          <div className={"ml-10px flex flex-col"}>
            <div className={"text-4.5 text-[#FFF]"}>
              {data?.name
                ? data.name.length >= 10
                  ? data.name.substring(0, 10) + "..."
                  : data.name
                : "未知专栏"}
            </div>
            <div className={"text-3.5 pt-5px w-50 text-[#F2F2F2]"}>
              {data?.introduce
                ? data.introduce.length >= 20
                  ? data.introduce.substring(0, 20) + "..."
                  : data.introduce
                : "暂时没有数据"}
            </div>
            <div className={"mt-2 flex"}>
              <Image
                placeholder="blur"
                blurDataURL={DefaultLoadingPicture()}
                src={data?.avatar ?? DefaultLoadingPicture()}
                alt={"avatar"}
                width={18}
                height={18}
                onClick={toUserDetail}
              />
              <div className={"text-2.75 lh-18px ml-5px text-[#DFDFDF]"}>
                {data?.userName ? data.userName : "未知用户"}
              </div>
              {data?.idType === 1 && (
                <Image
                  src={"/images/special-column/Group 225.png"}
                  alt={"icon"}
                  width={18}
                  height={18}
                  className={"ml-1"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialColumnHeader;

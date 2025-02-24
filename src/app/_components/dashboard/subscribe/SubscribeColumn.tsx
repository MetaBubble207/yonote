import Image from "next/image";
import Link from "next/link";
import { time2DateString } from "@/tools/timeToString";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import { BaseColumnCardDateString } from "@/server/db/schema";

const SubscribeColumn = ({ column }: { column: BaseColumnCardDateString }) => {
  return (
    <div className="h-29.25 mt-4 flex">
      <div className="h-18 relative">
        <Link href={`/dashboard/user/detail?id=${column.userId}`}>
          <div className="w-11.25 h-11.25 relative mt-4">
            <Image
              placeholder="blur"
              blurDataURL={DefaultLoadingPicture()}
              src={column.avatar ?? DefaultLoadingPicture()}
              alt="avatar"
              quality={100}
              fill
              loading="lazy"
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        {column.idType === 1 && (
          <div className="absolute bottom-2 right-1">
            <Image
              src="/images/subscribe/vip.svg"
              alt="vip"
              width={12}
              height={12}
              className="h-3 w-3"
            />
          </div>
        )}
        <div className="font-500 lh-5.6 text-2.5 w-11 overflow-hidden whitespace-nowrap text-center text-[#999]">
          {column.userName?.length >= 8
            ? column.userName + "…"
            : column.userName}
        </div>
      </div>
      <Link href={`/dashboard/special-column?id=${column.id}`} className="flex-1">
        <div className="text-2.75 lh-4 ml-2.6 text-[#B5B5B5]">
          {time2DateString(column.createdAt)}发布
        </div>
        <div className="border-rd-[2px_16px_16px_16px] w-73.25 ml-2 mt-1 flex h-24 shrink-0 items-center bg-[#FFF]">
          <div className="w-49.75 pl-2.5">
            <div className="text-3.75 font-500 lh-6 text-[#252525]">
              {column?.name
                ? column?.name?.length >= 20
                  ? column?.name?.substring(0, 20) + "..."
                  : column?.name
                : "未知专栏"}
            </div>
            <div className="text-3.25 font-400 relative mt-2 h-10 overflow-hidden text-[#666]">
              {column?.introduce
                ? column?.introduce?.length >= 25
                  ? column?.introduce?.substring(0, 25) + "..."
                  : column?.introduce
                : "未知专栏"}
              <div className="absolute bottom-0 right-0 h-4 w-full bg-gradient-to-t from-white" />
            </div>
          </div>
          <div className="w-15.5 h-19 relative ml-3">
            <Image
              placeholder="blur"
              blurDataURL={DefaultLoadingPicture()}
              src={column.cover ?? DefaultLoadingPicture()}
              alt="cover"
              fill
              loading="lazy"
              quality={100}
              className="rounded-2 object-cover"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SubscribeColumn;

import Image from "next/image";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import { UserSelect } from "@/server/db/schema";

interface AuthorInfoProps {
  user: UserSelect;
  children: React.ReactNode;
}

export const AuthorInfo = ({ user, children }: AuthorInfoProps) => {
  return (
    <div className="flex">
      <div className="h-19.375 flex w-full items-center">
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
          {children}
        </div>
      </div>
      <Image
        src={"/images/poster/wholeLogo.svg"}
        alt="wholeLogo"
        width={2}
        height={2}
        className="mr-5 mt-7 h-12 w-16"
      />
    </div>
  );
};
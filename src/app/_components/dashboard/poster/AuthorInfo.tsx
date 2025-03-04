import Image from "next/image";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { UserSelect } from "@/server/db/schema";

interface AuthorInfoProps {
  user: UserSelect;
  children: React.ReactNode;
}

export const AuthorInfo = ({ user, children }: AuthorInfoProps) => {
  return (
    <div className="flex justify-between">
      <div className="h-19.375 flex items-center">
        <div className="w-12.25 h-12.25 ml-5.25 mt-7.125 relative">
          <Image
            placeholder="blur"
            blurDataURL={LoadingImage()}
            src={user.avatar ?? NotImage()}
            alt="cover"
            quality={100}
            fill
            loading="lazy"
            className="rounded-4 object-cover"
          />
        </div>
        <div className="flex h-20 flex-col">
          <div
            className="text-3.5 font-medium leading-6 ml-2.25 mt-8 h-5 text-[#333333] 
            overflow-hidden text-ellipsis whitespace-nowrap">
            {user.name}
          </div>
          {children}
        </div>
      </div>
      <div className="w-18 relative h-8 mr-5 mt-7">
        <Image
          placeholder="blur"
          blurDataURL={LoadingImage()}
          src={"/images/poster/wholeLogo.svg"}
          alt="Logo"
          quality={100}
          fill
          loading="lazy"
          className="object-cover"
        />
      </div>
    </div>
  );
};
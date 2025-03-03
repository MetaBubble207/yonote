import React from "react";
import Image from "next/image";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { NotImage } from "@/utils/DefaultPicture";

interface PreviewProps {
  title: string;
  html: string;
  tags: string[];
}

export const Preview = ({ title, html, tags }: PreviewProps) => {
  const token = useLocalStorage("token", null);
  const user = api.users.getOne.useQuery(token[0]).data;
  console.log(user);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const months = currentDate.getMonth();
  const days = currentDate.getDate();
  const specificDate = `${year}-${months}-${days}`;

  return (
    <div>
      <div className="w-93 stroke-0.25 ml-4.5 b-1 b-#d9d9d9 relative shrink-0 stroke-[#D9D9D9]">
        <div className="text-5 font-not-italic font-400 lh-5.5 ml-3.725 mt-3.725 h-10 overflow-auto text-[rgba(0,0,0,0.85)]">
          <div
            className="break-all"
            dangerouslySetInnerHTML={{ __html: title }}
          ></div>
        </div>

        <div className="mt-10px mb-22px ml-3.725 mt-4 flex items-center space-y-0">
          {/*左边头像*/}
          <div className={""}>
            <div>
              <Image
                src={user?.avatar ?? NotImage()}
                alt={"心智与阅读"}
                width={33}
                height={33}
              />
            </div>
          </div>
          {/*昵称，日期，VIP*/}
          <div>
            <div className={"flex items-center"}>
              <div
                className={
                  "text-2.75 font-not-italic font-500 lh-18px ml-5px text-[#999]"
                }
              >
                {user?.name}
              </div>
              {user?.idType === 1 && (
                <Image
                  src={"/images/user/vip.svg"}
                  alt={"用户头像"}
                  width={12}
                  height={12}
                  className={"ml-1"}
                />
              )}
            </div>
            <div
              className={
                "text-2.75 font-not-italic font-500 lh-18px ml-5px text-[#999]"
              }
            >
              {specificDate}发布
            </div>
          </div>
        </div>
        <div
          className={
            "w-91% mt-24px text-3.5 font-not-italic font-400 lh-[120%] m-auto shrink-0 text-[#666]"
          }
        >
          <div className="h-79 overflow-auto">
            <div
              className="h-20 break-all"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          </div>
        </div>
        <div className="ml-3.725 w-23 h-40px mt-5 flex">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="w-15.5 text-3 font-400 mr-3 text-[#1DB48D]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
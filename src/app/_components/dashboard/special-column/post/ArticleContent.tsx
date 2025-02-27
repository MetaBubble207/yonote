"use client";

import Image from "next/image";
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";
import { type DetailPost } from "@/server/db/schema";

interface ArticleContentProps {
  postData: DetailPost;
  date: string;
  name: string;
  content: string;
}

export function ArticleContent({ postData, date, name, content }: ArticleContentProps) {
  return (
    <div className="mx-4">
      <div>{name}</div>
      <div className="mt-10px mb-22px flex items-center space-y-0">
        <div>
          <div>
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={postData?.user.avatar ?? NotImage()}
              alt="avatar"
              width={33}
              height={33}
              className="rounded-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <div className="text-2.75 font-not-italic font-500 lh-18px ml-5px text-[#999]">
              {postData?.user.name}
            </div>
            {postData?.user.idType === 1 && (
              <Image
                src="/images/special-column/Group 225.png"
                alt="心智与阅读"
                width={12}
                height={12}
                className="ml-1"
              />
            )}
          </div>
          <div className="text-2.75 font-not-italic font-500 lh-18px ml-5px text-[#999]">
            {date}发布
          </div>
        </div>
      </div>

      <div>
        {postData?.cover && (
          <Image
            src={postData.cover}
            alt="心智与阅读"
            width={343}
            height={161}
            className="w-85.75 h-40.25"
          />
        )}
      </div>
      <div className="w-85.75 mt-24px text-3.5 font-not-italic font-400 lh-[120%] h-auto shrink-0 overflow-auto text-[#666]">
        <div className="break-all" dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "@/app/_components/common/Loading";
import { useScreenshot } from "@/app/_hooks/useScreenshot";
import { AuthorInfo } from "./AuthorInfo";
import { FooterInfo } from "./FooterInfo";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { ArticleContent } from "./ArticleContent";
import { DetailPost, UserSelect } from "@/server/db/schema";

interface PostPosterProp {
  user: UserSelect;
  postData: DetailPost;
  likeCount: number;
  readCount: number;
  columnId: string;
  chapter: number;
}

export const PostPoster = ({ user, postData, likeCount, readCount, chapter, columnId }: PostPosterProp) => {
  const [token] = useLocalStorage('token', null);

  const [postContent, setPostContent] = useState("");
  useEffect(() => {
    if (postData?.content && postData.content.length > 176) {
      setPostContent(postData.content.substring(0, 176) + "...");
    } else {
      setPostContent(postData?.content || "");
    }
  }, [postData?.content]);

  const originURL = typeof window !== 'undefined' ? window.location.origin : '';
  const qrcodeURL = `${originURL}/dashboard/special-column/content?c=${chapter}&id=${columnId}&invitationCode=${token}`;

  const { png, pngUrl, isScreenshot, handleScreenshotClick } = useScreenshot();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#999999]">
      {isScreenshot && (
        <div className={"z-100 absolute flex h-screen w-full items-center justify-center"}>
          <Loading />
        </div>
      )}
      {pngUrl !== "" ? (
        <div className={"w-88 h-140 relative"}>
          <Image src={pngUrl} alt={"poster"} fill quality={100} />
        </div>
      ) : (
        <div ref={png} className="h-129.5005 mx-4 w-full bg-[#ffffff]">
          <AuthorInfo user={user!}>
            <div className="ml-2.25 flex items-center">
              <div className="font-D-DIN text-3.5 font-700 lh-6 text-[#252525]">
                {likeCount}
              </div>
              <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                点赞
              </div>
              <div className="font-D-DIN text-3.5 font-700 lh-6 ml-1 text-[#252525]">
                {readCount}
              </div>
              <div className="text-3 font-400 lh-6 ml-1.25 mt-0.5 w-10 text-[#999]">
                浏览
              </div>
            </div>
          </AuthorInfo>
          <ArticleContent title={postData?.name!} content={postContent} />
          <FooterInfo
            userInfo={user!}
            token={token}
            qrcodeURL={qrcodeURL}
            onScreenshot={handleScreenshotClick}
          />
        </div>
      )}
    </div>
  );
};
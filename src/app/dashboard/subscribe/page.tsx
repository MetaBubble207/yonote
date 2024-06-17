"use client";
import Navbar from "../../_components/common/Navbar";
import Image from "next/image";
import Link from "next/link";
import Page from "../../_components/subscribe/Navscribr";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsFetching } from "@tanstack/react-query";
import Loading from "../../_components/common/Loading";

const Subscribe = () => {
  const router = useRouter();
  const [token] = useLocalStorage("token", null);
  // const recentRead = api.read.getRecentRead.useQuery({
  //     userId: token,
  // }).data;
  const { data: recentRead, isFetching } = api.read.getRecentRead.useQuery({
    userId: token,
  });
  // const recentColumn = api.post.getColumnbyPost.useQuery({
  //     postId: recentRead?.id,
  // })
  const link = () => {
    router.push(
      `/special-column-content?c=${recentRead?.chapter}&id=${recentRead?.columnId}`
    );
  };

  // const {data:recentColumn, isFetching} = api.column.getColumnDetail.useQuery({
  //     columnId: recentRead?.columnId,
  // })
  const recentColumn = api.column.getColumnDetail.useQuery({
    columnId: recentRead?.columnId,
  }).data;

  const [readContent, setReadContent] = useState(recentRead?.content);

  function extractText(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  useEffect(() => {
    if (recentRead && recentRead.content.length > 15) {
      console.log(recentRead.content);
      // setReadContent(recentRead.content.substring(0, 20) + "...");
      const text = extractText(recentRead.content);
      setReadContent(text.substring(0, 15) + "...");
    } else {
      const text = extractText(recentRead?.content);
      setReadContent(text);
      // console.log("---->"+recentRead.content);
    }
  }, [recentRead]);

  return (
    <div className="min-h-screen relative pt-8 pb-15 bg-#F5F7FB">
      <div className="w-85.75 m-auto mb-2">
        <div className="border-rd-13 h-8.5 bg-[#FFF] flex items-center">
          <Image
            src={"/images/subscribe/search.png"}
            alt="search"
            width={18}
            height={18}
            className="inline  ml-5.25 w-4.5 h-4.5"
          ></Image>
          <input
            type="search"
            name=""
            id=""
            placeholder="仅支持搜索专栏和作者"
            className="text-3.25 text-[#999] lh-8.5 ml-1.6 justify-center outline-none w-full h-8.5 pl-1.6 border-rd-13 "
          ></input>
        </div>
        {isFetching ? (
          <div className="h-20.5 w-full mt-8 items-center flex justify-center">
            <Loading></Loading>
          </div>
        ) : (
          <div className="h-20.5 w-full mt-8 border-rd-2.5 bg-[#FFF] flex items-center relative">
            <Image
              style={{ objectFit: "cover" }}
              //   fill
              objectFit="cover"
              unoptimized
              src={recentColumn?.logo}
              alt="cover"
              width={18.2}
              height={24.8}
              placeholder="empty"
              className="w-11.375 h-15.5 ml-4  object-cover rounded-2"
            ></Image>
            <div className="pl-2 relative h-23 pt-3">
              {recentRead && (
                <>
                  <div className="text-3 text-[#252525] font-500 pb-1.5 lh-6">
                    {recentRead.name}
                  </div>
                  <div
                    className="text-2.5 text-[#666] lh-3 pl-1"
                    dangerouslySetInnerHTML={{ __html: readContent }}
                  ></div>
                </>
              )}
            </div>
            <div
              onClick={link}
              className="w-18.25 h-7.75 text-3 bg-[#daf9f1] text-[#1db48d] lh-7.75 text-center border-rd-12 absolute right-2.5 bottom-2.5"
            >
              继续阅读
            </div>
          </div>
        )}

        <div>
          <Page />
        </div>
      </div>

      <div className="bottom-4 justify-center w-full fixed">
        <Navbar />
      </div>
      {/*<div className="h-14"></div>*/}
    </div>
  );
};
export default Subscribe;

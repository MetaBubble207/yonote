"use client";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useLocalStorage from "@/tools/useStore";
import { timeToDateString } from "@/tools/timeToString";

const Page = () => {
  // function formatTime(date: Date) {
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const monthStr = month < 10 ? "0" + month : month;
  //   const dayStr = day < 10 ? "0" + day : day;
  //   const hoursStr = hours < 10 ? "0" + hours : hours;
  //   const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  //   return `${monthStr}.${dayStr} ${hoursStr}:${minutesStr}`;
  // }

  // function generateDivElements(arr: Array<string>) {
  //   // 使用 map 方法遍历数组，并为每个数组元素创建一个 <div> 元素
  //   const divElements = arr.map((_, index) => (
  //     <div
  //       key={index}
  //       className={"text-[#1DB48D] text-3 font-not-italic font-400 lh-6"}
  //     >
  //       # {arr[index]}
  //     </div>
  //   ));
  //
  //   return divElements;
  // }

  const params = useSearchParams()
  const chapter = parseInt(params.get("c"));
  const columnId = params.get("id");
  // 点赞
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleClick = () => {
    setIsHeartFilled(!isHeartFilled);
    if (isHeartFilled) {
      setLikecount(likecount - 1);
    } else {
      setLikecount(likecount + 1);
    }
  };

  const [token] = useLocalStorage("token", null);

  const postData = api.post.getById.useQuery({
    id: columnId,
    chapter: chapter
  }).data;
  const prepost = api.post.getById.useQuery({
    id: columnId,
    chapter: chapter-1
  }).data;
  const nextpost = api.post.getById.useQuery({
    id: columnId,
    chapter: chapter+1
  }).data;
  const numData = api.post.getNumById.useQuery({
    id: columnId,
  }).data;
  
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [likecount, setLikecount] = useState(0);
  const [pretitle, setPretitle] = useState(null);
  const [nexttitle, setNexttitle] = useState(null);

  const update = api.post.create.useMutation({
    onSuccess: (r) => {
      console.log('123' + r)
    },
    onError: (e) => {

    }
  })
  // update.mutate({
  //   name:name,
  //   id: 16,
  // })



 
  useEffect(() => {
    if (postData) {
      if (postData.name) {
        const pubTime = postData.createdAt;
        setName(postData.name);
        setDate(timeToDateString(pubTime));
      } else {
        setDate("");
        setName("");
      }

      if (postData.tag) {
        setTags(postData.tag.split(","));
      } else {
        setTags([]);
      }

      if (postData.content) {
        setContent(postData.content);
      } else {
        setContent("");
      }

      if (postData.likeCount) {
        setLikecount(postData.likeCount);
      } else {
        setLikecount(0);
      }
      
      if (chapter > 1 && prepost) {
        setPretitle(prepost.name);
      }else {
        setPretitle("已经是第一篇了");
      }
      if (chapter <= numData && nextpost) {
        setNexttitle(nextpost.name);    
      }else {
        setNexttitle("已经是末篇了");
      }
      
    }
    
  }, [postData]);

  return (
    <div className={"relative bg-#F5F7FB min-h-screen pb-10"}>
      <div className={"ml-16px"}>
        {/*上方分享*/}
        <div className={"flex justify-end items-center pt-16px"}>
          <div
            className={
              "inline-block w-14.25 h-6 text-[#252525] shrink-0 bg-#5CE5C1 text-2.5 font-500 lh-6 text-center rounded-10px"
            }
          >
            加速计划
          </div>
          <div className={"inline-block ml-10px mr-16px"}>
            <Image
              src={"/images/special-column/Share-black.png"}
              alt={"心智与阅读"}
              width={12}
              height={12}
            />
          </div>
        </div>

        {/*头像，昵称，时间*/}
        <div>{name}</div>
        <div className="flex mt-10px items-center space-y-0 mb-22px">
          {/*左边头像*/}
          <div>
            <div>
              <Image
                src={postData?.user.avatar}
                alt={"avatar"}
                width={33}
                height={33}
                className={"rounded-full"}
              />
            </div>
          </div>
          {/*昵称，日期，VIP*/}
          <div>
            <div className={"flex items-center"}>
              <div
                className={
                  "text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"
                }
              >
                {postData?.user.name}
              </div>
              <div>
                <Image
                  src={"/images/special-column/Group 225.png"}
                  alt={"心智与阅读"}
                  width={12}
                  height={12}
                  className={"lh-0"}
                  style={{ marginLeft: "2.5px" }}
                />
              </div>
            </div>
            <div
              className={
                "text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"
              }
            >
              {date}发布
            </div>
          </div>
        </div>

        {/*内容*/}
        <div>
          <Image
            src={"/images/special-column/Rectangle 442.png"}
            alt={"心智与阅读"}
            width={343}
            height={161}
            className="w-85.75 h-40.25"
          />
        </div>
        <div
          className={
            "w-85.75 mt-24px shrink-0 text-[#666] text-3.5 font-not-italic font-400 lh-[120%] h-auto"
          }
        >
          <div
            className="break-all"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
        <div className="flex flex-row justify-between pt-2 relative h-7">
          {tags.map((item, index) => {
            return (
              <span
                className={
                  "text-[#1DB48D] text-3 font-not-italic font-400 lh-6"
                }
                key={index}
              >
                #{item}
              </span>
            );
          })}
          <div className="flex absolute right-2" onClick={handleClick}>
            <Image
              src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 1.png"}
              alt={"爱心"}
              width={18}
              height={18}
              objectFit="none"
              className="w-5 h-5"
            />
            <div
              className={
                "text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-2.5 mr-4"
              }
            >
              {likecount}
            </div>
          </div>
        </div>
      </div>

      {/*页面底端上一篇下一篇*/}
      <div className="bg-#F5F7FB flex pb-8.25">
        <div className={"w-86.5 h-28.75 bg-[#FFF] rounded-2 mx-auto mt-2"}>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="ml-24px flex items-center space-y-0"></div>
            </div>
          </div>

          <div className={"mx-16px"}>
            {/*目录*/}
            <Link href={"/special-column"}>
              <div className={"flex items-center mt-2"}>
                <div
                  className={
                    "text-[#666] text-2.5 font-not-italic font-400 lh-14px"
                  }
                >
                  心智与阅读•目录
                </div>
                <div className={"ml-5px"}>
                  <Image
                    src={"/images/special-column/Sort-one (排序1).png"}
                    alt={"心智与阅读"}
                    width={14}
                    height={14}
                  />
                </div>
              </div>
            </Link>

            {/*上一篇下一篇*/}
            <div className="flex mt-8px">
              {/* 上一篇 */}
              {chapter === 1 ? (
                <div className={"flex flex-col"}>
                  <div className={"flex items-center"}>
                    <Image
                      src={"/images/special-column/Double-left (双左).png"}
                      alt={"心智与阅读"}
                      width={14}
                      height={14}
                    />
                    <div
                      className={
                        "text-[#333] text-3 font-not-italic font-400 lh-6 ml-5px"
                      }
                    >
                      上一篇
                    </div>
                  </div>
                  <div
                    className={
                      "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6"
                    }
                  >
                    已经是第一篇了
                  </div>
                </div>
              )
                : (
                  <Link className="flex flex-col" href={`../special-column-content?c=${chapter - 1}&id=${columnId}`}>
                    <div className={"flex items-center"}>
                      <div>
                        <Image
                          src={"/images/special-column/Double-left (双左).png"}
                          alt={"心智与阅读"}
                          width={14}
                          height={14}
                        />
                      </div>
                      <div
                        className={
                          "text-[#333] text-3 font-not-italic font-400 lh-6 ml-5px"
                        }
                      >
                        上一篇
                      </div>
                    </div>
                    <div
                      className={
                        "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6"
                      }
                    >
                      {pretitle}
                    </div>
                  </Link>
                )}
              {numData <= chapter ? (
                <div className="flex flex-col ml-auto">
                <div className={"flex items-center justify-end"}>
                  <div
                    className={
                      "text-[#333] text-3 font-not-italic font-400 lh-6 "
                    }
                  >
                    下一篇
                  </div>
                  <div>
                    <Image
                      src={"/images/special-column/Double-left (双右) .png"}
                      alt={"心智与阅读"}
                      width={14}
                      height={14}
                    />
                  </div>
                </div>
                <div
                  className={
                    "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6 text-right"
                  }
                >
                  已经是末篇了
                </div>
              </div>
              ):
              (
                <Link className="flex flex-col ml-auto " href={`../special-column-content?c=${chapter + 1}&id=${columnId}`}>
                <div className={"flex items-center justify-end"}>
                  <div
                    className={
                      "text-[#333] text-3 font-not-italic font-400 lh-6 "
                    }
                  >
                    下一篇
                  </div>
                  <div>
                    <Image
                      src={"/images/special-column/Double-left (双右) .png"}
                      alt={"心智与阅读"}
                      width={14}
                      height={14}
                    />
                  </div>
                </div>
                <div
                  className={
                    "w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6 text-right"
                  }
                >
                  {nexttitle}
                </div>
              </Link>
              )
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;

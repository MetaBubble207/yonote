"use client";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { any, string } from "zod";

const Page = () => {
  function formatTime(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const monthStr = month < 10 ? "0" + month : month;
    const dayStr = day < 10 ? "0" + day : day;
    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${monthStr}.${dayStr} ${hoursStr}:${minutesStr}`;
  }
  function generateDivElements(arr: Array<string>) {
    // 使用 map 方法遍历数组，并为每个数组元素创建一个 <div> 元素
    const divElements = arr.map((_, index) => (
      <div
        key={index}
        className={"text-[#1DB48D] text-3 font-not-italic font-400 lh-6"}
      >
        # {arr[index]}
      </div>
    ));

    return divElements;
  }

  const postData = api.post.getAll.useQuery({
    id: 17,
  });

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [likecount, setLikecount] = useState(0);

  useEffect(() => {
    if (postData.data && postData.data[0] && postData.data[0].name) {
      const postdata = postData.data[0].createdAt;
      setName(postData.data[0].name);
      setDate(formatTime(postdata));
    } else {
      setDate("");
      setName("");
    }

    if (postData.data && postData.data[0] && postData.data[0].tag) {
      setTags(postData.data[0].tag.split(","));
    } else {
      setTags([]); // 这里也应该设置为空数组，而不是单独的一个空字符串
    }

    if (postData.data && postData.data[0] && postData.data[0].content) {
      setContent(postData.data[0].content);
    } else {
      setContent("");
    }

    if (postData.data && postData.data[0] && postData.data[0].likeCount) {
      setLikecount(postData.data[0].likeCount);
    } else {
      setLikecount(0);
    }
  }, [postData.data]);

  return (
    <div className={"relative bg-#F5F7FB h-screen"}>
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
          <div className={""}>
            <div>
              <Image
                src={"/images/special-column/Ellipse 2.png"}
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
                  "text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"
                }
              >
                芋圆
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
        <div className="flex flex-row justify-between pt-2">
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
          <div className="flex">
            <Image
              src={"/images/special-column/heart 1.png"}
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
              <div className="flex flex-col">
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
                  回忆·后来的我们毕业了
                </div>
              </div>
              <div className="flex flex-col ml-auto ">
                <div className={"flex items-center justify-end"}>
                  <div
                    className={
                      "text-[#333] text-3 font-not-italic font-400 lh-6 "
                    }
                  >
                    上一篇
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
                  回忆·后来的我们毕业了
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

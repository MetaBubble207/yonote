"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SpecialColumnContentBottom = () => {
  // 路由
  const router = useRouter();
  // 点赞
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };
  return (
    <div>
      <div className={"w-86.5 h-140px bottom-0px absolute"}>
        {/*标签*/}
        <div className="mx-16px flex justify-between">
          <div className="flex flex-col">
            <div
              className={"text-3 font-not-italic font-400 lh-6 text-[#1DB48D]"}
            >
              # 标签在这
            </div>
          </div>
          <div className="flex flex-col">
            <div className="ml-24px flex items-center space-y-0">
              <div>
                <Image
                  src={
                    isHeartFilled
                      ? "/images/special-column/heart red.png"
                      : "/images/special-column/heart 2.png"
                  }
                  onClick={handleClick}
                  alt={"爱心"}
                  width={18}
                  height={18}
                  objectFit="none"
                />
              </div>
              <div
                className={
                  "text-2.75 font-not-italic font-500 lh-6 ml-4px text-[#B5B5B5]"
                }
              >
                1090
              </div>
            </div>
          </div>
        </div>

        <div className={"mt-1.5 rounded bg-[#FFF] px-4 pt-2.5"}>
          {/*目录*/}
          <Link href="/dashboard/special-column">
            <div className={"flex items-center"}>
              <div
                className={
                  "text-2.5 font-not-italic font-400 lh-14px text-[#666]"
                }
              >
                心智与阅读•目录
              </div>
              <div className={"ml-5px"}>
                <Image
                  src={"/images/special-column/Sort-one.png"}
                  alt={"心智与阅读"}
                  width={14}
                  height={14}
                />
              </div>
            </div>
          </Link>
          {/*上一篇下一篇*/}
          <div className="mt-8px flex">
            <div
              className="flex flex-col"
              onClick={() => router.push("/dashboard/special-column/answer")}
            >
              <div className={"flex items-center"}>
                <div>
                  <Image
                    src={"/images/special-column/Double-Left.png"}
                    alt={"心智与阅读"}
                    width={14}
                    height={14}
                  />
                </div>
                <div
                  className={
                    "text-3 font-not-italic font-400 lh-6 ml-5px text-[#333]"
                  }
                >
                  上一篇
                </div>
              </div>
              <div
                className={
                  "w-27.6665 text-3 font-not-italic font-400 lh-6 text-[#333]"
                }
              >
                回忆·后来的我们毕业了
              </div>
            </div>
            <div
              className="ml-auto flex flex-col"
              onClick={() => router.push("/dashboard/special-column/answer")}
            >
              <div className={"flex items-center justify-end"}>
                <div
                  className={"text-3 font-not-italic font-400 lh-6 text-[#333]"}
                >
                  下一篇
                </div>
                <div>
                  <Image
                    src={"/images/special-column/Double-Right.png"}
                    alt={"心智与阅读"}
                    width={14}
                    height={14}
                  />
                </div>
              </div>
              <div
                className={
                  "w-27.6665 text-3 font-not-italic font-400 lh-6 text-right text-[#333]"
                }
              >
                回忆·后来的我们毕业了
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialColumnContentBottom;

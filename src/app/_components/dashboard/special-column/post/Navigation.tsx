"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { type Post } from "@/server/db/schema";

interface NavigationProps {
  chapter: number;
  columnId: string;
  columnName?: string;
  prepost?: Post;
  nextpost?: Post;
  numData?: number;
  status?: boolean;
  userId?: string;
  token?: string;
}

// 通用的导航按钮组件
const NavigationButton = ({ 
  direction, 
  title, 
  onClick, 
  disabled 
}: { 
  direction: 'left' | 'right';
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <div 
    className={`flex flex-col ${!disabled && 'cursor-pointer'} ${direction === 'right' ? 'ml-auto' : ''}`}
    onClick={!disabled ? onClick : undefined}
  >
    <div className={`flex items-center ${direction === 'right' ? 'justify-end' : ''}`}>
      {direction === 'left' && (
        <Image
          src="/images/special-column/Double-Left.png"
          alt="上一篇"
          width={14}
          height={14}
        />
      )}
      <div className="text-3 font-not-italic font-400 lh-6 ml-5px text-[#333]">
        {direction === 'left' ? '上一篇' : '下一篇'}
      </div>
      {direction === 'right' && (
        <Image
          src="/images/special-column/Double-Right.png"
          alt="下一篇"
          width={14}
          height={14}
        />
      )}
    </div>
    <div className={`w-27.6665 text-3 font-not-italic font-400 lh-6 ${direction === 'right' ? 'text-right' : ''} text-[#333]`}>
      {title}
    </div>
  </div>
);

export function Navigation({
  chapter,
  columnId,
  columnName,
  prepost,
  nextpost,
  numData = 0,
  status,
  userId,
  token,
}: NavigationProps) {
  const router = useRouter();
  const alertMessage = () => alert("请先购买专栏");

  const canAccessPost = (post?: Post) => 
    post?.isFree || status || userId === token;

  const navigation = {
    toDirectory: () => router.push(`/dashboard/special-column?c=1&id=${columnId}`),
    toPrevious: () => router.push(`/dashboard/special-column/content?c=${chapter - 1}&id=${columnId}`),
    toNext: () => router.push(`/dashboard/special-column/content?c=${chapter + 1}&id=${columnId}`),
  };

  return (
    <div className="bg-#F5F7FB flex">
      <div className="w-86.5 h-28.75 rounded-2 mx-auto mt-2 bg-[#FFF]">
        <div className="mx-16px">
          {/* 目录 */}
          <div onClick={navigation.toDirectory} className="cursor-pointer">
            <div className="mt-2 flex items-center">
              <div className="text-2.5 font-not-italic font-400 lh-14px text-[#666]">
                {columnName && `${columnName.slice(0, 20)}${columnName.length > 20 ? '…' : ''}`}
                •目录
              </div>
              <Image
                src="/images/special-column/Sort-one.png"
                alt="目录"
                width={14}
                height={14}
                className="ml-5px"
              />
            </div>
          </div>

          {/* 上一篇下一篇导航 */}
          <div className="mt-8px flex justify-between">
            <NavigationButton
              direction="left"
              title={chapter === 1 ? "已经是第一篇了" : (prepost?.name || '')}
              onClick={canAccessPost(prepost) ? navigation.toPrevious : alertMessage}
              disabled={chapter === 1}
            />

            <NavigationButton
              direction="right"
              title={numData <= chapter ? "已经是末篇了" : (nextpost?.name || '')}
              onClick={canAccessPost(nextpost) ? navigation.toNext : alertMessage}
              disabled={numData <= chapter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
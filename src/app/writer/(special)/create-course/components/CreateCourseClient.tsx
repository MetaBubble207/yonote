"use client";
import React, { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";

export const CreateCourseClient = ({ columnId }: { columnId: string | null }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();
  const [selectedButton, setSelectButton] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [token] = useLocalStorage('token', null);
  const handleClick = () => {
    setSelectButton(selectedButton === 1 ? 2 : 1);
  };

  const handleButtonClick = () => {
    handleClick();
    router.push("/writer/create-course/payment");
  };
  const createApi = api.invitationCode.create.useMutation({
    onSuccess: (data) => {
      if (!data) {
        messageApi.info("该邀请码不存在或者已经被使用了噢😯~");
        return;
      }
      router.push(`/writer/homepage?columnId=${columnId}`);
    },
    onError: () => {
      messageApi.info("该邀请码不存在或者已经被使用了噢😯~");
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      messageApi.info("请输入专栏名称");
      return;
    }
    if (!columnId) {
      messageApi.info("专栏ID不存在，您可能没有被邀请，请联系管理员😯～");
      return;
    }
    createApi.mutate({
      id: columnId,
      name: name.trim(),
      userId: token,
    });
  };

  return (
    <div className="flex h-90vh w-full items-center justify-center bg-white">
      <div className="w-[500px]">
        {contextHolder}
        <div className="mb-8 text-4 font-700 text-[#323232]">
          小课创建
        </div>

        <div className="space-y-6">
          {/* 名称输入 */}
          <div className="flex items-center">
            <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
              名称：
            </label>
            <div className="ml-4 h-8 w-117 rounded border-2 border-solid">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="起个名字"
                className="h-full w-full px-3 outline-none text-3.5"
                maxLength={15}
              />
            </div>
          </div>

          {/* 小课ID */}
          <div className="flex items-center">
            <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
              小课ID（英文或数字）：
            </label>
            <div className="ml-4 h-8 w-117 rounded border-2 border-solid">
              <input
                type="text"
                value={columnId ?? ""}
                disabled
                placeholder="请输入你的专属ID"
                className="h-full w-full px-3 outline-none text-3.5"
              />
            </div>
          </div>

          {/* 内容形式 */}
          <div className="flex items-center">
            <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
              内容形式：
            </label>
            <div className="ml-4 flex items-center">
              <Image
                src="/images/writer/co-author/check.svg"
                alt="check"
                width={20}
                height={20}
                className="h-4 w-4"
              />
              <span className="ml-2 text-3.5 text-[rgba(0,0,0,0.65)]">
                小课
              </span>
            </div>
          </div>

          {/* 付费模式 */}
          <div className="flex items-center">
            <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
              付费模式：
            </label>
            <div className="ml-4 flex items-center">
              <button className="flex items-center" onClick={handleClick}>
                <Image
                  src={`/images/writer/co-author/${selectedButton === 1 ? 'check' : 'uncheck'}.svg`}
                  alt={selectedButton === 1 ? 'check' : 'uncheck'}
                  width={20}
                  height={20}
                  className="h-4 w-4"
                />
                <span className="ml-2 text-3.5 text-[rgba(0,0,0,0.65)] shrink-0">
                  永久买断
                </span>
              </button>
              <button className="ml-8 flex items-center" onClick={handleButtonClick}>
                <Image
                  src={`/images/writer/co-author/${selectedButton === 2 ? 'check' : 'uncheck'}.svg`}
                  alt={selectedButton === 2 ? 'check' : 'uncheck'}
                  width={20}
                  height={20}
                  className="h-4 w-4"
                />
                <span className="ml-2 text-3.5 text-[rgba(0,0,0,0.65)] shrink-0">
                  限时订阅
                </span>
              </button>
              <span className="ml-12 text-red-500">*</span>
              <span className="ml-2 text-3 text-[rgba(51,51,51,0.60)] shrink-0">
                提交后不可修改
              </span>
            </div>
          </div>

          {/* 价格输入 */}
          {/* <div className="flex items-center">
            <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
              价格（最低50元）：
            </label>
            <div className="ml-4 flex items-center">
              <div className="h-8 w-22 rounded border-2 border-solid">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="请输入"
                  className="h-full w-full px-3 outline-none text-3.5"
                />
              </div>
              <span className="ml-2 text-3.5 text-[rgba(0,0,0,0.65)]">元</span>
            </div>
          </div> */}
        </div>

        {/* 提交按钮 */}
        <div className="mt-12 ml-22">
          <button onClick={handleSubmit}>
            <Image
              src="/images/writer/co-author/submit.svg"
              alt="submit"
              width={65}
              height={32}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

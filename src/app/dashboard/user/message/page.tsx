"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { Button } from "antd";
import Loading from "@/app/_components/common/Loading";
import OSS from "ali-oss";
import withTheme from "@/theme";

let client = new OSS({
  region: "oss-cn-shenzhen",
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
  stsToken: process.env.NEXT_PUBLIC_STS_TOKEN,
  bucket: process.env.NEXT_PUBLIC_BUCKET,
});
const UserMessage = function () {
  const [token] = useLocalStorage("token", null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const { data: userInfo, isLoading } = api.users.getOne.useQuery({
    id: token,
  });
  const [phone, setPhone] = useState(userInfo?.phone);
  const [name, setName] = useState(userInfo?.name);
  const fileInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const updateAvatarApi = api.users.updateAvatar.useMutation();
  const updatePhoneApi = api.users.updatePhone.useMutation();
  const updateNameApi = api.users.updateName.useMutation();

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const result = await client.put(file.name, file);
          updateAvatarApi.mutate({ id: token, avatar: result.url });
          userInfo.avatar = result.url;
        } catch (err) {
          console.error("Upload error:", err);
        }
      }
    },
    [updateAvatarApi, userInfo, token],
  );

  const handlePhoneBlur = useCallback(
    (event) => {
      const confirmed = window.confirm("是否保存修改的手机号码？");
      if (confirmed && validatePhoneNumber(phone)) {
        updatePhoneApi.mutate({ id: token, phone });
        userInfo.phone = phone;
      }
      setIsEditingPhone(false);
    },
    [phone, updatePhoneApi, userInfo, token],
  );

  const validatePhoneNumber = (phone) => /^\d{1,11}$/.test(phone);

  const handleNameBlur = useCallback(
    (event) => {
      const confirmed = window.confirm("是否保存修改的姓名？");
      if (confirmed) {
        updateNameApi.mutate({ id: token, name });
        userInfo.name = name;
      }
      setIsEditingName(false);
    },
    [name, updateNameApi, userInfo, token],
  );

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (isEditingPhone && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingPhone, isEditingName]);

  if (isLoading) return <Loading />;

  return (
    <div>
      <Image
        src={userInfo?.avatar || "/image/user/Loading.svg"}
        alt="头像"
        width={64}
        height={64}
        className={"mx-auto mt-5 rounded-full"}
      />
      <div className={"w-22 mx-auto mt-2 flex h-5"}>
        <Button
          type={"primary"}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            borderRadius: "9999px",
          }}
        >
          <Image
            src={"/images/user/Edit.svg"}
            alt={"头像"}
            width={14}
            height={14}
          />
          <div
            className="ml-1.25 text-#252525 text-2.5 font-500 lh-6 w-10"
            onClick={handleButtonClick}
          >
            修改头像
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Button>
      </div>

      <div
        className={"text-3.5 font-500 lh-6 mx-4 mt-7 space-y-6 text-[#252525]"}
      >
        {/* 用户名和用户ID展示 */}
        <div className="flex items-center">
          <p>用户名</p>
          <div className="pl-13 flex flex-1 items-center">
            {isEditingName ? (
              <input
                type="text"
                className="text-3.5 font-400 pl-[15px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                ref={nameInputRef}
              />
            ) : (
              <>
                <span>{userInfo.name}</span>
                <Button
                  type="text"
                  className="text-2.5 font-500 relative flex-1 text-right text-[#252525]"
                  onClick={() => setIsEditingName(true)}
                >
                  <Image
                    className={"absolute bottom-2 right-0"}
                    src={"/images/user/RightArrow.svg"}
                    alt={"RightArrow"}
                    width={12}
                    height={12}
                  />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <p>用户ID</p>
          <span className="pl-13">{userInfo.idNumber}</span>
        </div>
        {/* 手机号展示和修改 */}
        <div className="flex w-full items-center">
          <p>手机号</p>
          <div className="pl-13 flex flex-1 items-center">
            {isEditingPhone ? (
              <input
                type="text"
                className="text-3.5 font-400 pl-[15px]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={handlePhoneBlur}
                ref={phoneInputRef}
              />
            ) : (
              <>
                <span>{userInfo.phone}</span>
                <Button
                  type="text"
                  className="text-2.5 font-500 relative flex-1 text-[#252525]"
                  onClick={() => setIsEditingPhone(true)}
                >
                  <Image
                    className={"absolute bottom-2 right-0"}
                    src={"/images/user/RightArrow.svg"}
                    alt={"RightArrow"}
                    width={12}
                    height={12}
                  />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return withTheme(<UserMessage />);
};
export default Page;

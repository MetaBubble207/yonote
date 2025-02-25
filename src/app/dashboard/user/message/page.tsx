"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { message } from "antd";
import Loading from "@/app/_components/common/Loading";
import { ossClient } from "@/app/_utils/oss";
import { AvatarUpload } from "@/app/_components/dashboard/user/AvatarUpload";
import { EditableField } from "@/app/_components/dashboard/user/EditableField";


export default function Page() {
  const [token] = useLocalStorage("token", null);
  const { data: userInfo, isLoading, refetch } = api.users.getOne.useQuery(token);

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const updateAvatarApi = api.users.updateAvatar.useMutation();
  const updatePhoneApi = api.users.updatePhone.useMutation();
  const updateNameApi = api.users.updateName.useMutation();

  const [messageApi, contextHolder] = message.useMessage();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await ossClient.put(file.name, file);
      await updateAvatarApi.mutateAsync({ id: token, avatar: result.url });
      messageApi.success('头像更新成功');
      void refetch(); // 更新用户信息
    } catch (err) {
      console.error("Upload error:", err);
      messageApi.error('头像更新失败');
    }
  }, [token, updateAvatarApi, refetch]);

  // 使用 useEffect 来更新状态
  useEffect(() => {
    if (userInfo) {
      setPhone(userInfo.phone ?? '');
      setName(userInfo.name ?? '');
    }
  }, [userInfo]);

  const validatePhoneNumber = (phone: string) => {
    // 检查是否是11位数字且以1开头
    return /^1\d{10}$/.test(phone);
  };

  const handlePhoneBlur = useCallback(() => {
    if (!phone) {
      messageApi.error('手机号不能为空');
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      messageApi.error('请输入正确的手机号（11位数字且以1开头）');
      phoneInputRef.current?.focus(); // 保持输入框焦点
      return false;
    }

    updatePhoneApi.mutate(
      { id: token, phone },
      {
        onSuccess: () => {
          messageApi.success('手机号更新成功');
          setIsEditingPhone(false); // 只有验证通过才关闭编辑状态
        },
        onError: () => messageApi.error('手机号更新失败'),
      }
    );
  }, [phone, token, updatePhoneApi]);

  const handleNameBlur = useCallback(() => {
    if (!name) {
      messageApi.error('用户名不能为空');
      nameInputRef.current?.focus();
      return false;
    }

    if (name.length < 2 || name.length > 20) {
      messageApi.error('用户名长度需要在2-20个字符之间');
      nameInputRef.current?.focus();
      return false;
    }

    updateNameApi.mutate(
      { id: token, name },
      {
        onSuccess: () => {
          messageApi.success('用户名更新成功');
          setIsEditingName(false);
        },
        onError: () => messageApi.error('用户名更新失败'),
      }
    );
  }, [name, token, updateNameApi, messageApi]);

  useEffect(() => {
    if (isEditingPhone) phoneInputRef.current?.focus();
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingPhone, isEditingName]);

  if (isLoading) return <Loading />;
  if (!userInfo) return null;

  return (
    <div>
      <AvatarUpload
        avatar={userInfo.avatar ?? ''}
        onFileChange={handleFileChange}
      />
      {contextHolder}
      <div className="text-3.5 font-500 lh-6 mx-4 mt-7 space-y-6 text-[#252525]">
        <EditableField
          label="用户名"
          value={name ?? ''}
          isEditing={isEditingName}
          onEdit={() => setIsEditingName(true)}
          onBlur={handleNameBlur}
          onChange={setName}
          inputRef={nameInputRef}
        />
        <EditableField
          label="用户ID"
          value={userInfo.idNumber ?? ''}
          isEditing={false}
          onEdit={() => {}}
          onBlur={() => {}}
          onChange={() => {}}
          inputRef={idInputRef}
          readOnly
        />
        <EditableField
          label="手机号"
          value={phone ?? ''}
          isEditing={isEditingPhone}
          onEdit={() => setIsEditingPhone(true)}
          onBlur={handlePhoneBlur}
          onChange={setPhone}
          inputRef={phoneInputRef}
        />
      </div>
    </div>
  );
};

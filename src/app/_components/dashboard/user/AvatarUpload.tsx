import React, { useRef } from 'react';
import Image from "next/image";

interface AvatarUploadProps {
  avatar: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUpload = ({ avatar, onFileChange }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Image
        src={avatar || "/image/user/Loading.svg"}
        alt="头像"
        width={64}
        height={64}
        className="mx-auto mt-5 rounded-full"
        priority
      />
      <div className="w-22 mx-auto mt-2 flex h-5">
        <button
          className="w-full h-full flex items-center justify-center rounded-full bg-#45E1B8"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            src="/images/user/Edit.svg"
            alt="编辑头像"
            width={14}
            height={14}
          />
          <span className="ml-1.25 text-#252525 text-2.5 font-500">
            修改头像
          </span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
            accept="image/*"
          />
        </button>
      </div>
    </>
  );
};
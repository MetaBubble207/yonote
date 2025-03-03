"use client";

import React, { useRef, useState, useEffect } from "react";
import { message } from "antd";
import Image from "next/image";
import { api } from "@/trpc/react";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { ossClient } from "@/app/_utils/oss";

interface ColumnCoverProps {
    columnId: string;
    initialCover?: string | null;
}

const ColumnCover: React.FC<ColumnCoverProps> = ({ columnId, initialCover }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cover, setCover] = useState<string | null | undefined>(initialCover);
    const [messageApi, contextHolder] = message.useMessage();

    const updateCoverApi = api.column.updateCover.useMutation({
        onSuccess: () => {
            messageApi.success("封面更新成功");
        },
        onError: (error) => {
            messageApi.error(`更新失败: ${error.message}`);
        }
    });

    useEffect(() => {
        setCover(initialCover);
    }, [initialCover]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            messageApi.loading("正在上传封面...");
            const result = await ossClient.put(file.name, file);
            updateCoverApi.mutate({ id: columnId, cover: result.url });
            setCover(result.url);
        } catch (err) {
            console.error("Upload error:", err);
            messageApi.error("封面上传失败");
        }
    };

    const changeCover = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mt-50 ml-10 flex items-center">
            {contextHolder}
            <div>
                <span className="text-3.5 font-not-italic font-400 lh-5.5">
                    封面：
                </span>
            </div>
            <div>
                <div>
                    <div className="w-29 h-37.5 relative">
                        <Image
                            placeholder="blur"
                            blurDataURL={LoadingImage()}
                            src={cover ?? NotImage()}
                            alt="cover"
                            quality={100}
                            fill
                            loading="lazy"
                            className="object-cover"
                        />
                    </div>
                    <div className="w-19.5 border-rd-4 mx-auto mt-5 flex h-6 shrink-0 items-center bg-[#45E1B8] pl-2.5">
                        <Image
                            className="w-3.477 h-3.477"
                            src="/images/user/Edit.svg"
                            alt="编辑"
                            width={10}
                            height={10}
                        />
                        <button
                            className="ml-1.25 text-2.5 font-500 lh-6 w-10 text-[#252525]"
                            onClick={changeCover}
                        >
                            修改封面
                        </button>
                        <input
                            aria-label="上传专栏封面"
                            title="上传专栏封面"
                            placeholder="选择封面图片"
                            className="hidden"
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColumnCover;
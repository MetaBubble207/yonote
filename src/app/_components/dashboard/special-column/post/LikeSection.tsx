"use client";

import { api } from "@/trpc/react";
import { useEffect } from "react";
import Image from "next/image";
import useLocalStorage from "@/app/_hooks/useLocalStorage";

interface LikeSectionProps {
    postId: number;
    tags: string[];
}

interface LikeState {
    isLike: boolean;
    likeCount: number;
}
export function LikeSection({ postId, tags }: LikeSectionProps) {
    const utils = api.useUtils();

    const [token] = useLocalStorage("token", null);

    // 获取点赞状态
    const { data: likeState, refetch: refetchLikeState } = api.like.getLikeState.useQuery(
        { postId, userId: token },
        {
            initialData: { isLike: false, likeCount: 0 } as LikeState
        }
    );

    // 添加阅读记录
    const addReadCount = api.read.create.useMutation();
    useEffect(() => {
        if (!token) return;
        addReadCount.mutate({ postId, userId: token });
    }, [postId, token]);

    // 处理点赞
    const like = api.like.like.useMutation({
        onMutate: () => {
            // 乐观更新
            const previousData = likeState;
            const newData = {
                isLike: !previousData.isLike,
                likeCount: previousData.likeCount + (previousData.isLike ? -1 : 1)
            };

            // 立即更新 UI
            utils.like.getLikeState.setData({ postId, userId: token }, newData);

            return { previousData };
        },
        onError: (_, __, context) => {
            // 发生错误时回滚到之前的状态
            if (context?.previousData) {
                utils.like.getLikeState.setData(
                    { postId, userId: token },
                    context.previousData
                );
            }
        },
        onSettled: () => {
            // 操作完成后刷新数据
            refetchLikeState();
        }
    });

    const handleLike = () => {
        if (!token) return;
        like.mutate({ postId, userId: token });
    };

    return (
        <div className="w-full pt-2 px-1 flex items-end justify-between">
            <div className="w-70% flex flex-wrap">
                {tags.map((tag, index) => (
                    <div
                        key={`${tag}-${index}`}
                        className="text-3 font-not-italic font-400 lh-6 mr-2 text-[#1DB48D]"
                    >
                        #{tag}
                    </div>
                ))}
            </div>
            <div className="top-10 flex h-5 items-center">
                <button
                    onClick={handleLike}
                    className="flex items-center bg-transparent"
                >
                    <Image
                        src={likeState.isLike
                            ? "/images/special-column/heart red.png"
                            : "/images/special-column/heart 1.png"
                        }
                        alt={likeState.isLike ? "已点赞" : "未点赞"}
                        width={18}
                        height={18}
                        className="h-5 w-5"
                    />
                    <div className="text-2.75 font-not-italic font-500 lh-6 ml-2.5 mr-4 text-[#B5B5B5]">
                        {likeState.likeCount}
                    </div>
                </button>
            </div>
        </div>
    );
}
"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LikeSectionProps {
    postId: number;
    userId: string;
    tags: string[];
}

export function LikeSection({ postId, userId, tags }: LikeSectionProps) {
    const [isHeartFilled, setIsHeartFilled] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const { data: likeList } = api.like.getLikeList.useQuery({ postId, userId });
    const { data: getLikeCount } = api.like.getLikeCount.useQuery({ postId });

    const updateLike = api.like.updateLike.useMutation();
    const createLike = api.like.create.useMutation();
    const uptime = api.like.uptime.useMutation();

    useEffect(() => {
        if (likeList) {
            setIsHeartFilled(likeList.length === 0 ? false : likeList[0]!.isLike);
        }
        setLikeCount(getLikeCount ?? 0);
    }, [likeList, getLikeCount]);

    const handleLike = () => {
        if (likeList?.length === 0) {
            createLike.mutate({ postId, userId, isLike: true });
        } else {
            updateLike.mutate({ postId, userId, isLike: !isHeartFilled });
            uptime.mutate({ postId, userId });
        }
        setIsHeartFilled(!isHeartFilled);
        setLikeCount(prev => isHeartFilled ? prev - 1 : prev + 1);
    };

    return (
        <div className="w-full pt-2 px-1 flex items-end justify-between">
            <div className="w-70% flex flex-wrap">
                {tags.map((item, index) => (
                    <div key={index} className="text-3 font-not-italic font-400 lh-6 mr-2 text-[#1DB48D]">
                        #{item}
                    </div>
                ))}
            </div>
            <div className="top-10 flex h-5 items-center">
                <Image
                    src={isHeartFilled ? "/images/special-column/heart red.png" : "/images/special-column/heart 1.png"}
                    alt="爱心"
                    width={18}
                    height={18}
                    className="h-5 w-5"
                    onClick={handleLike}
                />
                <div className="text-2.75 font-not-italic font-500 lh-6 ml-2.5 mr-4 text-[#B5B5B5]">
                    {likeCount}
                </div>
            </div>
        </div>
    );
}
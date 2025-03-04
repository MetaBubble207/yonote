"use client";
import Image from "next/image";
import Link from "next/link";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import { useRouter } from "next/navigation";
import type { UserSelect } from "@/server/db/schema";

interface UserTopProps {
    userInfo?: UserSelect | null;
    token: string | null;
}

export function UserTop({ userInfo, token }: UserTopProps) {
    const router = useRouter();

    return (
        <div className="flex flex-row items-center pt-9 mb-6">
            {token && userInfo ? (
                <div className="w-20.75 h-20.75 relative">
                    <Image
                        placeholder="blur"
                        blurDataURL={LoadingImage()}
                        src={userInfo.avatar ?? NotImage()}
                        alt="cover"
                        quality={100}
                        fill
                        loading="lazy"
                        className="rounded-full object-cover"
                    />
                </div>
            ) : (
                <Image
                    src={"/images/user/NotLoggedIn.svg"}
                    alt="avatar"
                    width={83}
                    height={83}
                    className={"rounded-full"}
                    onClick={() => router.push("/login")}
                />
            )}

            <div className="ml-3 flex-1">
                <div className="align-center flex">
                    <h1 className="text-3 font-500 lh-6 text-[#252525]">
                        {token && userInfo ? userInfo.name : "请点击头像登录"}
                    </h1>
                    {userInfo?.idType === 1 && (
                        <Image
                            src="/images/user/vip.svg"
                            alt="group"
                            width={20}
                            height={20}
                            className="ml-2"
                        />
                    )}
                </div>
                <div className="flex items-center">
                    <div className="cover flex h-3.5 w-3.5 items-center">
                        <Image
                            src="/images/user/I_logo.svg"
                            alt="group"
                            width={7.44}
                            height={7.44}
                            className="w-1.4775 h-1.86 fill-#666 shrink-0"
                        />
                        <Image
                            src="/images/user/D_logo.svg"
                            alt="group"
                            width={7.44}
                            height={7.44}
                            className="w-1.4775 h-1.86 fill-#666 shrink-0"
                        />
                    </div>
                    <span className="w-18 font-Source Han Sans SC text-2.5 font-not-italic font-400 lh-6 ml-1 items-center text-[#999]">
                        {userInfo?.idNumber}
                    </span>
                </div>
            </div>
            <div className="pl-2.5">
                <button
                    className={`w-20 h-6 text-10px border-0 flex items-center justify-center 
             bg-#fff rounded-full ${(!token || !userInfo) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Image
                        src="/images/user/icon_edit.png"
                        alt="icon"
                        width={16}
                        height={16}
                    />
                    {(!token || !userInfo) ? (
                        <span className="ml-2">编辑资料</span>
                    ) : (
                        <Link
                            href="/dashboard/user/message"
                            prefetch={false}
                            className="ml-2"
                        >
                            编辑资料
                        </Link>
                    )}
                </button>
            </div>
        </div>
    );
}
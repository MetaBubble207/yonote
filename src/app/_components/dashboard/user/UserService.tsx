"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface NavItem {
    href: string;
    iconSrc: string;
    text: string;
}

interface ServiceProps {
    token: string | null;
}

export function UserService({ token }: ServiceProps) {
    const router = useRouter();
    const cardStyles = "flex flex-col items-center w-1/4 mt-2 mb-2";

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        router.push("/login");
    }, [router]);

    const navItems: NavItem[] = [
        {
            href: `/dashboard/user/detail?id=${token}`,
            iconSrc: "/images/user/HomePage.svg",
            text: "个人主页",
        },
        {
            href: "",
            iconSrc: "/images/user/KnowledgePlanet.svg",
            text: "知识星球",
        },
        {
            href: "https://eahu7fmu6k6.feishu.cn/wiki/JtU0wJWhfiBygNkEoCBc2VUIndb?from=from_copylink",
            iconSrc: "/images/user/Usage.svg",
            text: "使用说明",
        },
        {
            href: "/dashboard/user/wallet",
            iconSrc: "/images/user/Income.svg",
            text: "收入提现",
        },
        {
            href: "https://eahu7fmu6k6.feishu.cn/share/base/form/shrcnM3bJTp21SwwwwAcZ39Q2EL",
            iconSrc: "/images/user/Feedback.svg",
            text: "意见反馈",
        },
        {
            href: "https://work.weixin.qq.com/kfid/kfcef6edb33788c7a32",
            iconSrc: "/images/user/Contact.svg",
            text: "联系客服",
        },
    ];

    const renderNavItem = useCallback((item: NavItem, index: number) => (
        <li key={index} className={cardStyles}>
            <Link href={item.href} className={"flex flex-col items-center"}>
                <div className={"relative h-6 w-6"}>
                    <Image
                        src={item.iconSrc}
                        alt={item.text}
                        fill
                        className={"object-cover"}
                    />
                </div>
                <div className="text-center text-sm font-normal leading-relaxed text-gray-800">
                    {item.text}
                </div>
            </Link>
        </li>
    ), [cardStyles]);

    return (
        <div className={"h-51.5 rounded-2.5 bg-#FFF py-4.5 w-full"}>
            <div className={"text-3.5 font-500 lh-6 pl-5.5 text-[#252525]"}>
                我的服务
            </div>
            <ul className={"mt-4 flex flex-wrap"}>
                {navItems.map(renderNavItem)}
                <li className={cardStyles}>
                    <div
                        className={"flex flex-col items-center cursor-pointer"}
                        onClick={logout}
                    >
                        <Image
                            src={"/images/user/SignOut.svg"}
                            alt={"退出登录"}
                            width={24}
                            height={24}
                        />
                        <div className={"w-11.5 text-2.75 font-400 lh-6 text-[#252525]"}>
                            退出登录
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}
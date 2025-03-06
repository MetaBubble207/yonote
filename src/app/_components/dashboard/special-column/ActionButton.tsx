"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function ActionButtons({ handleClickShareIcon, showSpeedPlanIcon }: { handleClickShareIcon: (e: React.MouseEvent) => void, showSpeedPlanIcon: boolean }) {
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-end">
            {showSpeedPlanIcon && <button
                className="rounded-full text-[10px] bg-#45E1B8"
                style={{ width: 56, height: 24 }}
            >
                加速计划
            </button>}
            <button className="mr-16px ml-2.5 bg-transparent" onClick={handleClickShareIcon}>
                <Image
                    src={pathname.includes('/content')
                        ? "/images/special-column/Share-black.png"
                        : "/images/special-column/Share-two.png"}
                    alt="分享"
                    width={12}
                    height={12}
                />
            </button>
        </div>
    );
}
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const allowBackPages = ["/dashboard/find", "/dashboard/subscribe", "/dashboard/user"];

            if (!allowBackPages.includes(pathname)) {
                event.preventDefault(); // 阻止默认返回行为
                if (window.history.length <= 2) {
                    // 只有一层历史记录，直接跳转到 dashboard/find
                    router.replace("/dashboard/find");
                }
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [pathname, router]);

    return <>{children}</>;
}

"use client"
import {usePathname, useRouter} from "next/navigation";

export const Content1 = () => {
    const router = useRouter();
    const pathname = usePathname();
    return <div>
        <button onClick={() => router.push('/a/b')}>路由到b</button>
        <div>{pathname}</div>
    </div>
}

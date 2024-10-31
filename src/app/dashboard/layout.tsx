import Link from "next/link";
import React from "react";

export default function Dashboard({children}: { children: React.ReactNode }) {
    return <>
        <div>{children}</div>
        <div
            className={'z-1 absolute bottom-10 flex items-center justify-center text-gray bg-transparent text-3 w-100vw'}>
            ICP备案号：
            <Link href={'http://beian.miit.gov.cn/ '}> 京ICP备2024064381号-1</Link>
        </div>
    </>
}

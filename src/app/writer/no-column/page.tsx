'use client'
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function NoColumnPage() {
    const router = useRouter()
    const [isGo, setIsGo] = useState(false);
    useEffect(() => {
        if (isGo) {
            router.push('/writer/homepage')
        }
    }, [isGo, router])

    return <div className={'ml-60 mt-60 text-10'}>
        <span>您还未申请自己的专栏，请先申请后再进行</span>
        <span onClick={() => setIsGo(true)} className={'text-primary cursor-pointer'}>操作</span>
    </div>
}

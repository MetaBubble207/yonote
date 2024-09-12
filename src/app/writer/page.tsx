"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default async function Home() {
    const router = useRouter();
    useEffect(()=>{
        router.push('/writer/homepage')
    })
    return (
        <div></div>
    );
}

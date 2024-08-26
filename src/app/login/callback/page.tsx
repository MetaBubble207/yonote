"use client";

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {api} from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import Loading from "@/app/_components/common/Loading";

const LoginCallback = () => {
    const searchParams = useSearchParams();
    const [token, setToken] = useLocalStorage("token", null);
    let userInfo;

    //这个地址是提前给微信登录接口重定向，默认微信那边会传回code和state两个query参数，通过useSearchParams可以拿到
    const code = searchParams.get("code");
    const res = api.users.login.useQuery({
        code: code!
    })
    if (typeof window !== 'undefined') {
        const searchParams = useSearchParams();
        //这个地址是提前给微信登录接口重定向，默认微信那边会传回code和state两个query参数，通过useSearchParams可以拿到
        const code = searchParams.get("code");
        if (code && token === null) {
            userInfo = api.users.login.useQuery({
                code: code
            }).data
            if (userInfo) {
                setToken(userInfo.id)
                window.location.href = "/writer/homepage"
            }
        }
    }

    return (
        <Loading/>
    );
};
export default function Page() {
    return (
        <Suspense>
            <LoginCallback></LoginCallback>
        </Suspense>
    );
}

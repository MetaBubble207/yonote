import { api } from "@/trpc/react";
import useLocalStorage from "./useLocalStorage";
import { useEffect } from "react";

export default function useLogin(code?: string) {
    const [token, setToken] = useLocalStorage('token', null);
    // 执行 tRPC 登录请求
    const { data: loginData, isSuccess, isLoading } = api.users.login.useQuery(
        code!,
        {
            enabled: Boolean(code && !token),
            retry: false,
        }
    );

    // 处理登录成功
    useEffect(() => {
        if (isSuccess && loginData?.id) {
            setToken(loginData.id);
        }
    }, [isSuccess, loginData?.id, setToken, token]);

    return { token, isLoading }
}
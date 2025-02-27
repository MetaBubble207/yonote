import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useLogin from "./useLogin";

interface LoginState {
    token: string | null;
}

export default function useCheckLoginState(
    redirectPath: string,
    code?: string,
    mounted?: boolean
): LoginState {
    const router = useRouter();
    const [storedToken] = useLocalStorage("token", null);
    const { token } = useLogin(code)

    // 处理未登录重定向逻辑
    useEffect(() => {
        if (!mounted) return

        if (!storedToken && !code) {
            router.push(redirectPath);
        }
    }, [code, storedToken, redirectPath, router, mounted]);

    return { token };
}

import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useCheckLoginState(target: string) {
    const router = useRouter();

    const [token] = useLocalStorage("token", null);
    useEffect(() => {
        if (!token) router.push(target);
    }, []);
}
"use client"
import { usePathname, useRouter} from "next/navigation";

export const ContainerB = () => {
    const pathname = usePathname();
    const router = useRouter();
    return (
      <div>
        <button onClick={() => router.push("/a")}>路由回a</button>
          <div>{pathname}</div>
      </div>
    );
}

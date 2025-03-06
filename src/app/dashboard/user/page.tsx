"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/_components/common/Navbar";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import useCheckOnClient from "@/app/_hooks/useCheckOnClient";
import { UserTop } from "@/app/_components/dashboard/user/UserTop";
import { UserColumnDisplay } from "@/app/_components/dashboard/user/UserColumnDisplay";
import { UserService } from "@/app/_components/dashboard/user/UserService";

export default function UserPage() {
  const code = useSearchParams().get("code");
  const [token, setToken] = useLocalStorage("token", null);

  const { data: userInfo, isLoading: isUserInfoLoading } =
    api.users.getOne.useQuery(token, { enabled: Boolean(token) });

  // API 查询
  const { data: loginData, isSuccess } = api.users.login.useQuery(
    code!,
    { enabled: Boolean(code && !userInfo) },
  );

  const { data: columnInfo, isLoading: isColumnInfoLoading } =
    api.column.getAllByUserId.useQuery(
      { userId: token },
      { enabled: Boolean(token && userInfo) },
    );

  useEffect(() => {
    if (isSuccess && loginData?.id) {
      setToken(loginData.id);
    }
  }, [loginData?.id, isSuccess, setToken]);

  const mounted = useCheckOnClient();
  if (!mounted) return null;

  return (
    <div>
      <div className="px-4 flex flex-col pb-15 bg-gradient-to-rb from-custom-user_gradient_1 via-custom-user_gradient_2 to-custom-user_gradient_3">
        <div className="flex-1 min-h-84vh w-full">
          <UserTop userInfo={userInfo} token={token} />
          <UserColumnDisplay
            columnInfo={columnInfo}
            isLoading={isUserInfoLoading || isColumnInfoLoading}
            token={token}
            userInfo={userInfo}
          />
          <UserService token={token} />
        </div>
        <div className={"z-1 text-gray text-3 flex h-20 w-full items-center justify-center"}>
          ICP备案号：
          <Link href={"http://beian.miit.gov.cn/ "}>
            {" "}
            京ICP备2024064381号-1
          </Link>
        </div>
      </div>
      {/*工具栏*/}
      <div className="z-2 fixed bottom-4 w-full justify-center">
        <Navbar />
      </div>
    </div>
  )
}
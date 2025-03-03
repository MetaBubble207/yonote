import UserInfo from "@/app/_components/dashboard/user/UserInfo";
import { api } from "@/trpc/server";
import Error from "@/app/_components/common/Error";
import { isValid } from "date-fns";

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  try {
    const { id } = await searchParams;
    const userInfo = await api.users.getOne(id);
    if (isValid(userInfo)) {
      <Error text="没有找到该用户的信息😯~" />
    }
    return (
      <UserInfo userInfo={userInfo!} />
    );
  } catch (error) {
    return <Error text="获取用户信息失败，请稍后重试😯~" />;
  }
};

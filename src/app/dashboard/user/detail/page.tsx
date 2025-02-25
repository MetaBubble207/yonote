import UserInfo from "@/app/_components/dashboard/user/UserInfo";

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams;
  return (
    <UserInfo userId={id}/>
  );
};

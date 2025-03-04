import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { ColumnPoster } from "@/app/_components/dashboard/poster/ColumnPoster";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ id: string; }>;
}) {
  const { id: columnId } = await searchParams;

  const [column, user, order] = await Promise.all([
    api.column.getById(columnId),
    api.users.getOneByColumnId(columnId),
    api.order.getColumnOrder({columnId})
  ]);

  if (!user || !column || !order) {
    redirect("/404");
  }

  return (
    <ColumnPoster user={user} column={column} ContentCount={order.detailPostCard.length} subscribeCount={order.subscriptCount} />
  );
}
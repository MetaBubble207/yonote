import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import SubscribeColumn from "./SubscribeColumn";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";

export default function UserColumn({ token }: { token: string }) {
  const { data: visibleColumnData, isLoading } = api.column.getSubscriptColumn.useQuery(
    { userId: token },
    { enabled: Boolean(token) }
  );
  if (isLoading) return <LoadingSkeleton rows={3} count={4} />;
  if (!visibleColumnData?.length)
    return <NoData title="还没有订阅过专栏噢😯~" />;

  return (
    <div>
      {visibleColumnData.map((column) => (
        <SubscribeColumn key={column.id} column={column} />
      ))}
    </div>
  );
};
import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import SubscribeColumn from "./SubscribeColumn";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/useRedux";
import { setSubscribeColumnList, userSubscribeSelector } from "@/app/_slice/user-subscribe-slice";
import { useEffect } from "react";
import { BaseColumnCard } from "@/server/db/schema";

export default function UserColumn({ token }: { token: string }) {
  const { subscribeColumnList } = useAppSelector(userSubscribeSelector);
  const dispatch = useAppDispatch();
  const { data: visibleColumnData, isLoading } = api.column.getSubscriptColumn.useQuery(
    token,
    { enabled: Boolean(token && subscribeColumnList.length === 0) }
  );
  useEffect(() => {
    if (visibleColumnData) {
      // 将日期对象转换为 ISO 字符串
      const serializedData = visibleColumnData.map((column: BaseColumnCard) => ({
        ...column,
        createdAt: column.createdAt?.toISOString(),
        updatedAt: column.updatedAt?.toISOString(),
      }));
      dispatch(setSubscribeColumnList(serializedData))
    }
  }, [visibleColumnData])
  if (isLoading) return <LoadingSkeleton rows={3} count={4} />;
  if (!visibleColumnData?.length)
    return <NoData title="还没有订阅过专栏噢😯~" />;

  return (
    <div>
      {subscribeColumnList.filter(column => column.isVisible).map((column) => (
        <SubscribeColumn key={column.id} column={column} />
      ))}
    </div>
  );
};
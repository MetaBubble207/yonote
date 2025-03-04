import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import SubscribeColumn from "./SubscribeColumn";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/useRedux";
import { setSubscribeColumnList, userSubscribeSelector } from "@/app/_slice/user-subscribe-slice";
import { useEffect } from "react";
import { date2DateTimeStringMouth } from "@/app/_utils/timeToString";

export default function UserCourse({ token }: { token: string | null }) {
  const { subscribeColumnList } = useAppSelector(userSubscribeSelector);
  const dispatch = useAppDispatch();
  const { data: visibleCourseData, isLoading } = api.column.getSubscriptColumn.useQuery(
    { userId: token!, type: 1 },
    { enabled: Boolean(token && subscribeColumnList.length === 0) }
  );
  useEffect(() => {
    if (visibleCourseData) {
      // 将日期对象转换为 ISO 字符串
      const serializedData = visibleCourseData.map((column) => ({
        ...column,
        createdAt: date2DateTimeStringMouth(column.createdAt),
        updatedAt: date2DateTimeStringMouth(column.updatedAt),
      }));
      dispatch(setSubscribeColumnList(serializedData))
    }
  }, [visibleCourseData])
  if (isLoading) return <LoadingSkeleton rows={3} count={4} />;
  if (!subscribeColumnList?.filter(column => (column.isVisible && column.type === 1)).length)
    return <NoData title="还没有订阅过小课噢😯~" />;

  return (
    <div>
      {subscribeColumnList.filter(column => (column.isVisible && column.type === 1)).map((column) => (
        <SubscribeColumn key={column.id} column={column} />
      ))}
    </div>
  );
};
import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import SubscribeRenew from "./SubscribeRenew";
import { useAppSelector } from "@/app/_hooks/useRedux";
import { userSubscribeSelector } from "@/app/_slice/user-subscribe-slice";


export default function UserUpdate({ token }: { token: string | null }) {
    const { subscribeColumnList } = useAppSelector(userSubscribeSelector)

    const { data: updateColumnData, isLoading } = api.column.getUpdateColumn.useQuery(
        token!,
        { enabled: Boolean(token) }  // 只有在有 token 时才发起请求
    );
    if (isLoading) return <LoadingSkeleton />;
    // 第二个判断条件主要是因为订阅管理的状态改变不好触发该组件更新，因此需要结合 redux 的状态和 updateColumnData 来判断是否显示该组件
    if (!updateColumnData?.length || updateColumnData?.filter(item => subscribeColumnList.find(sub => sub.id === item.id && sub.isVisible)).length === 0)
        return <NoData title="你订阅的所有专栏都暂未更新噢😁~" />;

    return (
        <div>
            {updateColumnData.filter(item => subscribeColumnList.find(sub => sub.id === item.id && sub.isVisible)).map((column) => (
                <SubscribeRenew key={column.id} column={column} />
            ))}
        </div>
    );
};
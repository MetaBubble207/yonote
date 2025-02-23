import { api } from "@/trpc/react";
import NoData from "@/app/_components/common/NoData";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import SubscribeRenew from "./SubscribeRenew";


export default function UserUpdate({ token }: { token: string }) {
    const { data: updateColumnData, isLoading } = api.column.getUpdateColumn.useQuery(
        { userId: token },
        { enabled: Boolean(token) }  // 只有在有 token 时才发起请求
    );

    if (isLoading) return <LoadingSkeleton />;
    if (!updateColumnData?.length)
        return <NoData title="你订阅的所有专栏都暂未更新噢😁~" />;

    return (
        <div>
            {updateColumnData.map((column) => (
                <SubscribeRenew key={column.id} column={column} />
            ))}
        </div>
    );
};
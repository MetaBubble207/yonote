import React from "react";
import DataPanel from "./DataPanel";
import { PublishButton } from "@/app/_components/writer/PublishButton";

interface HomepageDataServerProps {
    columnId: string;
    reads?: number[];
    readRate?: number;
    subscriptions?: number[];
    subscriptionRate?: number;
}

const HomepageDataServer = ({
    columnId,
    reads = [0, 0, 0],
    readRate = 0,
    subscriptions = [0, 0, 0],
    subscriptionRate = 0
}: HomepageDataServerProps) => {
    return (
        <div className="h-82 border-rd-2.5 w-full bg-[#FFF] pl-8 pr-9">
            <div className="pt-34px flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-4 font-700 lh-6 text-[#323232]">主页看板</span>
                    <PublishButton className="ml-32px" columnId={columnId} />
                </div>
            </div>
            <DataPanel
                reads={reads}
                readRate={readRate}
                subscriptions={subscriptions}
                subscriptionRate={subscriptionRate}
            />
        </div>
    );
};

export default HomepageDataServer;
import { Skeleton } from 'antd';
import React from 'react';

interface StatisticsInfoProps {
    subscriptCount?: number;
    contentCount?: number;
    isLoading: boolean;
}

export const StatisticsInfo: React.FC<StatisticsInfoProps> = ({
    subscriptCount,
    contentCount,
    isLoading
}) => (
    <div className="ml-37.8% text-3 font-normal leading-6 pt-[10px] text-[#999]">
        {isLoading ? (
            <Skeleton.Input active size="small" />
        ) : (
            <>
                <span className="text-4 font-bold leading-6 mr-[5px] shrink-0 text-[#252525]">
                    {subscriptCount}
                </span>
                订阅
                <span className="text-4 font-bold leading-6 mr-[5px] ml-[20px] shrink-0 text-[#252525]">
                    {contentCount}
                </span>
                内容
            </>
        )}
    </div>
);
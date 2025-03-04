"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Collapse, message, Slider, type SliderSingleProps } from "antd";
import { throttle } from "lodash";
import { api } from "@/trpc/react";

const distributionConfig: SliderSingleProps["marks"] = {
    0: "0%",
    10: "10%",
    20: "20%",
    30: "30%",
    40: "40%",
    50: "50%",
    60: "60%",
    70: "70%",
};
const extendConfig: SliderSingleProps["marks"] = {
    0: "0%",
    10: "10%",
    20: "20%",
    30: "30%",
    40: "40%",
    50: "50%",
    60: "60%",
    70: "70%",
};

interface IncentiveSettingsProps {
    columnId: string | null;
    isVip: boolean;
    distributorshipData: any;
}

const IncentiveSettings: React.FC<IncentiveSettingsProps> = ({
    columnId,
    isVip,
    distributorshipData,
}) => {
    const [distributionValue, setDistributionValue] = useState<number>(50);
    const [extendValue, setExtendValue] = useState<number>(0);
    const [messageApi, contextHolder] = message.useMessage();

    const updateDistributorshipDetail =
        api.distributorshipDetail.update.useMutation({
            onSuccess: () => { },
        });

    // 防抖函数，用于更新数据库
    const debouncedUpdate = useCallback(
        throttle((distribution, extend) => {
            if (!columnId) return;
            updateDistributorshipDetail.mutate({
                isVip: isVip,
                columnId: columnId,
                distributorship: distribution / 100,
                extend: extend / 100,
            });
        }, 3000),
        [columnId],
    );

    useEffect(() => {
        debouncedUpdate(distributionValue, extendValue);
    }, [distributionValue, extendValue, debouncedUpdate]);

    useEffect(() => {
        if (!distributorshipData) return;
        setDistributionValue(distributorshipData.distributorship * 100);
        setExtendValue(distributorshipData.extend * 100);
    }, [distributorshipData]);

    const throttledWarning = throttle(() => {
        messageApi.warning("分销激励和推广激励之和不能超过70%");
    }, 2000);

    const handleDistributionChange = (value: number) => {
        if (value + extendValue <= 70) {
            setDistributionValue(value);
        } else {
            throttledWarning();
        }
    };

    const handleExtendChange = (value: number) => {
        if (distributionValue + value <= 70) {
            setExtendValue(value);
        } else {
            throttledWarning();
        }
    };

    const incentiveList01 = [
        {
            key: "1",
            label: "分销激励",
            children: (
                <Slider
                    marks={distributionConfig}
                    step={1}
                    value={distributionValue}
                    max={70}
                    onChange={handleDistributionChange}
                />
            ),
        },
        {
            key: "2",
            label: "推广激励",
            children: (
                <Slider
                    marks={extendConfig}
                    step={1}
                    value={extendValue}
                    max={70}
                    onChange={handleExtendChange}
                />
            ),
        },
    ];

    const incentiveList02 = [
        {
            key: "1",
            label: "分销激励",
            children: (
                <Slider
                    marks={distributionConfig}
                    step={1}
                    value={distributionValue}
                    max={70}
                    onChange={handleDistributionChange}
                />
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Collapse items={isVip ? incentiveList01 : incentiveList02} />
        </>
    );
};

export default IncentiveSettings;
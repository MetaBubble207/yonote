"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { api } from "@/trpc/react";

interface DistributionActivationProps {
    columnId: string | null;
    userData: any;
    onActivated: () => void;
}

const DistributionActivation: React.FC<DistributionActivationProps> = ({
    columnId,
    userData,
    onActivated
}) => {
    const [isShowPrimaryDistribution, setShowPrimaryDistribution] = useState(false);

    const addDistributorshipDetail = api.distributorshipDetail.add.useMutation({
        onSuccess: () => {
            setShowPrimaryDistribution(false);
            onActivated();
        },
    });

    const openPrimaryDistribution = () => {
        if (!columnId) return;

        addDistributorshipDetail.mutate({
            columnId: columnId,
            distributorship: 0.5,
            extend: 0,
            isVip: userData?.idType === 1,
        });
    };

    const showConfirmPrimaryDistribution = () => {
        setShowPrimaryDistribution(true);
    };

    return (
        <div className={"flex h-full w-full flex-col items-center"}>
            <div className={"w-200 p20px rounded-20px mt-60 bg-white"}>
                <div className={"text-xl"}>
                    <span>您还未开启分销功能，是否开启分销功能</span>
                    <Button
                        type={"primary"}
                        onClick={showConfirmPrimaryDistribution}
                        className={"mb-5 ml-5"}
                    >
                        开启
                    </Button>
                </div>
                <span>
                    注意：开启分销功能之后，可以指定分销激励占比，可以让读者分销您的专栏后，其他用户购买时奖励读者一定金额，
                    鼓励读者推广您的专栏，开启会员后可以自动支持二级分销功能
                </span>
                <Modal
                    title={"是否确认开启分销"}
                    centered
                    open={isShowPrimaryDistribution}
                    onOk={openPrimaryDistribution}
                    onCancel={() => setShowPrimaryDistribution(false)}
                />
            </div>
        </div>
    );
};

export default DistributionActivation;
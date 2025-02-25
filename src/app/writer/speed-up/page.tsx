"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Date from "@/app/_components/writer/datarange/Date";
import {
  Button,
  Collapse,
  type CollapseProps,
  message,
  Modal,
  Slider,
  type SliderSingleProps,
  Switch,
} from "antd";
import { throttle } from "lodash";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/_components/common/Loading";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import TableComponent from "@/app/_components/writer/speed-up/TableComponent";

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

const Page = () => {
  const [distributionValue, setDistributionValue] = useState<number>(50);
  const [extendValue, setExtendValue] = useState<number>(0);

  const columnId = useSearchParams().get("columnId");
  const [token] = useLocalStorage("token", null);
  const { data: userData } = api.users.getOne.useQuery(token);
  const {
    data: distributorshipData,
    isFetching: isDistributorshipDataFetching,
    refetch: refetchDistributorshipDetail,
  } = api.distributorshipDetail.getOne.useQuery(columnId, {
    enabled: Boolean(columnId),
  });

  const addDistributorshipDetail = api.distributorshipDetail.add.useMutation({
    onSuccess: (r) => {
      setShowPrimaryDistribution(false);
      refetchDistributorshipDetail();
    },
  });

  const { data: speedUpData } = api.referrals.getByColumnId.useQuery(columnId);
  const openPrimaryDistribution = () => {
    addDistributorshipDetail.mutate({
      columnId: columnId,
      distributorship: 0.5,
      extend: 0,
      isVip: userData.idType === 1,
    });
  };

  const updateDistributorshipDetail =
    api.distributorshipDetail.update.useMutation({
      onSuccess: (r) => { },
    });
  // 防抖函数，用于更新数据库
  const debouncedUpdate = useCallback(
    throttle((distribution, extend) => {
      updateDistributorshipDetail.mutate({
        columnId: columnId,
        distributorship: distribution,
        extend: extend,
      });
    }, 3000),
    [],
  );

  useEffect(() => {
    debouncedUpdate(distributionValue, extendValue);
  }, [distributionValue, extendValue]);

  useEffect(() => {
    if (!distributorshipData) return;
    setDistributionValue(distributorshipData.distributorship * 100);
    setExtendValue(distributorshipData.extend * 100);
  }, [distributorshipData]);

  const [messageApi, contextHolder] = message.useMessage();
  const throttledWarning = throttle(() => {
    messageApi.warning("分销激励和推广激励之和不能超过70%");
  }, 2000);

  const handleDistributionChange = (value: number) => {
    setDistributionValue(value);
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

  const ItemList: React.FC = () => {
    return (
      <tbody className="text-center">
        {/*{items.map((item, index) => (*/}
        {/*    <tr key={index} className='border-t solid'>*/}
        {/*        <td>{item.ranking}</td>*/}
        {/*        <td className='relative'>*/}
        {/*            <div*/}
        {/*                className={"absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8"}>*/}
        {/*                <div className="relative w-8 h-8">*/}
        {/*                    <Image*/}
        {/*                        placeholder="blur"*/}
        {/*                        blurDataURL={DefaultLoadingPicture()}*/}
        {/*                        src={item.avatar ?? DefaultLoadingPicture()}*/}
        {/*                        alt='cover'*/}
        {/*                        quality={100}*/}
        {/*                        fill*/}
        {/*                        loading='lazy'*/}
        {/*                        className='rounded object-cover '*/}
        {/*                    />*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </td>*/}
        {/*        <td>{item.username}</td>*/}
        {/*        <td>{item.userId}</td>*/}
        {/*        <td>{item.extendConfig}</td>*/}
        {/*        <td>￥<span>{item.totalAmount}</span></td>*/}
        {/*    </tr>*/}
        {/*))}*/}
      </tbody>
    );
  };

  const [isShowPrimaryDistribution, setShowPrimaryDistribution] =
    useState(false);

  const showConfirmPrimaryDistribution = () => {
    setShowPrimaryDistribution(true);
  };
  if (isDistributorshipDataFetching)
    return (
      <div className={"mt-70"}>
        <Loading />
      </div>
    );

  if (!distributorshipData)
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
  return (
    <div className="p8 rounded-2.5 h-full w-full bg-[#FFF] pt-8">
      {contextHolder}
      <div className="">
        <h3 className="text-4 font-700 lh-6 text-[#323232]">加速计划</h3>
        {/*加速激励*/}
        <div className="mt-6.0525 pl-2">
          <Collapse
            items={userData?.idType === 1 ? incentiveList01 : incentiveList02}
          />
          {/*激励榜单*/}
          <div className="mt-8">
            <h3 className="w-17.75 h-5.5 text-4 font-400 lh-6 shrink-0 text-[rgba(0,0,0,0.85)]">
              激励榜单
            </h3>
            <div className="flex">
              <div className="mt-7.425 flex items-center">
                <label className="ml-10.5575 text-3.5 font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                  用户ID:{" "}
                </label>
                <input
                  className="pl-3.0425 border-rd-1 border-1 ml-4 h-8 w-56 shrink-0 border-solid border-[#D9D9D9] bg-[#FFF] outline-none"
                  type="text"
                  placeholder="用户ID"
                />
                <div className="ml-20.5">
                  <Date></Date>
                </div>

                <button className="ml-75 w-20.5 border-rd-1 text-3.5 font-400 lh-5.5 h-8 shrink-0 bg-[#1DB48D] text-[#FFF]">
                  数据导出
                </button>
              </div>
            </div>
          </div>
          {/*排行榜*/}
          <div className={"mt-4"}>
            {/*@ts-ignore*/}
            <TableComponent dataSource={speedUpData} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;

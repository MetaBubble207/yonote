"use client"
import { type OrderBuyer } from "@/server/db/schema";
import { Button, Table, message, type TableColumnsType } from "antd";
import React from "react";
import { time2DateTimeStringSeconds } from "@/tools/timeToString";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";

interface TableComponentProps {
  dataSource: OrderBuyer[];
  total: number;
}

const TableComponent = ({ dataSource, total }: TableComponentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  const endSubscriptionApi = api.order.endSubscription.useMutation({
    onSuccess: () => {
      messageApi.success("订阅已结束");
      router.refresh();
    },
    onError: () => {
      messageApi.error("操作失败");
    }
  });

  const endSubscription = (id: number) => {
    endSubscriptionApi.mutate({ id });
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const params = new URLSearchParams(searchParams.toString());

    // 更新分页参数
    params.set("currentPage", String(pagination.current));
    params.set("pageSize", String(pagination.pageSize));

    // 更新排序参数
    if (sorter.field) {
      params.set("sortField", sorter.field);
      params.set("sortOrder", sorter.order);
    }

    router.push(`?${params.toString()}`);
  };

  const columns: TableColumnsType<OrderBuyer> = [
    {
      title: <span className="pl-2">序号</span>,
      dataIndex: "_",
      render: (_, __, index) => (
        <span className="pl-2">
          {((Number(searchParams.get("currentPage")) || 1) - 1) *
            (Number(searchParams.get("pageSize")) || 10) + index + 1}
        </span>
      ),
      width: "11.5%",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      sorter: (a, b) => (a.userName > b.userName ? 1 : -1),
      width: "12.5%",
    },
    {
      title: "用户id",
      dataIndex: "buyerId",
      width: "10%",
    },
    {
      title: "订阅状态",
      dataIndex: "status",
      render: (value) => (
        <span className="text-3.5 font-400">
          {value ? (
            <span className="flex items-center">
              <span className="bg-[#1DB48D] h-1.5 w-1.5 rounded-full" />
              <span className="ml-2">订阅中</span>
            </span>
          ) : (
            <span className="flex items-center">
              <span className="bg-[#BFBFBF] h-1.5 w-1.5 rounded-full" />
              <span className="ml-2">已结束</span>
            </span>
          )}
        </span>
      ),
      width: "10%",
    },
    {
      title: "订阅开始时间",
      dataIndex: "createdAt",
      sorter: (a, b) => (a.createdAt > b.createdAt ? 1 : -1),
      render: (value) => <span>{time2DateTimeStringSeconds(value)}</span>,
      width: "17%",
    },
    {
      title: "订阅结束时间",
      dataIndex: "endDate",
      sorter: (a, b) => (a.endDate > b.endDate ? 1 : -1),
      render: (value) => <span>{time2DateTimeStringSeconds(value)}</span>,
      width: "17%",
    },
    {
      title: "操作",
      render: (_, record) => (
        <div className="text-3.5 font-400">
          <Button
            type="link"
            style={{ color: "#1DB48D", padding: 0 }}
            onClick={() => endSubscription(record.id)}
            disabled={!record.status}
          >
            结束订阅
          </Button>
        </div>
      ),
      width: "8%",
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        pagination={{
          current: Number(searchParams.get("currentPage")) || 1,
          pageSize: Number(searchParams.get("pageSize")) || 10,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          position: ["bottomCenter"],
        }}
      />
    </>
  );
};

export default TableComponent;
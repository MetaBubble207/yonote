"use client";
import { Table, type TableColumnsType, type TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { SpeedUp } from "@/server/db/schema";

interface TableComponentProps {
  dataSource: SpeedUp[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize?: number) => void;
  };
}

const TableComponent: React.FC<TableComponentProps> = ({
  dataSource,
  loading = false,
  pagination
}) => {
  const [data, setData] = useState<SpeedUp[]>([]);

  useEffect(() => {
    setData(dataSource || []);
  }, [dataSource]);

  const columns: TableColumnsType<SpeedUp> = [
    {
      title: <span className={"pl-2"}>排名</span>,
      dataIndex: "_",
      render: (_, __, index) => (
        <span className={"pl-2"}>
          {pagination ? (pagination.current - 1) * pagination.pageSize + index + 1 : index + 1}
        </span>
      ),
    },
    {
      title: "用户头像",
      dataIndex: "avatar",
      render: (value) => (
        <img
          src={value || "/default-avatar.png"}
          alt="avatar"
          className={"h-8 w-8 rounded-full object-cover"}
          onError={(e) => {
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
      ),
    },
    {
      title: "用户名",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "用户id",
      dataIndex: "userId",
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: "分销量",
      dataIndex: "distributionCount",
      sorter: (a, b) => (a.distributionCount > b.distributionCount ? -1 : 1),
      render: (value) => `${value || 0}`,
    },
    {
      title: "推广量",
      dataIndex: "promotionCount",
      sorter: (a, b) => (a.promotionCount > b.promotionCount ? -1 : 1),
      render: (value) => `${value || 0}`,
    },
    {
      title: "总金额",
      dataIndex: "totalPrice",
      sorter: (a, b) => (a.totalPrice > b.totalPrice ? -1 : 1),
      render: (value) => `¥${value || 0}`,
    },
  ];

  const paginationConfig: TableProps<SpeedUp>["pagination"] = pagination ? {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    onChange: pagination.onChange,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 条记录`,
    position: ["bottomCenter"]
  } : false;

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={paginationConfig}
      rowKey={(record) => record.id.toString()}
      loading={loading}
      locale={{ emptyText: "暂无数据" }}
    />
  );
};

export default TableComponent;
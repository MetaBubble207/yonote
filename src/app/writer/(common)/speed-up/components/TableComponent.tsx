import { Table, type TableColumnsType, type TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { SpeedUp } from "@/server/db/schema";

const TableComponent = ({ dataSource }: { dataSource: SpeedUp[] }) => {
  const [data, setData] = useState<SpeedUp[]>([]);
  useEffect(() => {
    setData(dataSource || []);
  }, [dataSource]);

  const columns: TableColumnsType<SpeedUp> = [
    {
      title: <span className={"pl-2"}>排名</span>,
      dataIndex: "_",
      sorter: (a, b) => (a.acceleratedTotal > b.acceleratedTotal ? 1 : -1),
      render: (_, __, index) => <span className={"pl-2"}>{index + 1}</span>,
    },
    {
      title: "用户头像",
      dataIndex: "avatar",
      render: (value) => (
        <img src={value} alt="avatar" className={"h-8 w-8 rounded-full"} />
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
      title: "加速量",
      dataIndex: "acceleratedTotal",
      sorter: (a, b) => (a.acceleratedTotal > b.acceleratedTotal ? 1 : -1),
    },
    {
      title: "总金额",
      dataIndex: "totalPrice",
      sorter: (a, b) => (a.totalPrice > b.totalPrice ? 1 : -1),
    },
  ];

  const onChange: TableProps<SpeedUp>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <Table
      columns={columns}
      onChange={onChange}
      dataSource={data}
      pagination={{ position: ["bottomCenter"] }}
      rowKey={(record) => record.id}
    />
  );
};

export default TableComponent;

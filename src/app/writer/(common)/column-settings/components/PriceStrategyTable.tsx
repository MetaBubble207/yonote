import React from 'react';
import { Table, Button, Input } from 'antd';
import type { PriceListSelect } from "@/server/db/schema";

interface PriceStrategyTableProps {
  priceList: PriceListSelect[];
  isEditing: boolean;
  onUpdatePrice: (index: number, key: string, value: string) => void;
  onDeleteStrategy?: (index: number) => void;
}

export const PriceStrategyTable: React.FC<PriceStrategyTableProps> = ({
  priceList,
  isEditing,
  onUpdatePrice,
  onDeleteStrategy,
}) => {
  const columns = [
    {
      title: '天数',
      dataIndex: 'timeLimit',
      key: 'timeLimit',
      width: 160,
      render: (text: number, _: any, index: number) => (
        isEditing ? (
          <Input
            className="border-rd-1 border-1 h-8 w-32 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
            placeholder="输入天数"
            style={{ fontSize: "14px" }}
            value={text}
            onChange={(e) => onUpdatePrice(index, "timeLimit", e.target.value)}
            maxLength={7}
          />
        ) : (
          <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
            {text >= 999999 ? "永久买断" : `${text}天`}
          </span>
        )
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 160,
      render: (text: number, _: any, index: number) => (
        isEditing ? (
          <Input
            className="border-rd-1 border-1 h-8 w-32 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
            placeholder="输入价格"
            style={{ fontSize: "14px" }}
            value={text}
            onChange={(e) => onUpdatePrice(index, "price", e.target.value)}
            maxLength={7}
          />
        ) : (
          <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
            {text}元
          </span>
        )
      ),
    },
    ...(isEditing && onDeleteStrategy ? [{
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button
          type="link"
          className="text-[#ff4d4f] p-0"
          onClick={() => onDeleteStrategy(index)}
        >
          删除
        </Button>
      ),
    }] : []),
  ];

  return (
    <Table
      dataSource={priceList}
      columns={columns}
      pagination={false}
      rowKey="id"
      size="small"
      className="mb-4"
      bordered={false}
      style={{ width: 400 }}
      scroll={{ x: 400 }}
      rowClassName="h-10"
    />
  );
};
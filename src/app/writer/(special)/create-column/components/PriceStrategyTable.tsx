import React from 'react';
import { Table, Button, Input } from 'antd';
import type { PriceStrategy } from '../types';

interface PriceStrategyTableProps {
  priceStrategies: PriceStrategy[];
  updatePriceStrategy: (index: number, key: string, value: string) => void;
  deletePriceStrategy: (index: number) => void;
  addPriceStrategy: () => void;
}

export const PriceStrategyTable: React.FC<PriceStrategyTableProps> = ({
  priceStrategies,
  updatePriceStrategy,
  deletePriceStrategy,
  addPriceStrategy,
}) => {
  const columns = [
    {
      title: '天数',
      dataIndex: 'timeLimit',
      key: 'timeLimit',
      width: 160,
      render: (text: number, _: any, index: number) => (
        <Input
          className="border-rd-1 border-1 h-8 w-32 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
          placeholder="输入天数"
          value={text || ''}
          onChange={(e) => updatePriceStrategy(index, 'timeLimit', e.target.value)}
          maxLength={7}
        />
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 160,
      render: (text: number, _: any, index: number) => (
        <Input
          className="border-rd-1 border-1 h-8 w-32 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
          placeholder="输入价格"
          value={text || ''}
          onChange={(e) => updatePriceStrategy(index, 'price', e.target.value)}
          maxLength={7}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button
          type="link"
          className="text-[#ff4d4f] p-0"
          onClick={() => deletePriceStrategy(index)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-8 ml-20">
      <Table
        dataSource={priceStrategies}
        columns={columns}
        pagination={false}
        rowKey="id"
        size="small"
        className="mb-4"
        style={{ width: 400 }}
      />
      {priceStrategies.length < 4 && (
        <Button
          type="link"
          className="text-[#1DB48D] underline p-0"
          onClick={addPriceStrategy}
        >
          + 添加新策略
        </Button>
      )}
    </div>
  );
};
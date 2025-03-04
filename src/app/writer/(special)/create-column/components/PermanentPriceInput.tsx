import React from 'react';
import { Input } from 'antd';

interface PermanentPriceInputProps {
  price: string;
  setPrice: (price: string) => void;
}

export const PermanentPriceInput: React.FC<PermanentPriceInputProps> = ({
  price,
  setPrice,
}) => {
  return (
    <div className="flex items-center mt-8">
      <label className="w-40 text-right text-3.5 text-[rgba(0,0,0,0.85)]">
        价格（最低10元）：
      </label>
      <div className="ml-4 flex items-center">
        <div className="h-8 w-22">
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="请输入"
            className="h-full w-full px-3 outline-none text-3.5"
          />
        </div>
        <span className="ml-2 text-3.5 text-[rgba(0,0,0,0.65)]">元</span>
      </div>
    </div>
  );
};
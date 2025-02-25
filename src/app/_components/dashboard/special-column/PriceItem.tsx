import { PriceItemProps } from "@/app/dashboard/special-column/types";
import Image from "next/image";

export const PriceItem: React.FC<PriceItemProps> = ({
    strategy,
    isSelected,
    onSelect,
}) => (
    <button
        className={`w-84.25 border-rd-1.25 border-1 h-10 shrink-0 justify-center border-solid bg-[#F5F7FB] 
      ${isSelected ? "border-[#45E1B8]" : ""}`}
        onClick={() => onSelect(strategy)}
    >
        <div className="relative ml-2.5 flex items-center">
            <div className="font-bold leading-6 shrink-0 text-[#252525]">
                ¥{strategy.price}
            </div>
            <div className="text-3 font-medium leading-6 ml-1 text-[#B5B5B5]">
                {strategy.timeLimit >= 99999
                    ? "一次购买，永久有效"
                    : `限时购买，有效期${strategy.timeLimit}天`}
            </div>
            {isSelected && (
                <Image
                    src="/images/dialog/check.png"
                    alt="check"
                    width={24}
                    height={24}
                    className="absolute right-2.5"
                />
            )}
        </div>
    </button>
);
import { WalletData } from "@/app/dashboard/user/wallet/types";
import Image from "next/image";

export interface WalletCardProps {
    walletData: WalletData;
    onWithdraw: () => void;
}

export const WalletCard = ({ walletData, onWithdraw }: WalletCardProps) => (
  <div className="w-85.75 h-41 relative">
    <Image
      src="/images/wallet/bg.svg"
      alt="bg"
      width={343}
      height={164}
      className="w-85.75 h-41 shrink-0"
    />
    <div className="w-85.75 h-41 absolute top-0 shrink-0">
      <div className="flex flex-col">
        <div className="text-4 font-not-italic font-400 lh-6 ml-6 mt-6 w-16 text-[#FFF]">
          账户余额
        </div>
        <div className="w-25 font-D-DIN text-6 font-not-italic font-700 lh-6 ml-6 mt-2 text-[#FFF]">
          ¥{walletData.amountWithdraw ?? 0 + (walletData.freezeIncome ?? 0)}
        </div>
        <div className="flex h-6 shrink-0 flex-wrap text-[#FFF]">
          <div className="ml-6 mt-9">
            冻结中 <span>¥{walletData.freezeIncome ?? 0}</span>
          </div>
          <div className="ml-11.75 mt-9">
            可提现 <span>¥{walletData.amountWithdraw ?? 0}</span>
          </div>
        </div>
        <div className="w-7.5 text-3 font-500 lh-6 ml-73.75 mt--8 text-[#252525]">
          <button onClick={onWithdraw} className="bg-transparent">
            提现
          </button>
        </div>
      </div>
    </div>
  </div>
);
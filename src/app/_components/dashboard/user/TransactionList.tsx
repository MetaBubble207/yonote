import { time2DateTimeStringMinutes } from "@/tools/timeToString";
import NoData from "@/app/_components/common/NoData";
import { TransactionListProps } from "@/app/dashboard/user/wallet/types";

export const TransactionList = ({ data, currentType }: TransactionListProps) => {
  const filteredData = data.filter(
    (item) => item.expenditureOrIncome === currentType
  );

  if (!filteredData || filteredData.length === 0) {
    return (
      <NoData
        title={`当前还没有${currentType === 0 ? "支出" : "收入"}噢😯`}
      />
    );
  }

  return (
    <>
      {filteredData.map((item) => (
        <div key={item.id}>
          <div className="ml-0">
            <div className="w-27 text-3.25 font-not-italic font-400 lh-6 text-[#252525]">
              {item.name}
            </div>
            <div className="w-26.5 h-6.25 text-2.75 font-not-italic font-400 lh-6 mt--1 shrink-0 text-[#999]">
              {time2DateTimeStringMinutes(item.createdAt)}
            </div>
          </div>
          <div className="w-20.75 h-5.5 text-3.75 font-700 lh-6 ml-60 mt--11 shrink-0 text-right text-[#252525]">
            {item.expenditureOrIncome === 0 ? "-" : "+"}￥{item.price}
          </div>
          <div className="border-1 mt-5" />
          <div className="mt-4" />
        </div>
      ))}
    </>
  );
};
import { date2DateTimeStringMinutes } from "@/app/_utils/timeToString";
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
          <div className="flex">
            <div>
              <div className="w-60 text-3.25 font-not-italic font-400 lh-6 text-[#252525]">
                {item.name}
              </div>
              <div className="w-26.5 h-6.25 text-2.75 font-not-italic font-400 lh-6 mt--1 shrink-0 text-[#999]">
                {date2DateTimeStringMinutes(item.createdAt)}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end text-3.75 font-700 text-[#252525]">
              <span>{item.expenditureOrIncome === 0 ? "-" : "+"}</span>
              <span>￥{item.price}</span>
            </div>
          </div>
          <div className="border-1 mt-2px" />
          <div className="mt-4" />
        </div>
      ))}
    </>
  );
};
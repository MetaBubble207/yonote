"use client";
import { ConfigProvider, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import React from "react";
import "dayjs/locale/zh-cn";
import locale from "antd/locale/zh_CN";

dayjs.locale("zh-cn");
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

interface DatePickerComponentProps {
  onDateChange: (dates: [Dayjs, Dayjs] | null) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  onDateChange,
}) => {
  const dateFormat = "YYYY-MM-DD";

  const disabledDate = (currentDate: Dayjs) => {
    // 禁用当前日期之后的日期
    return currentDate.isAfter(dayjs(), "day");
  };

  return (
    <div className="h-8 w-56">
      <ConfigProvider locale={locale}>
        <RangePicker
          defaultValue={[
            dayjs("2024-06-01", dateFormat),
            dayjs("2024-06-01", dateFormat),
          ]}
          format={dateFormat}
          disabledDate={disabledDate}
          onChange={(dates) => onDateChange(dates)}
        />
      </ConfigProvider>
    </div>
  );
};

export default DatePickerComponent;

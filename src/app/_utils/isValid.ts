import type { PriceListSelect } from "@/server/db/schema";
import type { MessageInstance } from "antd/es/message/interface";

export const isValid = (s: unknown) => {
  return s !== undefined && s !== null && s !== '';
}
export const isPriceListValid = (item: PriceListSelect | undefined): item is PriceListSelect => {
  return item !== null && item !== undefined;
}
export const validatePriceList = (
  priceList: PriceListSelect[],
  messageApi: MessageInstance
): boolean => {
  // 检查是否为空
  if (priceList.length === 0) {
    messageApi.info("请至少添加一个价格策略");
    return false;
  }

  // 检查价格是否合法
  for (const item of priceList) {
    if (item.price < 10) {
      messageApi.info("价格不能低于10元");
      return false;
    }
  }

  // 检查天数是否有重复
  const timeLimits = priceList.map(strategy => strategy.timeLimit);
  const uniqueTimeLimits = new Set(timeLimits);
  if (timeLimits.length !== uniqueTimeLimits.size) {
    messageApi.info("存在重复的天数设置");
    return false;
  }

  return true;
};
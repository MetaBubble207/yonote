export const getCurrentTime = () => {
  // 创建一个表示当前时间的 Date 对象
  const currentDate = new Date();
  // 计算东八区与 UTC 之间的分钟差（中国标准时间）
  const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
  // 计算调整的毫秒数
  const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
  // 根据差值调整时间
  return new Date(currentDate.getTime() + offsetInMilliseconds);
};

export const chinaOffsetInMilliseconds = 480 * 60 * 1000;

export const chinaMidNightOffsetInMilliseconds = 480 * 60 * 1000 + 24 * 60 * 60 * 1000 - 1;

export const getYesterdayMidnight = () => {
  // 创建一个表示当前时间的 Date 对象
  const currentDate = new Date();
  // 计算东八区与 UTC 之间的分钟差（中国标准时间）
  const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
  // 计算调整的毫秒数
  const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
  // 减去一天的毫秒数，并且调整时区
  const yesterdayDate = new Date(
    currentDate.getTime() - 24 * 60 * 60 * 1000 + offsetInMilliseconds,
  );
  // 将小时、分钟和秒数都设置为0
  yesterdayDate.setUTCHours(0, 0, 0, 0);
  return yesterdayDate;
};

export const getTodayMidnight = () => {
  // 创建一个表示当前时间的 Date 对象
  const currentDate = new Date();
  // 计算东八区与 UTC 之间的分钟差（中国标准时间）
  const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
  // 计算调整的毫秒数
  const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
  const today = new Date(currentDate.getTime() + offsetInMilliseconds);
  // 将小时、分钟、秒和毫秒都设置为0
  // 将小时、分钟、秒和毫秒都设置为0，同时确保是 UTC 时间的 0 点
  today.setUTCHours(0, 0, 0, 0);
  // 返回调整后的日期
  return today;
};

export const getLastWeekDates = () => {
  // 获取当前时间，并调整为东八区
  let now = new Date();
  let timezoneOffset = 8 * 60; // 东八区偏移量，单位为分钟
  let localTime = now.getTime();
  let localOffset = now.getTimezoneOffset() * 60000; // 以毫秒计算的时区偏移量
  let utc = localTime + localOffset;
  let beijingTime = new Date(utc + timezoneOffset * 60000);

  // 获取今天是星期几
  let currentDay = beijingTime.getDay();

  // 如果是星期天，则将其设为7，以便计算（因为一周的开始为周一）
  if (currentDay === 0) {
    currentDay = 7;
  }

  // 计算上周一和上周日的日期
  let lastMonday = new Date(beijingTime);
  let lastSunday = new Date(beijingTime);

  // 上周一是当前日期减去当前是星期几，再减去6天
  lastMonday.setDate(beijingTime.getDate() - currentDay - 6);
  // 设置上周一为00:00:00
  lastMonday.setUTCHours(0, 0, 0, 0);

  // 上周日是上周一再加上6天
  lastSunday.setDate(lastMonday.getDate() + 6);
  // 设置上周日为23:59:59
  lastSunday.setUTCHours(23, 59, 59, 999);

  return {
    lastMonday: lastMonday,
    lastSunday: lastSunday,
  };
};

export const getLastMonthDates = () => {
  // 获取当前时间，并调整为东八区
  let now = new Date();
  let timezoneOffset = 8 * 60; // 东八区偏移量，单位为分钟
  let localTime = now.getTime();
  let localOffset = now.getTimezoneOffset() * 60000; // 以毫秒计算的时区偏移量
  let utc = localTime + localOffset;
  let beijingTime = new Date(utc + timezoneOffset * 60000);

  // 获取当前的年份和月份
  let year = beijingTime.getFullYear();
  let month = beijingTime.getMonth();

  // 如果当前月份是1月，则上个月是去年的12月
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  // 上个月的第一天
  let firstDayOfLastMonth = new Date(year, month - 1, 1);
  firstDayOfLastMonth.setUTCHours(0, 0, 0, 0);

  // 上个月的最后一天
  let lastDayOfLastMonth = new Date(year, month, 0); // 设置成当前月的0号，即为上个月的最后一天
  lastDayOfLastMonth.setUTCHours(23, 59, 59, 999);

  return {
    firstDayOfLastMonth: firstDayOfLastMonth,
    lastDayOfLastMonth: lastDayOfLastMonth,
  };
};

export const getTheDayBeforeYesterdayMidnight = () => {
  // 创建一个表示当前时间的 Date 对象
  const currentDate = new Date();
  // 计算东八区与 UTC 之间的分钟差（中国标准时间）
  const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
  // 计算调整的毫秒数
  const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
  // 减去一天的毫秒数，并且调整时区
  const date = new Date(
    currentDate.getTime() - 24 * 60 * 60 * 1000 * 2 + offsetInMilliseconds,
  );
  // 将小时、分钟和秒数都设置为0
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

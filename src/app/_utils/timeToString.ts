const getMonthNumber = (month: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (months.indexOf(month) + 1).toString().padStart(2, "0");
};
export const time2DateString = (dateString: any) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  return `${parts[3]}-${getMonthNumber(parts[1])}-${parts[2]}`;
};

// 保留到分钟
export const date2DateTimeStringMinutes = (date: Date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 保留到秒
export const date2DateTimeStringSeconds = (date: Date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// 保留月份和日，时和分
export const date2DateTimeStringMouth = (date: Date) => {
  if (!date) return "";
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};
export const timeToTimeString = (dateString: string) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  const time = parts[4];
  return `${time}`;
};

// export const timeToDateString = (date:any) => {
//     if(date === null) return "";
//     const dateString = String(date);
//     const dateObject = new Date(dateString);
//
//     const year = dateObject.getFullYear();
//     const month = dateObject.getMonth() + 1; // 注意：月份从 0 开始，所以要加 1
//     const day = dateObject.getDate();
//
//     return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
//
// }
export const time2DateString = (dateString: any) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  return `${parts[3]}-${getMonthNumber(parts[1])}-${parts[2]}`;
};

export const time2DateTimeStringSeconds = (dateString: string) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  const time = parts[4];
  return `${parts[3]}-${getMonthNumber(parts[1])}-${parts[2]} ${time}`;
};
// 保留到分钟
export const time2DateTimeStringMinutes = (dateString: string) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  const timeArr = parts[4].split(":");
  const timeRes = timeArr[0] + ":" + timeArr[1];
  return `${parts[3]}-${getMonthNumber(parts[1])}-${parts[2]} ${timeRes}`;
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

export const timeToTimeString = (dateString: string) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  const time = parts[4];
  return `${time}`;
};

export const time2DateFullTimeString = (dateString: string) => {
  if (!dateString) return "";
  dateString = String(dateString);
  const parts = dateString.split(" ");
  const time = parts[4].substring(0, 8);
  return `${parts[3]}-${getMonthNumber(parts[1])}-${parts[2]} ${time}`;
};

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

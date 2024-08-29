export default function getDateStringArray(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        // 将当前日期格式化为 yyyy-MM-dd
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以需要加1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1); // 增加一天
    }

    return dates;
}
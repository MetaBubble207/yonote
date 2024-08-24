export const getCurrentTime = () => {
    // 创建一个表示当前时间的 Date 对象
    const currentDate = new Date();
    // 计算东八区与 UTC 之间的分钟差（中国标准时间）
    const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
    // 计算调整的毫秒数
    const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
    // 根据差值调整时间
    return new Date(currentDate.getTime( )+ offsetInMilliseconds);
}

export const getYesterdayMidnight = () => {
    // 创建一个表示当前时间的 Date 对象
    const currentDate = new Date();
    // 计算东八区与 UTC 之间的分钟差（中国标准时间）
    const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
    // 计算调整的毫秒数
    const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
    // 减去一天的毫秒数，并且调整时区
    const yesterdayDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000) + offsetInMilliseconds);
    // 将小时、分钟和秒数都设置为0
    yesterdayDate.setUTCHours(0, 0, 0, 0);
    return yesterdayDate;
}

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
export const getCurrentTime = () => {
    // 创建一个表示当前时间的 Date 对象
    const currentDate = new Date();
    // 计算东八区与 UTC 之间的分钟差（中国标准时间）
    const chinaTimezoneOffsetInMinutes = 480; // 东八区是 UTC+8，所以分钟差为 -480
    // 计算调整的毫秒数
    const offsetInMilliseconds = chinaTimezoneOffsetInMinutes * 60 * 1000;
    // 根据差值调整时间
    return new Date(currentDate.getTime() + offsetInMilliseconds);
}

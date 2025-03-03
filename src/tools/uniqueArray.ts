/**
 * 根据指定的键去除数组中的重复项
 * @param arr 需要去重的数组
 * @param key 用于判断重复的键名
 * @returns 去重后的数组
 */
export const uniqueArray = <T extends Record<K, any>, K extends keyof T>(
  arr: T[],
  key: K
): T[] => {
  return arr.reduce((acc: T[], item: T) => {
    if (!acc.find((i) => i[key] === item[key])) {
      acc.push(item);
    }
    return acc;
  }, []);
};
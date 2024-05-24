export const uniqueArray = (arr, key) => {
    return arr.reduce((acc, item) => {
        if (!acc.find(i => i[key] === item[key])) {
            acc.push(item);
        }
        return acc;
    }, []);
};
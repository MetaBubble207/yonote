export const timeToString = (date:any) => {
    if(date === null) return "";
    const dateString = String(date);
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // 注意：月份从 0 开始，所以要加 1
    const day = dateObject.getDate();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;


}

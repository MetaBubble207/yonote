import { v4 as uuidv4 } from 'uuid';

export const getSoleId = () => {
    let idNumber = uuidv4();
    // 将uuid中的所有非字母数字字符替换为空字符串
    idNumber = idNumber.replace(/[^a-zA-Z0-9]/g, '');
    while (idNumber.length < 15) {
        idNumber += Math.random().toString(36).substring(2); // 追加随机字母数字字符
    }
    // 如果生成的uuid长度超过需要的长度，可以截取部分
    return  idNumber.substring(0, 15);
}

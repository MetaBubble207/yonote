import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data: any[], fileName: string) => {
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  
  // 将数据转换为工作表
  const ws = XLSX.utils.json_to_sheet(data);
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // 生成 Excel 文件并下载
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};
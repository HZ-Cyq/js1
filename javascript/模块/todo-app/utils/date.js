
// 命名导出多个工具函数
export function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  export function getToday() {
    return new Date();
  }
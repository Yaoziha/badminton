// 获取周数的工具函数
const getWeekNumber = (date) => {
  // 设置 Date 对象的 firstDayOfWeek 为周一
  date.setHours(0, 0, 0, 0);
  // 设置 Date 对象的 firstDayOfYear 为 1 月 1 日
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  // 计算当前日期是一年中的第几周
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

// 获取当前周信息
function getCurrentWeekInfo() {
  const today = new Date();
  const year = today.getFullYear();
  const weekNumber = getWeekNumber(today);

  return {
    weekNumber,
    year
  };
}

module.exports = {
  getWeekNumber,
  getCurrentWeekInfo
} 
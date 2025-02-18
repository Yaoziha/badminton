// 获取周数的工具函数
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// 获取当前周信息
const getCurrentWeekInfo = () => {
  const now = new Date()
  return {
    weekNumber: getWeekNumber(now),
    year: now.getFullYear()
  }
}

module.exports = {
  getWeekNumber,
  getCurrentWeekInfo
} 
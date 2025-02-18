const db = wx.cloud.database()
const _ = db.command
const { getWeekNumber, getCurrentWeekInfo } = require('../../utils/date.js')

Page({
  data: {
    historyList: [],
    currentWeek: 0,
    currentYear: new Date().getFullYear()
  },

  onLoad() {
    // 移除这里的 getHistoryData 调用
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    // 在这里调用 getHistoryData
    this.getHistoryData()
  },

  getHistoryData() {
    // 获取最近4周的数据
    const { weekNumber: currentWeek, year: currentYear } = getCurrentWeekInfo()
    
    // 更新当前状态
    this.setData({
      currentWeek,
      currentYear
    })
    
    // 获取场地信息
    db.collection('badmintonVenues')
      .where({
        year: currentYear,
        weekNumber: _.lte(currentWeek).gte(currentWeek - 3)
      })
      .orderBy('weekNumber', 'desc')
      .get()
      .then(venueRes => {
        // 获取每周的报名信息
        const weekPromises = venueRes.data.map(venue => {
          return db.collection('badmintonSignups')
            .where({
              year: venue.year,
              weekNumber: venue.weekNumber
            })
            .get()
            .then(signupRes => {
              return {
                venue: venue,
                signups: signupRes.data
              }
            })
        })

        Promise.all(weekPromises).then(results => {
          this.setData({
            historyList: results
          })
        })
      })
  },

  // getWeekNumber(date) {
  //   const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  //   const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  //   return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  // }
}) 
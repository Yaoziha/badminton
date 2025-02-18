const app = getApp()
const { getCurrentWeekInfo } = require('../../utils/date.js')
const db = wx.cloud.database()

Page({
  data: {
    hasSignedUp: false
  },

  onLoad() {
    this.checkSignupStatus()
  },

  onShow() {
    this.checkSignupStatus()
    // 更新tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  // 检查报名状态
  checkSignupStatus() {
    const currentRole = app.globalData.role
    const currentWeek = this.getWeekNumber(new Date())
    const currentYear = new Date().getFullYear()

    db.collection('badmintonSignups')
      .where({
        role: currentRole,
        weekNumber: currentWeek,
        year: currentYear
      })
      .get()
      .then(res => {
        this.setData({
          hasSignedUp: res.data.length > 0
        })
      })
  },

  // 报名
  signup() {
    const currentRole = app.globalData.role
    if (!currentRole) {
      wx.showToast({
        title: '请先选择角色',
        icon: 'none'
      })
      return
    }

    const { weekNumber, year } = getCurrentWeekInfo()

    db.collection('badmintonSignups').add({
      data: {
        role: currentRole,
        weekNumber,
        year,
        createdAt: db.serverDate()
      }
    }).then(() => {
      this.setData({
        hasSignedUp: true
      })
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      })
    })
  },

  // 取消报名
  cancelSignup() {
    const currentRole = app.globalData.role
    const currentWeek = this.getWeekNumber(new Date())
    const currentYear = new Date().getFullYear()

    db.collection('badmintonSignups')
      .where({
        role: currentRole,
        weekNumber: currentWeek,
        year: currentYear
      })
      .remove()
      .then(() => {
        this.setData({
          hasSignedUp: false
        })
        wx.showToast({
          title: '取消成功',
          icon: 'success'
        })
      })
  },

  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}) 
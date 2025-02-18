/*
 * @Descripttion: 
 * @version: 
 * @Author: yaozihan
 * @Date: 2025-02-14 15:21:39
 * @LastEditors: yaozihan
 * @LastEditTime: 2025-02-18 15:51:38
 */
const app = getApp()
const { getCurrentWeekInfo, getWeekNumber } = require('../../utils/date.js')
const db = wx.cloud.database()

Page({
  data: {
    hasVenueInfo: false,
    venueInfo: null,
    location: '巡司河体育公园',
    date: '',
    startTime: '',
    endTime: '',
    remarks: ''
  },

  onLoad() {
    this.checkVenueInfo()
    // 获取已有的场地信息
    const venueInfo = wx.getStorageSync('venueInfo')
    if (venueInfo) {
      this.setData({
        location: venueInfo.location || '巡司河体育公园',  // 如果有存储的值就用存储的，否则用默认值
        date: venueInfo.date || '',
        startTime: venueInfo.startTime || '',
        endTime: venueInfo.endTime || ''
      })
    }
  },

  onShow() {
    this.checkVenueInfo()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  checkVenueInfo() {
    const { weekNumber, year } = getCurrentWeekInfo()

    db.collection('badmintonVenues')
      .where({
        weekNumber,
        year
      })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          this.setData({
            hasVenueInfo: true,
            venueInfo: res.data[0]
          })
        }
      })
  },

  startEdit() {
    const { venueInfo } = this.data
    this.setData({
      hasVenueInfo: false,
      location: venueInfo.location,
      date: venueInfo.date,
      startTime: venueInfo.startTime,
      endTime: venueInfo.endTime,
      remarks: venueInfo.remarks || ''
    })
  },

  onLocationInput(e) {
    this.setData({
      location: e.detail.value
    })
  },

  onDateChange(e) {
    this.setData({ date: e.detail.value })
  },

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value })
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value })
  },

  onRemarksInput(e) {
    this.setData({ remarks: e.detail.value })
  },

  saveVenueInfo() {
    const { location, date, startTime, endTime, remarks } = this.data
    
    if (!location || !date || !startTime || !endTime) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const { weekNumber, year } = getCurrentWeekInfo()

    // 先查询是否已存在本周的场地信息
    db.collection('badmintonVenues')
      .where({
        weekNumber,
        year
      })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          // 如果存在，则更新
          return db.collection('badmintonVenues').doc(res.data[0]._id).update({
            data: {
              location,
              date,
              startTime,
              endTime,
              remarks,
              weekNumber: getWeekNumber(new Date(date)),
              year: new Date(date).getFullYear(),
              updatedAt: db.serverDate()
            }
          })
        } else {
          // 如果不存在，则新增
          return db.collection('badmintonVenues').add({
            data: {
              location,
              date,
              startTime,
              endTime,
              remarks,
              weekNumber: getWeekNumber(new Date(date)),
              year: new Date(date).getFullYear(),
              createdAt: db.serverDate()
            }
          })
        }
      })
      .then(() => {
        this.setData({
          hasVenueInfo: true,
          venueInfo: { location, date, startTime, endTime, remarks }
        })
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      })
      .catch(err => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      })
  },

  deleteVenueInfo() {
    const { weekNumber, year } = getCurrentWeekInfo()

    db.collection('badmintonVenues')
      .where({
        weekNumber,
        year
      })
      .remove()
      .then(() => {
        this.setData({
          hasVenueInfo: false,
          venueInfo: null
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
      })
  }
}) 
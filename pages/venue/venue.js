/*
 * @Descripttion: 
 * @version: 
 * @Author: yaozihan
 * @Date: 2025-02-14 15:21:39
 * @LastEditors: yaozihan
 * @LastEditTime: 2025-02-14 16:02:46
 */
const app = getApp()

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
    const venueInfo = wx.getStorageSync('venueInfo')
    if (venueInfo) {
      this.setData({
        hasVenueInfo: true,
        venueInfo
      })
    }
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

    const venueInfo = { location, date, startTime, endTime, remarks }
    
    // 保存到全局数据和本地存储
    app.globalData.venueInfo = venueInfo
    wx.setStorageSync('venueInfo', venueInfo)

    this.setData({
      hasVenueInfo: true,
      venueInfo
    })

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },

  deleteVenueInfo() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除本周订场信息吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除订场信息
          app.globalData.venueInfo = null
          wx.removeStorageSync('venueInfo')
          
          // 更新页面状态
          this.setData({
            hasVenueInfo: false,
            venueInfo: null,
            location: '巡司河体育公园',
            date: '',
            startTime: '',
            endTime: '',
            remarks: ''
          })

          wx.showToast({
            title: '已删除订场信息',
            icon: 'success'
          })
        }
      }
    })
  }
}) 
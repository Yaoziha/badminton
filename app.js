/*
 * @Descripttion: 
 * @version: 
 * @Author: yaozihan
 * @Date: 2025-02-14 15:03:42
 * @LastEditors: yaozihan
 * @LastEditTime: 2025-02-18 11:53:17
 */
// app.js
App({
  onLaunch: function() {
    
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'yzh-0gc3evaze3e2ac32',  // 你的云环境ID
        traceUser: true
      })
    }

    // 检查角色信息
    const role = wx.getStorageSync('role')
    
    if (role) {
      this.globalData.role = role
      this.globalData.hasLogin = true
    } else {
      wx.redirectTo({
        url: '/pages/role/role'
      })
    }
    
    // 获取本地存储的报名信息和场地信息
    const participants = wx.getStorageSync('participants') || []
    this.globalData.participants = participants
    
    const venueInfo = wx.getStorageSync('venueInfo')
    this.globalData.venueInfo = venueInfo
  },

  globalData: {
    userInfo: null,
    role: null,
    hasLogin: false,
    participants: [],
    venueInfo: null
  }
})

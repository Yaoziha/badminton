/*
 * @Descripttion: 
 * @version: 
 * @Author: yaozihan
 * @Date: 2025-02-14 15:03:42
 * @LastEditors: yaozihan
 * @LastEditTime: 2025-02-14 15:37:30
 */
// app.js
App({
  globalData: {
    userInfo: null,
    role: null,
    hasLogin: false,
    participants: [],
    venueInfo: null
  },

  onLaunch() {
    // 只检查角色信息
    const role = wx.getStorageSync('role')
    
    if (role) {
      // 如果已有角色信息，说明已经完成了基本设置
      this.globalData.role = role
      this.globalData.hasLogin = true
    } else {
      // 如果没有角色信息，跳转到角色选择页面
      wx.redirectTo({
        url: '/pages/role/role'
      })
    }
    
    // 获取本地存储的报名信息和场地信息
    const participants = wx.getStorageSync('participants') || []
    this.globalData.participants = participants
    
    const venueInfo = wx.getStorageSync('venueInfo')
    this.globalData.venueInfo = venueInfo
  }
})

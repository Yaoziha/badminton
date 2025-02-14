const app = getApp()

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
    const participants = app.globalData.participants || []
    const hasSignedUp = participants.some(p => p.name === currentRole)
    this.setData({
      hasSignedUp
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

    const participants = app.globalData.participants || []
    if (participants.some(p => p.name === currentRole)) {
      wx.showToast({
        title: '您已经报名了',
        icon: 'none'
      })
      return
    }

    // 添加报名信息
    participants.push({
      name: currentRole,
      timestamp: new Date().getTime()
    })

    // 更新全局数据
    app.globalData.participants = participants
    // 更新存储
    wx.setStorageSync('participants', participants)

    this.setData({
      hasSignedUp: true
    })

    wx.showToast({
      title: '报名成功',
      icon: 'success'
    })
  },

  // 取消报名
  cancelSignup() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消报名吗？',
      success: (res) => {
        if (res.confirm) {
          const currentRole = app.globalData.role
          const participants = app.globalData.participants || []
          const newParticipants = participants.filter(p => p.name !== currentRole)
          
          // 更新全局数据
          app.globalData.participants = newParticipants
          // 更新存储
          wx.setStorageSync('participants', newParticipants)

          this.setData({
            hasSignedUp: false
          })

          wx.showToast({
            title: '已取消报名',
            icon: 'success'
          })
        }
      }
    })
  }
}) 
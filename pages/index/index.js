// index.js
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    participants: [],
    venueInfo: null,
    showLoginButton: false,
    role: null,
    currentWeekSignups: []
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onLoad() {
    if (!app.globalData.hasLogin) {
      // 如果未登录，显示获取用户信息按钮
      this.setData({
        showLoginButton: true
      })
    }
    
    this.setData({
      role: app.globalData.role
    })
    this.getLocalSignupInfo()
    // 添加获取订场信息
    this.getVenueInfo()
  },
  onShow() {
    // 设置选中的 tab
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

    // 每次显示页面时，重新获取最新的报名信息
    this.getLocalSignupInfo();
    // 添加获取订场信息
    this.getVenueInfo();

    // 获取角色信息
    const role = app.globalData.role || wx.getStorageSync('role');
    if (role) {
      this.setData({
        role: role
      });
    }
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)
        
        // 获取用户信息后跳转到角色选择页面
        wx.navigateTo({
          url: '/pages/role/role'
        })
      }
    })
  },
  changeRole() {
    wx.navigateTo({
      url: '/pages/role/role?isChanging=true'
    })
  },
  goToRoleSelect() {
    wx.navigateTo({
      url: '/pages/role/role'
    })
  },
  checkAndClearLastWeekData() {
    const now = new Date()
    if (now.getDay() === 0 && now.getHours() >= 23) {
      // 清空场地信息和报名列表
      app.globalData.venueInfo = null
      app.globalData.participants = []
      wx.setStorageSync('venueInfo', null)
      wx.setStorageSync('participants', [])
      
      this.setData({
        venueInfo: null,
        participants: []
      })
    }
  },
  cancelSignup() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消报名吗？',
      success: (res) => {
        if (res.confirm) {
          const currentRole = this.data.role
          const newParticipants = this.data.participants.filter(p => p.name !== currentRole)
          
          // 更新全局数据
          app.globalData.participants = newParticipants
          // 更新存储
          wx.setStorageSync('participants', newParticipants)
          // 更新页面数据
          this.setData({
            participants: newParticipants
          })

          wx.showToast({
            title: '已取消报名',
            icon: 'success'
          })
        }
      }
    })
  },
  getLocalSignupInfo() {
    const participants = app.globalData.participants || [];
    const userInfo = wx.getStorageSync('userInfo');
    
    if (participants.length > 0) {
      const signupList = participants.map(participant => ({
        avatarUrl: userInfo ? userInfo.avatarUrl : '',
        role: participant.name
      }));
      
      this.setData({
        currentWeekSignups: signupList
      });
    } else {
      // 如果没有报名信息，清空列表
      this.setData({
        currentWeekSignups: []
      });
    }
  },
  // 添加获取订场信息的方法
  getVenueInfo() {
    const venueInfo = wx.getStorageSync('venueInfo');
    if (venueInfo) {
      this.setData({
        venueInfo: venueInfo
      });
    } else {
      this.setData({
        venueInfo: null
      });
    }
  }
})

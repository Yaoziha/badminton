const app = getApp()

Page({
  data: {
    fixedRoles: [
      { name: '姚老师', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=姚老师&gender=male' },
      { name: '王老师', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=王老师&gender=female' },
      { name: '丁哥', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=丁哥&gender=male' },
      { name: '马老师', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=马老师&gender=female' },
      { name: '戴哥', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=戴哥&gender=male' },
      { name: '龙总', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=龙总&gender=male' },
      { name: '齐总', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=齐总&gender=female' },
      { name: '王总', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=王总&gender=male' },
      { name: '其他', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=other' }
    ],
    selectedRole: '',
    isChanging: false,
    userInfo: null,
    isGettingUserInfo: false
  },

  onLoad(options) {
    this.setData({
      isChanging: options.isChanging === 'true'
    })
    
    if (this.data.isChanging) {
      const currentRole = app.globalData.role
      this.setData({
        selectedRole: currentRole
      })
    }
  },

  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({
      selectedRole: role
    });
  },

  // 获取用户信息
  getUserProfile() {
    if (this.data.isGettingUserInfo) return;
    
    this.setData({ isGettingUserInfo: true });
    
    wx.getUserProfile({
      desc: '用于完善角色信息',
      lang: 'zh_CN',
      success: (res) => {
        console.log('获取用户信息成功：', res.userInfo);
        const userInfo = res.userInfo;
        
        // 保存用户信息和角色信息
        this.setData({
          userInfo: userInfo,
          selectedRole: userInfo.nickName
        });
        
        app.globalData.role = userInfo.nickName;
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('role', userInfo.nickName);
        wx.setStorageSync('userInfo', userInfo);

        // 显示成功提示并跳转
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              if (this.data.isChanging) {
                wx.navigateBack({
                  delta: 1,
                  success: () => {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 2];
                    if (prevPage) {
                      prevPage.setData({
                        role: userInfo.nickName
                      });
                    }
                  }
                });
              } else {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            }, 1500);
          }
        });
      },
      fail: (err) => {
        console.log('获取用户信息失败：', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ isGettingUserInfo: false });
      }
    });
  },

  // 确认角色选择
  confirmRole() {
    if (!this.data.selectedRole) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none'
      });
      return;
    }

    if (this.data.selectedRole === '其他') {
      this.getUserProfile();
    } else {
      // 非"其他"角色的处理
      app.globalData.role = this.data.selectedRole;
      wx.setStorageSync('role', this.data.selectedRole);

      wx.showToast({
        title: '设置成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            if (this.data.isChanging) {
              wx.navigateBack({
                delta: 1,
                success: () => {
                  const pages = getCurrentPages();
                  const prevPage = pages[pages.length - 2];
                  if (prevPage) {
                    prevPage.setData({
                      role: this.data.selectedRole
                    });
                  }
                }
              });
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              });
            }
          }, 1500);
        }
      });
    }
  }
}) 
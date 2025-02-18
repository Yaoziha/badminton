/*
 * @Descripttion: 
 * @version: 
 * @Author: yaozihan
 * @Date: 2025-02-14 15:32:39
 * @LastEditors: yaozihan
 * @LastEditTime: 2025-02-14 17:39:00
 */
Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#007AFF",
    list: [{
      pagePath: "/pages/index/index",
      text: "首页",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/home-active.png"
    }, {
      pagePath: "/pages/venue/venue",
      text: "订场信息",
      iconPath: "/images/venue.png",
      selectedIconPath: "/images/venue-active.png"
    }, {
      pagePath: "/pages/signup/signup",
      text: "报名",
      iconPath: "/images/signup.png",
      selectedIconPath: "/images/signup-active.png"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    }
  }
}) 
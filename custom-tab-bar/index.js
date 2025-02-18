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
      iconPath: "/images/tabbar/home.png",
      selectedIconPath: "/images/tabbar/home-active.png"
    }, {
      pagePath: "/pages/venue/venue",
      text: "订场信息",
      iconPath: "/images/tabbar/venue.png",
      selectedIconPath: "/images/tabbar/venue-active.png"
    }, {
      pagePath: "/pages/signup/signup",
      text: "报名",
      iconPath: "/images/tabbar/signup.png",
      selectedIconPath: "/images/tabbar/signup-active.png"
    }, {
      pagePath: "/pages/history/history",
      text: "历史",
      iconPath: "/images/tabbar/calendar.png",
      selectedIconPath: "/images/tabbar/calendar-active.png"
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
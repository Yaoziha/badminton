/*
 * @Descripttion: 
 * @version: 
 * @Author: yaozihan
 * @Date: 2025-02-14 15:20:24
 * @LastEditors: yaozihan
 * @LastEditTime: 2025-02-18 16:47:03
 */
const app = getApp()
const { getCurrentWeekInfo } = require('../../utils/date.js')
const db = wx.cloud.database()

Page({
  data: {
    hasSignedUp: false,
    showFireworks: false
  },

  particles: [],

  onLoad() {
    this.checkSignupStatus()
    // 初始化时获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.windowWidth = systemInfo.windowWidth
    this.windowHeight = systemInfo.windowHeight
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
    const { weekNumber: currentWeek, year: currentYear } = getCurrentWeekInfo()

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

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#fireworksCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 设置canvas尺寸
        canvas.width = this.windowWidth
        canvas.height = this.windowHeight

        this.canvas = canvas
        this.ctx = ctx
        this.particles = []

        // 开始动画
        this.startFireworks()
      })
  },

  startFireworks() {
    this.createFirework()
    // 使用canvas.requestAnimationFrame
    this.animate(this.canvas)
  },

  animate(canvas) {
    // 清除画布
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)'
    this.ctx.fillRect(0, 0, this.windowWidth, this.windowHeight)

    // 设置混合模式
    this.ctx.globalCompositeOperation = 'lighter'

    // 更新和绘制粒子
    const alive = []
    for (const particle of this.particles) {
      if (particle.move()) {
        particle.draw(this.ctx)
        alive.push(particle)
      }
    }
    this.particles = alive

    // 随机创建新烟花
    if (this.particles.length < 100 && Math.random() < 0.1) {
      this.createFirework()
    }

    // 使用canvas.requestAnimationFrame
    this.animationFrameId = canvas.requestAnimationFrame(() => {
      this.animate(canvas)
    })
  },

  createFirework() {
    const xPoint = Math.random() * (this.windowWidth - 200) + 100
    const yPoint = this.windowHeight - 100
    const nFire = Math.random() * 50 + 100
    const color = `rgb(${~~(Math.random()*200+55)},${~~(Math.random()*200+55)},${~~(Math.random()*200+55)})`

    for (let i = 0; i < nFire; i++) {
      const particle = new Particle(xPoint, yPoint, color, this.canvas)
      this.particles.push(particle)
    }
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
        hasSignedUp: true,
        showFireworks: true 
      }, () => {
        this.initCanvas()
      })

      // 将时间从3秒改为1秒
      setTimeout(() => {
        if (this.animationFrameId) {
          this.canvas.cancelAnimationFrame(this.animationFrameId)
        }
        this.setData({ showFireworks: false })
      }, 1000)

      wx.showToast({
        title: '报名成功',
        icon: 'success'
      })
    })
  },

  // 取消报名
  cancelSignup() {
    const currentRole = app.globalData.role
    const { weekNumber: currentWeek, year: currentYear } = getCurrentWeekInfo()

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
  }
})

// 粒子类
class Particle {
  constructor(x, y, color, canvas) {
    this.w = this.h = Math.random() * 4 + 1
    this.x = x - this.w / 2
    this.y = y - this.h / 2
    this.vx = (Math.random() - 0.5) * 15  // 增加水平速度
    this.vy = (Math.random() - 0.5) * 15  // 增加垂直速度
    this.alpha = Math.random() * 0.5 + 0.5
    this.color = color
    this.gravity = 0.1  // 增加重力效果
    this.canvas = canvas
  }

  move() {
    this.x += this.vx
    this.vy += this.gravity
    this.y += this.vy
    this.alpha -= 0.02  // 加快消失速度

    return this.alpha > 0 &&
           this.x > -this.w &&
           this.x < this.canvas.width &&
           this.y < this.canvas.height
  }

  draw(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.translate(this.x + this.w/2, this.y + this.h/2)
    ctx.arc(0, 0, this.w, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.alpha
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
} 
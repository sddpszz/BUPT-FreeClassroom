const app = getApp()
import api from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    build: ["教三楼", "教四楼", "教二楼", "教一楼"],
    buildIndex: 0,
    checkboxItems: [
      { name: '08:00-09:00', value: '1' },
      { name: '09:00-10:00', value: '2' },
      { name: '10:00-11:00', value: '3' },
      { name: '11:00-12:00', value: '4' },
      { name: '13:30-14:30', value: '5' },
      { name: '14:30-15:30', value: '6' },
      { name: '15:30-16:30', value: '7' },
      { name: '16:30-17:30', value: '8' },
      { name: '18:30-20:30', value: '10' },
      { name: '20:30-22:30', value: '11,12' }
    ]
  },
  getToday: function (todayClassName) {
    api.getToday({
      query: {
        name: todayClassName
      },
      success: (res) => {
        let today = res.data
        let todayWeek = api.todayInfo(res.data.startTime)
        //let todayWeek = api.todayInfo("2018/4/6")
        this.setData({ todayWeek })
      }
    })
  },
  buildPicker: function (e) {
    this.setData({
      buildIndex: e.detail.value
    })
  },
  checkboxChange: function (e) {
    let checkboxItems = this.data.checkboxItems, values = e.detail.value
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    let checkboxValues = values.join(',')
    this.setData({ checkboxItems, checkboxValues })
  },
  searchRoom: function () {
    if (!this.data.checkboxValues) {
      wx.showModal({
        content: '请选择要查询的时间段',
        showCancel: false
      })
    } else {
      if (this.data.todayWeek.week > 24) {
        wx.showModal({
          content: '24周之后不提供空闲教室查询功能',
          showCancel: false
        })
      } else {
        
        wx.navigateTo({
          url: '../search/room/index?build=' + this.data.build[this.data.buildIndex] + '&section=' + this.data.checkboxValues + '&day=' + this.data.todayWeek.day + '&week=' + this.data.todayWeek.week
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToday('freeroom')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '西土城路10号空教室查询',
      desc: '「西土城路10号空教室查询」提供北京邮电大学在校生空闲教室查询服务。',
      path: '/pages/index/index'
    }
  }
})
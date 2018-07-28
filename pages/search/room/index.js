const app = getApp()
import api from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    teachBuilding:""
  },

  getRoom: function (options) {
    that = this

    var sections = options.section.split(",")
    var buildings = {
      "教一楼": "0",
      "教二楼": "1",
      "教三楼": "2",
      "教四楼": "3"
    }

    var freebuildings = {
      "教一楼": "教室：1-",
      "教二楼": "教室：2-",
      "教三楼": "教室：3-",
      "教四楼": "教室：4-"
    }
    

    var st = new Set()
    var sec, x, y
    var count = 0
    var flag = false
    for (var k = 0; k < sections.length; k++) {
      wx.request({
        url: "https://webapp.bupt.edu.cn/w_clsroom/default/search",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: json2Form({ zc: options.week, xq: options.day, ksjc: sections[k] }),
        complete: function (res) {
          count += 1
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
          if (!(buildings[options.build] in res.data.data.data) || flag == true) {
            flag = true
            st.clear()
          } 
          else 
          {
            var classroom = res.data.data.data[buildings[options.build]].data         
            if (st.size == 0) {
              for (var i = 0; i < classroom.length; i++) {
                st.add(classroom[i]);
              }
            } else {
              var temp = new Set()
              for (var i = 0; i < classroom.length; i++) {
                if (st.has(classroom[i])) temp.add(classroom[i])
              }
              st.clear()
              for (var x of temp) {
                st.add(x)
              }
            }
          }
        }
      })
    }
    var timer = setInterval(function () {
      // console.log("循环定时器等待循环请求结束")
      // console.log("count:" + count)
      // console.log("sections.length:" + sections.length)
      if (count == sections.length) {
        if (flag){
          wx.showModal({
            content: '抱歉，无空闲教室',
            showCancel: false,
            complete: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
        let listData = Array.from(st)
        let teachBuilding = freebuildings[options.build]
        that.setData({ listData, teachBuilding })
        clearInterval(timer);
      }
    }
      , 500)
  },
  backIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRoom(options)
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
      title: '空闲教室查询结果',
      path: '/pages/search/room/index?build=' + this.options.build + '&section=' + this.options.section + '&day=' + this.options.day + '&week=' + this.options.week
    }
  }
})

var that;
function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
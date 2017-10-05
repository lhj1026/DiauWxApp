var app = getApp()
Page({
  data: {
    userInfo: {},
    list: [
      {
        list_tool: [
          {
            img: "../../res/image/photo.png",
            name: "报告",
            
          },
          {
            img: "../../res/image/sc_2.png",
            name: "历史问题",
            url: "../logs/logs"
          }
        ]
      },
      {
        list_tool: [
          {
            img: "../../res/image/money.png",
            name: "饮食",
            
          },
          {
            img: "../../res/image/card.png",
            name: "运动",
            
          }
        ]
      },
      {
        list_tool: [
          {
            img: "../../res/image/about.png",
            name: "关于戴友",
            url: "../about/about"
          },
          {
            img: "../../res/image/setting.png",
            name: "设置",
            
          }
        ]
      },
    ]
  },
  goUserDetail: function(){
    wx.navigateTo({
      url: "../userDetail/userDetail"
    })
  },
  goPage: function (event) {
    console.log(event.currentTarget.dataset.log);
    wx.navigateTo({
      url: event.currentTarget.dataset.url
    })
  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onLoad: function () {
    // wx.showNavigationBarLoading();
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo: app.globalData.userInfo
    })
  }
})

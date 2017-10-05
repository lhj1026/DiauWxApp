
var app = getApp()
Page({
  data: {
    userInfo: {},
    userDetail:null,
    infoChanged:{},
    list: [
      { 
        list_tool:[ 
          {
            text: "年龄",
            name:'age',
            value: ''
          },
          {
            text: "性别",
            name: 'gender',
            value: ''
          },
          {
            name: 'height',
            text: "身高",
            value: ''            
          },
          {
            name: 'weight',
            text: "体重",
            value: ''
            
          },
          {
            name: 'glucose1',
            text: "空腹血糖",
            value: ''
          },
          {
            name: 'glucose2',
            text: "餐后血糖",
            value: ''
          },
          {
            name: 'bloodhigh',
            text: "收缩压",
            value: ''            
          },
          {
            name: 'bloodlow',
            text: "舒张压",
            value: ''            
          }
        ]}
    ] 
   },
    


  onLoad: function () {
    // wx.showNavigationBarLoading();
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo,
      userDetail: app.globalData.userDetail
    })
  },

  inputchange: function (e) {

    var that = this;
    if (e.detail.value != app.globalData.userDetail[e.currentTarget.id]) 
    {
      var changedField = [{
        name: e.currentTarget.id,
        value: e.detail.value
      }];
      that.infoChanged = changedField.concat(that.infoChanged);

      app.globalData.userDetail[e.currentTarget.id] = e.detail.value;
    }
  },
  onUnload: function (e) {
    var that = this;
    
    //remove the undefined item
    
    if(that.infoChanged!==undefined)
    {
      that.infoChanged = that.infoChanged.filter(function (val) { return val !== undefined; });
        if (that.infoChanged.length>0)
        {
          wx.request(
            {
              url: "https://www.diau.me/diauweb/api.php?apicall=updateuserinfo",
              method: 'get',
              data: {
                openID: app.globalData.userId,
                datainfo:  that.infoChanged
              },
              header:
              {
                'Content-Type': 'application/json'
              },
              
              success: function (json) {
                console.log(app.globalData.userId);
                console.log(that.infoChanged);
                console.log(json);
              }
            })
          }
    }
  },

}

)

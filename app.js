//app.js
//var userId = "";
App({
  loadingHidden: true,
  globalData: {
   session : null,
   userId : "",
   userInfo : null,
   nickname: "",
   userDetail: null
   
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    
    //增加等待动画
 /*   that.setData({
      loadingHidden: false
    });
   
    setTimeout(function () {
      that.setData({
        loadingHidden: true
      }),
      that.update()
    }, 1500);
  
   */ 
    wx.login(
      {
        success: function (res) 
        {
          if (res.code) 
          {
            //取得openID
            wx.request(
              {
                url: "https://www.diau.me/diauweb/api.php?apicall=saveOpenId",
                data:
                {
                  code: res.code
                },
                success: function (json) 
                {                  
                  
                  //console.log(json)
                  var strJson = json.data.replace("[]","")
                                   
                  strJson=JSON.parse(strJson)
                  that.globalData.userId = strJson.data.openid
                  
                  //本地缓存session
                  wx.setStorage({
                      key: "session",
                      data: strJson.data.session
                    })
                  wx.getStorage({
                      key: 'session',
                      success: function (res) 
                      {
                        that.globalData.session = res.data
                      }
                    })
                  //console.log("json.code: ",strJson.code)
                  if (strJson.code=="0")
                  {
                    wx.getUserInfo(
                    {
                      success: function (res) 
                      {
                        var userInfo = res.userInfo;
                        var nickName = userInfo.nickName;
                        that.globalData.userInfo = userInfo;
                        that.globalData.nickname = userInfo.nickName;
                        //console.log("gloalData", that.globalData);
                        var avatarUrl = userInfo.avatarUrl;
                        var gender = userInfo.gender; //性别 0：未知、1：男、2：女 
                        var province = userInfo.province;
                        var city = userInfo.city;
                        var country = userInfo.country;
                        var language = userInfo.language;
                        var openID = that.globalData.userId;
                        //console.log("res.userInfo:",res.userInfo);
                        //console.log(openID)
                        //把用户信息给后台发送过去
                        wx.request(
                        {
                            url: "https://www.diau.me/diauweb/api.php?apicall=signup",
                            method: 'post',
                            data:
                            {
                              nickname: nickName,
                              gender: gender,
                              headimg: avatarUrl,
                              country: country,
                              province: province,
                              city: city,
                              language: language,
                              openID: openID
                            },
                            header:
                            {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (json) {
                              //console.log(json);
                              strJson = json.data.replace("[]", "");
                              strJson = JSON.parse(strJson);
                              
                              that.globalData.userDetail = strJson.user;
                              //console.log(that.globalData.userDetail);
                            }
                        })
                      }
                    })
                  }
                  else
                  {
                    console.log(json.data)
                  }
                }
              })
          } else 
          {
            console.log("获取用户登录态失败！" + res.errMsg);
          }
        }
      })
  },
  
  getUserInfo: function (cb) {
    var that = this;

    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login(
        {
          success: function () {
            wx.getUserInfo(
              {
                success: function (res) {
                  that.globalData.userInfo = res.userInfo;
                  typeof cb == "function" && cb(that.globalData.userInfo);
                }
              })
          }
        })
    }
  },


})



var app = getApp();
var util = require('../../utils/util.js');

var sp = '';
var tem = '';
var ajax = [];
var that = this;
var speakarr = [
 // { name: "me", say: "今天一起去看电影吧", path: '', model: '' },
  { name: "other", say: "欢迎使用DiaU戴友健康小程序", path: '', model: '',model1:'',model2:'' }
];
//专为闹闹钟确定设计的变量
var alertData = {
  remind_date: '',
  remind_time: '',
  remind_content: ''
};


Page(
  {
    data: {
      prior_notice: ['不提醒', '5分钟', '10分钟', '15分钟'],
      prior_notice_index: 0,
      Repeat_notice: ['不重复', '2次', '3次'],
      Repeat_notice_index: 0,
      head_other: '../../res/image/user_default.png',
      head_me: '',
      speak: speakarr,
      sendicon: 'icon-audio',
      ipt: true,
      clear: '',
      scrollTop: '10000',
      alert: '../../res/image/alert.jpg',
      select: '../../res/image/select.jpg',
      clockSave: "确定"
    },
    //提前时间下拉框
    bindNoticeChange: function (e) {
      alertJs.prior_notice = e.detail.value;
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        prior_notice_index: e.detail.value
      })
    },

    //重复次数下拉框
    bindRepeatChange: function (e) {
      alertJs.repeat_notice = e.detail.value;
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        Repeat_notice_index: e.detail.value
      })
    },
    //调用自己微信头像
    bindViewTap: function () {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },

    onLoad: function () {
      var that = this
      app.getUserInfo(function (userInfo) {
        that.setData({
          userInfo: userInfo
        })
      })
    },


    //语音与输入切换
    changeico: function () {
      if (this.data.sendicon == 'icon-audio') {
        this.setData({
          sendicon: 'icon-jianpan',
          ipt: false
        })
      } else {
        this.setData({
          sendicon: 'icon-audio',
          ipt: true
        })
      }
    },

    //输入文字时，将文字取出，放置全局变量中
    speakchange: function (e) {
      sp = e.detail.value;
    },

    //点击发送，推入new的data中的speakarr中，并且setData
    dosend: function () {
      var that = this;
      var newDate= new Date();
      
      sp = sp.replace(/(^\s*)|(\s*$)/g, "");

      if (sp != '') {
        var count = speakarr.length;
        var newsp = { name: 'me', say: sp, path: '' };
        speakarr.push(newsp);
        that.setData({ clear: '  ', scrollTop: '1000000' });//如果不改变clearclear，那么下边clear他不会执行
        that.setData({ speak: speakarr, clear: ' ' });
        that.setData({ scrollTop: '10000000' });
        
        //console.log("openid:", app.globalData.userId);
        //console.log("nickname:", app.globalData.userInfo.nickName);


        wx.request({
          url: 'https://www.diau.me/diauweb/api.php?apicall=writeMsg',
          method: 'post',
          data: {
            content: sp,
            openid: app.globalData.userId,
            time:   newDate.toString(),
            session: String(app.globalData.session),
            nickname: app.globalData.nickname
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          
          success: function (json) {
            /*console.log("content:", sp);
            console.log("openid", app.globalData.userId);
            console.log("time", newDate.toString());
            console.log("nickname", app.globalData.nickname);*/
            var str = '';
            var says = '';
            var strJson = json.data.replace("[]", "");
            //console.log(strJson);
            strJson = JSON.parse(strJson);
            if (strJson.data.status != 0) 
            {
              //console.log("message:", strJson.data.msg);
              str = strJson.data.msg;
              says = { name: "other", say: str, path: '', model: strJson.data.model, menu: strJson.data.menu};
            } 
            else 
            {
              str = "没明白您什么意思，您想？";
              says = { name: "other", say: str, path: '', model: strJson.data.model, menu: strJson.data.menu};
            }

            var newrsp = says;
            speakarr.push(newrsp);
            sp = '';
            that.setData({ speak: speakarr,scrollTop: '100000000' });
            
          }
        })
      } else {
        that.setData({ clear: '' });
       
      }

    },
   
    //录音开始
    audiostart: function () {
      wx.showToast({
        title: '正在录音...',
        icon: 'loading',
        duration: 10000
      });
      //微信录音开始接口
      var that = this;
      wx.startRecord({
        success: function (res) {
          tem = res.tempFilePath;
          wx.saveFile({
            tempFilePath: tem,
            success: function (res) {
              var savedFilePath = res.savedFilePath;
              tem = savedFilePath;
              console.log(tem);
              var length = speakarr.length;
              speakarr[length - 1] = { name: 'me', say: "(((　　　", path: tem, model: '' };
              console.log(speakarr);
              that.setData({ scrollTop: '1000000' });
              that.setData({ speak: speakarr });
              that.setData({ scrollTop: '10000000' });
            }
          })
        }
      })

    },


    //录音结束
    audioend: function () {
      //弹窗消失
      wx.hideToast({
        title: '正在录音...',
        icon: 'loading'
      });
      wx.stopRecord();
      //用于对话框显示
      var newsp = { name: 'me', say: "(((", path: '' };
      speakarr.push(newsp);

    },


    //点击录音
    play: function (e) {
      var path = e.currentTarget.dataset.path;
      if (path != "") 
      {
        wx.playVoice({
          filePath: path
        })
      }
    }
  })
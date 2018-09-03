//index.js
//获取应用实例
const app = getApp();


Page({
  data: {
    motto: '一点文章',
    userInfo: '',
    noteText:'',
    art_id:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
     //头像登录
    wx.navigateTo({ url: '../main/main?art_id=' + this.data.art_id});
  },
  onShow: function (e) {
    //wx.navigateTo({ url: '../yidian/yidian' });
    this.setData({
      noteText: ''
    });
    this.getNote();
    let _this = this ;
    if (this.data.hasUserInfo && this.data.userInfo ){
      setTimeout(function(){
       // wx.navigateTo({ url: '../main/main?art_id=' + _this.data.art_id});
      },3000)
    
    }
  },
  onLoad: function (e) {
    let that =this ;
    let art_id ='';
    var arr = Object.keys(e);
    if(arr.length !=0){
      art_id = e.art_id;
    };
   
    this.setData({
      art_id: art_id
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo ,
        hasUserInfo: true
       
      });
      wx.navigateTo({ url: '../main/main?art_id=' + art_id });
    } else if (this.data.canIUse){
      //console.log('222222222222222222222222222222');
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        //console.log('33333333333333333333333333');
        //console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        app.globalData.userInfo = res.userInfo;
        wx.navigateTo({ url: '../main/main?art_id=' + art_id });
      }
    }else{
      //console.log('66666666666666666666666666666666666666');
    }


  },
  onHide: function () {
    this.setData({
      art_id:''
    });
  },
  //检查用户登陆 或添加用户
  getUser: function(e) {
    //console.log('44444444444444444444444');
   // console.log(e);
    if(e.detail.errMsg.indexOf('fail')>-1){
      this.setData({
        hasUserInfo: false
      });
      return false;
    }
    this.userLogin(e.detail);
  },
  userLogin:function(e){
    var that = this;
    var code = wx.getStorageSync('loginCode');
    wx.request({
      method: 'POST',
      data: { "code": code, "userInfo": e },
      url: app.globalData.requestUrl + 'yidian-wx_login', //仅为示例，并非真实的接口地址
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showToast({ title: '登录失败请重试', icon: 'none', duration: 2000, mask: false })
        } else {
          var resu = res.data;
          if (resu.code == '200') {
            that.setData({
              userInfo: e.userInfo,
              hasUserInfo: true
            });
            app.globalData.userInfo = e.userInfo;
            wx.setStorageSync('openid', resu.openid);
            wx.navigateTo({ url: '../main/main?art_id=' + that.data.art_id });
          } else {
            wx.showToast({ title: '登录失败请重试', icon: 'none', duration: 2000, mask: false })
          }

        }
      }

    });
  },
  //获取推荐段子数据
  getNote: function () {
    var _this = this;
    _this.setData({ loading: true });
    wx.request({
      method: 'POST',
      url: app.globalData.requestUrl + 'get_today_note', //每天演示
      success: function (result) {
        if (result.statusCode != 200) {
          _this.setData({
            loading: false,
            noteText: ''+result.node || '遇见你，真美好'
          });
          return ;
        }
        var noteDa = result.data;
        if (noteDa.status == 200) {
          _this.setData({
             loading: false,
             noteText: noteDa.node || '遇见你，真美好'
           });
        } else {
          _this.setData({
             loading: false,
            noteText: '遇见你，真美好'
           });
        }
         
      }  
      

    });
  }
  
})

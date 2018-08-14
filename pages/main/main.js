// pages/main/main.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
var utils = require("../../utils/util.js");
Page({
  data: {
    open: false,
    mark: 100, //滑动距离
    shareList:["朋友圈","好友"],
    isShareShow:false,
    newmark:'',
    qcodeUrl:'',
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '', //默认不展开
    click_type:'', //点击事件
    userInfo: {},
    titCon: {}, //文章内容
    momentData:[],//评论内容
    collect:'../../img/cli.png',
    collect_type: '1',
    bottomMenu:false,//菜单
    endFlag:false,
    mommentFlag:false, //评论
    borwer_num:'', //流量
    shareTwo: {
      avatar: '',
      nickname: '',
      incomeMoney: '',
      joinNumber: '',
      joinAvatarList: '',
      adImageUrl: '',
      adName: '',
      ermUrlPath:'pages/main/main',
      adTime: '',
      showShareModel: false
    },
  
  },
  onLoad:function(res){
    console.log(res);
    let arr  = Object.keys(app.globalData.userInfo);
  
    if (arr.length == 0){
      arr ={};
    }
    this.setData({
      userInfo: arr
    })
     console.log('res.art_id');
     console.log(res);
    //获取文章内容
    if (!res){
      res={};
     }
    this.getDataList(res.art_id||'');
    //this.shareFriend();
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    
    this.setData({
      userInfo: app.globalData.userInfo,
      bottomMenu: true//菜单
    })
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      translate: 'c-state2',
      click_type: ''
     
    });


  },
  onPageScroll: function (e) { // 获取滚动条当前位置
   // ////console.log('滚动条')
    //////console.log(e)
  },
  //添加浏览
  add_brower:function(art_id){
    var that = this;
    wx.request({
      method: 'POST',
      data: { "openid": wx.getStorageSync('openid'), 'art_id': art_id },
      url: app.globalData.requestUrl + 'yidian-add_art_bower', //仅为示例，并非真实的接口地址
      success: function (res) {
        if (res.statusCode != 200) {
          return false ;
        }
        var resu = res.data;
        if (resu.code != 200) {
          return false;
        }
        that.setData({
          borwer_num: Number(that.data.borwer_num)+1
        });

      }
    });

  },

  getDataList: function (art_id) {
   var that = this ;
    that.setData({
      titCon: {},
      momentData: []
    });
    wx.request({
      method:'POST',
      data: { "openid": wx.getStorageSync('openid'), 'art_id': art_id},
      url: app.globalData.requestUrl +'yidian-get_index_article', //仅为示例，并非真实的接口地址
      success: function (res) {
        that.setData({
          bottomMenu: true
        });
        ////console.log(res);
        if (res.statusCode !=200){
          wx.showToast({title: '出错啦',icon: 'none',duration: 2000,mask: false})
        }else{
          var resu = res.data;
          if(resu.code !=200){
            wx.showToast({ title: '未更新哦', icon: 'none', duration: 2000, mask: false })
          }else{
            
            if (!resu.data.img){
              resu.data.img='../../img/img1.jpg';
            }
            that.setData({
              titCon: resu.data,
              borwer_num: resu.data.brower_num
             
            });
            if (resu.data.collect_type == 2) {
              that.setData({
                collect: '../../img/shoucying.png',
                collect_type: '2'
              });
            } else {
              that.setData({
                collect: '../../img/cli.png',
                collect_type: '1'
              });
            }
            WxParse.wxParse('article', 'html', resu.data.content, that, 15);
            
            that.setData({
              bottomMenu: true,
              endFlag:true,
              momentData: resu.moment
            });
           //添加浏览
            that.add_brower(resu.data.art_id);
          }
         
        }
        
      }
    })
   
    
  },
  //菜单点击 主菜单
  menuTap:function(e){
   
    var type = e.currentTarget.dataset.type; //自定义菜单  
    if(type == 1){
     
      wx.redirectTo({ url: '../art/list' }); //历史列表

    } else if (type == 2){
      wx.redirectTo({ url: '../collect/list' }); //收藏列表
    } else if (type == 3) {
      wx.redirectTo({ url: '../yidian/yidian' }); //收藏列表
    }else {
      wx.showToast({
        title: '努力开发中...',
        icon: 'none',
        duration: 2000,
        mask: false
      })
    }
  },
  //底部菜单点击
  collectTap: function (e) {
    var type = e.currentTarget.dataset.menutype; //自定义菜单  
    if (type == '1') {
      this.collectUp();
    } else if (type == '2') {
      //////console.log(1);
      this.setData({
        mommentFlag:true
      });
      
    } else if (type == '3') {
      //////console.log(1);
      let isShow = this.data.isShareShow ? false:true;
      this.setData({
        isShareShow: isShow
      });

    }else{
      wx.showToast({
        title: '努力开发中...',
        icon: 'none',
        duration: 2000,
        mask: false
      })
    }
  },
  collectUp:function(){
    var that = this ;
    wx.request({
      method: 'POST',
      data: { "openid": wx.getStorageSync('openid'), "art_id": that.data.titCon.art_id},
      url: app.globalData.requestUrl + 'yidian-up_collect', //仅为示例，并非真实的接口地址
      success: function (res) {
          if (res.statusCode != 200) {
            wx.showToast({ title: '出错啦', icon: 'none', duration: 2000, mask: false })
          } else {
            var resu = res.data;
            if (resu.code != 200) {
              wx.showToast({ title: '失败啦', icon: 'none', duration: 2000, mask: false })
              return false ;
            }
            if (resu.collect_type == '2') {
              that.setData({
                collect: '../../img/shoucying.png',
                collect_type: '2'
              });
            } else {
              that.setData({
                collect: '../../img/cli.png',
                collect_type: '1'
              });
            }
         }
      }
    });
  },
  //评论
  bindFormSubmit:function(e){
    var _this = this;
    _this.setData({
      mommentFlag: false  //评论关闭
    });
   
    var text = e.detail.value.textarea;
    var art_id = e.currentTarget.dataset.art_id; //自定义菜单  
    if(!text){
      return false ;
    }
    _this.mommentFunc(text, art_id);

  },
  bindconfirm: function (e) {
    var _this = this;
    _this.setData({
      mommentFlag: false  //评论关闭
    });

    var text = e.detail.value;
    var art_id = e.currentTarget.dataset.art_id; //自定义菜单  
    if (!text) {
      return false;
    }
   
    _this.mommentFunc(text, art_id);

  },
  mommentFunc: function (text, art_id){
    var _this =this ;
    wx.request({
      method: 'POST',
      data: { "openid": wx.getStorageSync('openid'), 'art_id': art_id,"text":text},
      url: app.globalData.requestUrl + 'yidian-up_art_moment',
      success: function (res) {
     
        if (res.statusCode != 200) {
          wx.showToast({ title: '出错啦', icon: 'none', duration: 2000, mask: false });
          return false;
        } 
        var resu =res.data;
        if (resu.code !=200){
          wx.showToast({ title: '出错啦', icon: 'none', duration: 2000, mask: false });
          return false;
        }
        //追加一条评论
        var momentDa ={
          avatar_url: _this.data.userInfo.avatarUrl,
          nick_name: _this.data.userInfo.nickName,
          reply: text
        };
        var momentList=[];
        momentList.push(momentDa);
        var momentData = _this.data.momentData;
        momentData = momentList.concat(momentData);
        ////console.log(momentData);
        _this.setData({
          momentData: momentData
        });
        wx.showToast({ title: '评论成功', icon: 'none', duration: 2000, mask: false });

      }
    })

  },
  


  //分享功能
  onShareAppMessage: function (res) {
    var that =this ;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    
    }
    that.setData({
      isShareShow:false
    })
    ////console.log(2222);
    return {
      title: that.data.titCon.title,
      path: '/pages/index/index?art_id=' + that.data.titCon.art_id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000,
          mask: false
        })
      },
      fail: function (res) {
        // 转发失败
        console.log('22222222222');
        that.setData({
          isShareShow: false
        });
      }
    }
  },


  //图片div点击
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'c-state2',
         click_type: '' 
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'c-state1',
        click_type: ''
      })
      this.data.open = true;
    }
  },
  
  tap_drag: function (e) {
    this.data.newmark = e.touches[0].pageX;
    if(this.data.mark < this.data.newmark){
      if (this.data.open) {
        this.setData({
          translate: 'c-state2',
          click_type: ''
        })
      }
      this.data.open = false;
    }
  
  },
  /*下载动态二维码地址**/
  getAccToken(){
    let _this = this ;
    if (!this.data.titCon.art_id){
      wx.showToast({ title: '出错了,请重试', icon: 'none', duration: 2000, mask: false });
      return false;
    }
    let userInfo = this.data.userInfo;
    if (!userInfo){
      wx.showToast({ title: '请先登录', icon: 'none', duration: 2000, mask: false });
      wx.redirectTo({ url: '../index/index' }); //收藏列表
      return false;
    }



    wx.request({
      method: 'POST',
      data: { 'ermUrlPath': "pages/main/main?art_id=" + this.data.titCon.art_id, "art_id": this.data.titCon.art_id },
      url: app.globalData.requestUrl + 'yidian-getNewQcode', //
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showToast({ title: '出错啦', icon: 'none', duration: 2000, mask: false });
          return false;
        }
        var resu = res.data;
        if (!resu.urlData.imgurl){
          wx.showToast({ title: '获取程序码失败！', icon: 'none', duration: 2000, mask: false });
          return false;
        }
        _this.shareFriend(resu.urlData.imgurl);
        if (resu.code != 200) {
          wx.showToast({ title: '出错啦', icon: 'none', duration: 2000, mask: false });
          return false;
        }
       
    
      }
    })
  },
 

  /**朋友圈 */
  shareFriend: function (qcodeURL) {
    let userInfo = this.data.userInfo;
    let defaultImg = '../../11.jpg';
    userInfo.avatarUrl = userInfo.avatarUrl ? userInfo.avatarUrl : defaultImg;
    userInfo.nickName = userInfo.nickName ? userInfo.nickName : '一点 ';
    
    let title = this.data.titCon.title.length > 19 ? this.data.titCon.title.substr(0, 15)+'...' : this.data.titCon.title;
    
    let adImg = this.data.titCon.ad_img ? this.data.titCon.ad_img :"../../img/img3.jpg";
  
    this.setData({
      isShareShow: false,
      shareTwo: {
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickName,
        incomeMoney: this.data.borwer_num ? this.data.borwer_num : 6888, //阅读
        joinNumber: '0',
        joinAvatarList: [],
        ermUrlPath: qcodeURL, //动态二维码地址
        adImageUrl: adImg, //广告地址
        adName: title, //文章名称
        adTime: utils.formatTime(new Date()),
        showShareModel: true
      }
    })

  },

  tap_end: function (e) {

  }
 
})
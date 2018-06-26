//index.js
/***
 * @author yidain
 * @date 2017-05-16
 * @desc 你是列表
 *       
 */
var app = getApp()
Page({
  data: {
    loading: true,//显示loading
    page:1,
    moreLing:false,
    moreLing_text: '您还未收藏文章哦',
    scroll_height:500,
    textData: [] //list,

  },
  //加载
  onLoad: function () {
    //console.log('111111111111111111111111111');
    var that = this ;
    //获取数据
    wx.getSystemInfo({
      success: function (res) {
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scroll_height: res.windowHeight
        })
      }
    })

    this.getVideoList();
  },
  //dom
  onShow: function () {
    
  },
  //获取推荐段子数据
  getVideoList: function (type) {
    var _this = this;
    _this.setData({loading: true});
    var page = _this.data.page ;
    wx.request({
      method: 'POST',
      data: { "page": page,"openid":wx.getStorageSync('openid')},
      url: app.globalData.requestUrl + 'yidian-get_collect_article', //仅为示例，并非真实的接口地址
      success: function (result) {
        var textNewData = [];
        if (result.statusCode == 200) {
          if (result.data.code !=200) {
            var moreLing_text = '您还未收藏文章哦';
            if (page > 1) {
              page = page - 1;
              moreLing_text = '我是有底线的哦';
            }
            _this.setData({
              page: page ,
              moreLing: true,
              moreLing_text: moreLing_text,
              loading: false
            });
            return false ;
          }
          textNewData = result.data.data;
          if (textNewData){

          }
          if (type != "up") {
            textNewData = _this.data.textData.concat(textNewData);
          } 
          _this.setData({
            moreLing: false,
            textData: textNewData,
            loading: false
          });
        }else{
          _this.setData({
            page: page,
            moreLing: true,
            loading: false
          });
        }
      }

    });
  },
  //滚动到顶部
  upper: function (e) {
    // var _this = this;
    // _this.setData({
    //   page: 1
    // });
    // this.getVideoList("up");

  },
  //滚动到底部
  lower: function (e) {
    var _this = this;
    var page = _this.data.page + 1 ;
    _this.setData({
      page: page
    });
    this.getVideoList();
  }
})
const app = getApp().globalData
Page({

  data: {
    hotSearchList: [],
    singers: [],
    result: false,
    singerPic: '',
    singerName: '',
    singers: [],
    songs: [],
    selectsingerId:''
  },

  onLoad: function(options) {
    this.getHotSearch();
  },

  //获取热门搜索
  getHotSearch: function() {
    const _that = this;
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&jsonpCallback=hotSearchKeysmod_top_search&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
      success(res) {
        if (res.statusCode === 200) {
          var content = res.data.replace("hotSearchKeysmod_top_search(", "");
          var reg_content = JSON.parse(content.replace(")", ""));
          var hotkey = reg_content.data.hotkey;
          _that.setData({
            hotSearchList: hotkey.length > 10 ? hotkey.slice(0, 10) : hotkey
          })
        }
      }
    })
  },

  searchAction: function(event) {
    const key = event.detail.value || event.currentTarget.dataset.txt
    const _that = this
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=${key}g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_top_search3847&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
      data: {
        key: key
      },
      success(res) {
        let res1 = res.data.replace('SmartboxKeysCallbackmod_top_search3847(', '')
        let res2 = JSON.parse(res1.substring(0, res1.length - 1))
        _that.setData({
          result: true,
          singers: res2.data.singer.itemlist,
          songs: res2.data.song.itemlist
        })
      }
    })
  },

  searchSinger:function(event){
    const detail = event.currentTarget.dataset
    app.selectsingerId = detail.id
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  }
})
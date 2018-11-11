const app = getApp().globalData
Page({

  data: {
    name: 'Muggle',
    albumList: [],
    slider: [],
    songList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 3000,
    duration: 500,
    listImg: ['../../images/single.png', '../../images/ranking4.png', '../../images/radio.png', '../../images/classify.png', '../../images/MV.png', '../../images/album.png']
  },
  goSearch: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  bannerMusic: function(event) {
    wx.navigateTo({
      url: '/pages/top-music/top-music',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取热门歌单推荐
  getHotMusicRecommend: function() {
    const _that = this;
    wx.request({
      url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1&jsonpCallback=callback',
      success(res) {
        if (res.statusCode === 200) {
          var res1 = res.data.replace("callback(", "");
          var res2 = JSON.parse(res1.replace(")", ""));
          _that.setData({
            slider: res2.data.slider,
            songList: res2.data.songList
          })
        }
      }
    })
  },

  onOpenBanner: function() {
    wx.navigateTo({
      url: '../banner/banner'
    })
  },

  getAlbum: function(event) {
    var id = event.currentTarget.dataset.item.id
    app.topId = id
    wx.navigateTo({
      url: '../top-music/top-music'
    })
  },
  // 获取热门榜单推荐
  getHotAlbumRecommend: function() {
    const _that = this;
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=jp1',
      success(res) {
        var res1 = res.data.replace("jp1(", "");
        var res2 = JSON.parse(res1.replace("})", "}"));
        _that.setData({
          albumList: res2.data.topList
        })
      }
    })
  },

  onLoad: function(options) {
    this.getHotMusicRecommend();
    this.getHotAlbumRecommend();
  }
})
const app = getApp().globalData
Page({

  data: {
    title: '',
    topList: [],
    picture: ''
  },

  //跳转到播放页面
  toPlay: function(event) {
    app.mid = event.currentTarget.dataset.mid
    app.musicIndex = event.currentTarget.dataset.index
    wx.switchTab({
      url: '/pages/player/player'
    })
  },

  //获取热门榜单推荐
  getHotAlbumRecommend: function() {
    const _that = this
    const topId = app.topId
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=' + topId + '&needNewCode=1& uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp1',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        var res1 = res.data.replace('jp1(', '')
        var res2 = JSON.parse(res1.substring(0, res1.length - 1))
        var songList = res2.songlist
        app.songList = songList
       
        var songsMap = []
        var map = []
        // 设置map，key保存index，value保存songMid
        for (var songMid in songList) {
          map[songMid] = songList[songMid].data.songmid
          songsMap.push(map[songMid])
        }
        app.songsMap = songsMap
        _that.setData({
          title: res2.topinfo.ListName,
          picture: res2.topinfo.pic_album,
          topList: res2.songlist,
        })
        //设置导航栏标题文字内容
        wx.setNavigationBarTitle({
          title: res2.topinfo.ListName
        })
      }
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
 
  onLoad: function(options) {
    this.getHotAlbumRecommend();
  }
})
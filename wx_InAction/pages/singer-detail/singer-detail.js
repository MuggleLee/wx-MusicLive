const app = getApp().globalData
Page({

  data: {
    singerPic: '',
    songList: [],
    musicInfo: '',
    mediaMid: ''
  },

  onLoad: function(options) {
    this.getSingerDetail()
  },

  selectSong: function(event) {
    app.mid = event.currentTarget.dataset.txt
    app.musicIndex = event.currentTarget.dataset.index
    wx.switchTab({
      url: '/pages/player/player'
    })
  },
  getSingerDetail: function() {
    const _that = this
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=40&songstatus=1&singermid=${singermid}&jsonpCallback=callback',
      data: {
        singermid: app.selectsingerId
      },
      success(res) {
        var url = 'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + app.selectsingerId + '.jpg?max_age=2592000'
        var res1 = res.data.replace("callback(", "");
        var json = JSON.parse(res1.substring(0, res1.length - 1));
        var songList = json.data.list
        var songsMap = []
        var map = []
        // 设置map，key保存index，value保存songMid
        for (var songMid in songList) {
            songsMap.push(songList[songMid].musicData.songmid)
        }
        app.songsMap = songsMap
        app.songList = songList
        _that.setData({
          singerPic: url,
          songList: songList,
        })
        wx.setNavigationBarTitle({
          title: json.data.singer_name
        })
      }
    })
  }
})
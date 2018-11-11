const app = getApp().globalData
const Lyric = require('../../utils/lyric.js')
const SEQUENCE_MODE = 1
const RANDOM_MOD = 2
const SINGLE_CYCLE_MOD = 3
Page({
  data: {
    playurl: '',
    playIcon: 'icon-play',
    cdCls: 'pause',
    currentLineNum: 0,
    currentSong: null,
    currentDot: 0,
    playMod: SEQUENCE_MODE,
    songName: '',
    songPic: '',
    currentLyric: '',
    singerName: '',
    musicId: '',
    toLineNum: -1,
    dotsArray: new Array(2),
    musicDuration: '',
    songsLength: '',
    songsList: [],
    currentTime: '0:00'
  },

  onLoad: function() {},

  _init: function() {
    const that = this
    if (app.songList == undefined || app.songList == '') {
      return
    }
    let songslist = (app.songList.length && app.songList) || wx.getStorageSync('songlist')
    that.setData({
      songsList: songslist,
      songsLength: app.songList.length
    })
    this.getMusic()
    this._getPlayUrl(app.mid)
  },
  changeMod: function() {
    let playMod = this.data.playMod + 1
    if (playMod > SINGLE_CYCLE_MOD) {
      playMod = SEQUENCE_MODE
    }
    this.setData({
      playMod: playMod
    })
  },
  getMusic: function() {
    var musicInfo = []
    const _that = this;
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=${mid}&tpl=yqq_song_detail&format=jsonp&callback=getOneSongInfoCallback&g_tk=5381&jsonpCallback=getOneSongInfoCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
      data: {
        songmid: app.mid,
        tpl: 'yqq_song_detail',
        format: 'jsonp',
        callback: 'getOneSongInfoCallback',
        g_tk: 5381,
        jsonpCallback: 'getOneSongInfoCallback',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      success(res) {
        var res1 = res.data.replace("getOneSongInfoCallback(", "");
        var res2 = JSON.parse(res1.substring(0, res1.length - 1));
        var json = res2.data[0]
        var songPic = 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + json.album.mid + '.jpg?max_age=2592000'
        var musicId = json.mid
        _that.getLyricAction(musicId)
        app.songDuration = json.interval
        _that.setData({
          songName: json.name,
          songPic: songPic,
          singerName: json.singer[0].name,
          musicDuration: _that.formatTime(json.interval)
        })
      }
    })
  },

  // 去掉歌词中的转义字符
  _normalizeLyric: function(lyric) {
    return lyric.replace(/&#58;/g, ':').replace(/&#10;/g, '\n').replace(/&#46;/g, '.').replace(/&#32;/g, ' ').replace(/&#45;/g, '-').replace(/&#40;/g, '(').replace(/&#41;/g, ')')
  },

  //获取歌词
  getLyric: function(musicId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://route.showapi.com/213-2?showapi_appid=54411&musicid=' + musicId + '&showapi_sign=55b7ca99e210452a86269a9f09def34c',
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        }
      })
    })
  },

  //获取歌词操作，将转义的歌词存到currentLyric
  getLyricAction: function(musicId) {
    const _that = this
    _that.getLyric(musicId).then((res) => {
      if (res.data.showapi_res_body.ret_code == 0) {
        const lyric = _that._normalizeLyric(res.data.showapi_res_body.lyric)
        const currentLyric = new Lyric(lyric)
        _that.setData({
          currentLyric: currentLyric
        })
      } else {
        _that.setData({
          currentLyric: null,
          currentText: ''
        })
      }
    })
  },
  // 歌词滚动回调函数
  handleLyric: function(currentTime) {
    let lines = [{
        time: 0,
        txt: ''
      }],
      lyric = this.data.currentLyric,
      lineNum
    lines = lines.concat(lyric.lines)
    for (let i = 0; i < lines.length; i++) {
      if (i < lines.length - 1) {
        let time1 = lines[i].time,
          time2 = lines[i + 1].time
        if (currentTime > time1 && currentTime < time2) {
          lineNum = i - 1
          break;
        }
      } else {
        lineNum = lines.length - 2
      }
    }
    this.setData({
      currentLineNum: lineNum,
      currentText: lines[lineNum + 1] && lines[lineNum + 1].txt
    })

    let toLineNum = lineNum - 5
    if (lineNum > 5 && toLineNum != this.data.toLineNum) {
      this.setData({
        toLineNum: toLineNum
      })
    }
  },

  // 创建播放器
  _createAudio: function(playUrl) {
    wx.playBackgroundAudio({
      dataUrl: playUrl,
      title: this.songName,
      coverImgUrl: this.songPic
    })
    // 监听音乐播放
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        playIcon: 'icon-pause',
        cdCls: 'play'
      })
    })
    // 监听音乐暂停。
    wx.onBackgroundAudioPause(() => {
      this.setData({
        playIcon: 'icon-play',
        cdCls: 'pause'
      })
    })
    // 监听音乐停止。
    wx.onBackgroundAudioStop(() => {
      if (this.data.playMod === SINGLE_CYCLE_MOD) {
        this._init()
        return
      }
      this.next()
    })
    // 监听播放拿取播放进度
    const manage = wx.getBackgroundAudioManager()
    manage.onTimeUpdate(() => {
      const currentTime = manage.currentTime
      this.setData({
        currentTime: this._formatTime(currentTime),
        percent: currentTime / this.musicDuration
      })
      if (this.data.currentLyric) {
        this.handleLyric(currentTime * 1000)
      }
    })
  },

  _offPlay: function() {
    const innerAudioContext = app.innerAudioContext
    innerAudioContext.offPlay()
  },

  _pause: function() {
    const innerAudioContext = app.innerAudioContext
    innerAudioContext.pause()
    this.setData({
      playIcon: 'icon-play',
      cdCls: 'pause'
    })
  },

  prev: function() {
    this._offPlay()
    if (app.musicIndex < 1) {
      return
    }
    var preIndex = app.musicIndex - 1
    app.musicIndex = preIndex
    app.mid = app.songsMap[preIndex]
    this._init()
  },

  //跳转到下一首歌
  next: function() {
    this._offPlay()
    var nextIndex = app.musicIndex + 1
    if (nextIndex >= app.songsMap.length) {
      return
    }
    app.musicIndex = nextIndex
    app.mid = app.songsMap[nextIndex]
    this._init()
  },

  changeDot: function(e) {
    this.setData({
      currentDot: e.detail.current
    })
  },

  /*秒前边加0*/
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },
  formatTime: function(interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  close: function() {
    this.setData({
      translateCls: 'downtranslate'
    })
  },
  openList: function() {
    if (!this.data.songsList.length) {
      return
    }
    this.setData({
      translateCls: 'uptranslate'
    })
  },

  playthis: function(e) {
    app.mid = e.currentTarget.dataset.songmid
    app.musicIndex = e.currentTarget.dataset.index
    this._init()
    this.close()
  },

  togglePlaying: function() {
    wx.getBackgroundAudioPlayerState({
      success: function(res) {
        var status = res.status
        if (status == 1) {
          wx.pauseBackgroundAudio()
        } else {
          wx.playBackgroundAudio()
        }
      }
    })
  },

  // 获取播放地址
  _getPlayUrl: function(songmidid) {
    const _this = this
    wx.request({
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&loginUin=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&filename=C400${songmidid}.m4a&guid=3913883408&songmid=${songmidid}&callback=callback`,
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 0,
        filename: `C400${songmidid}.m4a`,
        guid: 3913883408,
        songmid: songmidid,
        callback: 'callback',
      },
      success: function(res) {
        var res1 = res.data.replace("callback(", "")
        var res2 = JSON.parse(res1.substring(0, res1.length - 1))
        const playUrl = `http://ws.stream.qqmusic.qq.com/C100${res2.data.items[0].songmid}.m4a?fromtag=0&guid=126548448`
        _this._createAudio(playUrl)
      }
    })
  },
  _formatTime: function(interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  onShow: function() {
    this._init()
  }
})
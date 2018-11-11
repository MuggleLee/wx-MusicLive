const HOT_NAME = '热门'
const HOT_SINGER_LEN = 15

function Singer(name, id) {
  this.id = id
  this.name = name
  this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
}
const app = getApp().globalData
Page({
  data: {
    toView: 0,
    currentIndex: 0,
    hotSingerList: {
      type: Array,
      value: []
    },
    shortcutList: []
  },

  //跳转到歌手详情页面
  toSingerDetail: function(event) {
    app.selectsingerId = event.currentTarget.dataset.singer.id
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  },

  scroll: function(event) {
    const newY = event.detail.scrollTop
    const listHeight = app.listHeight
    // 滚动到顶部
    if (newY < 0) {
      this.setData({
        currentIndex: 0
      })
      return
    }
    // 滚到中间部分
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        this.setData({
          currentIndex: i
        })
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setData({
      currentIndex: listHeight.length - 2
    })
  },

  shortcutListTap: function(event) {
    var that = this;
    that.setData({
      toView: event.target.dataset.index,
      currentIndex: event.target.dataset.index
    })
  },

  getHotSinger: function() {
    const _that = this
    let shortcutList = []
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=callback',
      success(res) {
        if (res.statusCode === 200) {
          var res1 = res.data.replace("callback(", "")
          var res2 = JSON.parse(res1.substring(0, res1.length - 1))
          var json = res2.data.list
          var list = _that._normallizeSinger(json)
          list.forEach((item, index) => {
            shortcutList.push(item.title.substring(0, 1))
          })
          _that.setData({
            hotSingerList: list,
            shortcutList: shortcutList
          })
          _that.getHeight()
        }
      }
    })
  },

  /*组装成需要的歌手列表数据*/
  _normallizeSinger: function(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < HOT_SINGER_LEN) {
        map.hot.items.push(new Singer(item.Fsinger_name, item.Fsinger_mid))
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new Singer(item.Fsinger_name, item.Fsinger_mid))
    })
    // 为了得到有序列表,对map做进一步处理
    let hot = []
    let ret = []
    for (let key in map) {
      var val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    // 按a-z排序
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  },

  getHeight: function() {
    const _that = this
    setTimeout(() => {
        wx.createSelectorQuery().in(this).selectAll('.list-group').fields({
          size: true
        }, function(res) {
          res.height
        }).exec(function(e) {
          var listHeight = []
          let height = 0
          listHeight.push(height)
          e[0].forEach((item, index) => {
            height += item.height
            listHeight.push(height)
          })
          app.listHeight = listHeight
        })
      },
      20
    )
  },

  onLoad: function(options) {
    this.getHotSinger()
  }

})
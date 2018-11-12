平常玩微信的时候，发现小程序在某些时候真的太方便了。比如我以前想听音乐的时候，我需要打开音乐app，但现在有小程序的话，我不需要打开音乐app，直接在微信上面播放音乐，这样对于手机容量不足或者卡顿就是一个比较好的体验。现在也越来越多电商有自己的小程序，比如当当，京东等等。所以微信小程序在某些方面上大大提高了用户的体验。我也因此对微信小程序开发感到浓厚的兴趣。

此小程序主要是参考 [wxmusic][1]，样式基本与参考一样。我写这个小程序主要目的是入门微信小程序，通过实例和阅读官方文档使自己对小程序的语法有一个基本认识了解。

----------
<h3>
  ● 首页：pages.music<br>
  ● 搜索：pages.search  <br>
  ● 歌手详情页面：pages.singer-detail<br>
  ● 播放页面：pages.player  <br>
  ● 热门歌手页面：pages.singer  <br>
  ● 热门音乐页面：pages.top-music<br>
  ● 用户页面：pages.my<br>
  ● 日志页面：pages.logs<br>
</h3>


**首页：pages.music**
头部主要有两个部分组成：搜索栏和轮播图；主体部分分别是热门榜单推荐和热门歌单推荐。（由于轮播图和热门歌单推荐找不到对应的QQ音乐API，所以我唯有不设置点击事件，即无法打开，唯有热门榜单推荐可以打开查看详情。）

首页页面主要使用swiper标签使图片自动转换，达到热点消息轮播的效果；其次学会使用wx:for标签循环数组，达到展示歌曲的效果。除此之外，通过学习微信小程序API，学会如何发起请求，跳转页面等基本的使用。
![此处输入图片的描述][2]

**搜索：pages.search** 
搜索页面包括搜索栏和热门搜索两个部分。搜索栏可以通过关键字搜索歌曲并打开歌手或歌曲详情页面；点击热门搜索可以打开相应歌曲或歌手的详情页面。
![此处输入图片的描述][3]
![此处输入图片的描述][4]

**歌手详情页面：**
页面头部是歌手的图片，图片下面是该歌手的歌曲列表。
![此处输入图片的描述][5]

**播放页面：pages.player** 
播放页面可以左右切换。其中一个页面是旋转专辑图片，另外一个页面是歌词展示。底部可以暂停、左切歌曲、右切歌曲和播放列表。
![此处输入图片的描述][6]
![此处输入图片的描述][7]
![此处输入图片的描述][8]

**热门歌手页面：pages.singer** 
请求QQ音乐API获取热门歌手列表，并通过歌手名字首字母由A-Z排序。通过点击右边字母可以快速跳到相应首字母的歌手集合。
![此处输入图片的描述][9]

**热门音乐页面：pages.top-music**
与歌手详情页面相似，页面头部是歌手的图片，图片下面是该歌手的歌曲列表。
![此处输入图片的描述][10]

**用户页面：pages.my** 
展示用户头像，名字。学会使用wx.showActionSheet显示操作菜单。
![此处输入图片的描述][11]

**日志页面：pages.logs**
记录登录基本信息。

  [1]: https://github.com/zyb718116577/wxmusic
  [2]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/music.png
  [3]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/search1.png
  [4]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/search2.png
  [5]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/singer-detail.png
  [6]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/play1.png
  [7]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/play2.png
  [8]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/play3.png
  [9]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/singer.png
  [10]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/top-music.png
  [11]: https://raw.githubusercontent.com/MuggleLee/wx-MusicLive/master/wx_InAction/screenshot/my.png
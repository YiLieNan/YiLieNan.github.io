/* 伊蕾娜背景切换 - 双图层交叉淡入淡出，无白闪 */
(function(){
  'use strict'

  var bgList=[]
  // 全部 73 张壁纸（bg-47~73 此前闲置未启用）
  for(var i=1;i<=73;i++) bgList.push('/images/backgrounds/bg-'+i+'.webp')

  // Fisher-Yates 洗牌
  function shuffle(arr){
    var a=arr.slice()
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1))
      ;[a[i],a[j]]=[a[j],a[i]]
    }
    return a
  }

  var playOrder=shuffle(bgList)  // 乱序播放顺序
  var interval=8000,fade=800,prefetched={}

  // 滑动窗口预取：只提前缓存"下一张+再下一张"，不做全量 20MB 后台下载
  function prefetchAhead(orders,i){
    for(var k=1;k<=2;k++){
      var src=orders[(i+k)%orders.length]
      if(src && !prefetched[src]){
        prefetched[src]=true
        var img=new Image()
        img.src=src
      }
    }
  }

  function init(){
    // 两层背景交替 - 避免白闪
    var bg1=document.createElement('div')
    var bg2=document.createElement('div')
    bg1.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;pointer-events:none;background:url('+playOrder[0]+') center/cover no-repeat;opacity:1;transition:opacity '+fade+'ms ease'
    bg2.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;background:url('+playOrder[1]+') center/cover no-repeat;opacity:0;transition:opacity '+fade+'ms ease'
    document.body.insertBefore(bg2,document.body.firstChild)
    document.body.insertBefore(bg1,document.body.firstChild)

    // 样式
    var s=document.createElement('style')
    s.textContent=
      '#header-nav{background:rgba(0,0,0,0.2)!important}'+
      '#header-nav .main-nav-link,#sub-nav .nav-icon{color:#fff!important;text-shadow:0 1px 6px rgba(0,0,0,0.6)}'+
      '#header-nav .main-nav-link:hover{color:#a78bfa!important}'+
      '.banner{background:transparent!important}'+
      '.banner .banner-bg{opacity:0!important}'+
      '#container{background:rgba(255,255,255,0.88)!important}'+
      '#wrap{background:transparent!important}'+
      '.post,.sidebar,.sidebar-author,.widget-wrap,.archive-year,.category-list-item{background:transparent!important}'+
      /* 手机端优化 */
      '@media(max-width:768px){'+
        '#container{background:rgba(255,255,255,0.95)!important}'+
        '.post{padding:12px 8px!important}'+
        'pre code{font-size:12px!important}'+
        'img{max-width:100%!important;height:auto!important}'+
      '}'
    document.head.appendChild(s)

    // 双图层交替 - 乱序完整放完一组后重新打乱
    var active=bg1,inactive=bg2,curIdx=0
    // 首屏预取第 2、3 张（正在显示 0、1 已由 CSS 加载）
    prefetched[playOrder[0]]=prefetched[playOrder[1]]=true
    prefetchAhead(playOrder,1)
    setInterval(function(){
      curIdx++
      if(curIdx>=playOrder.length){
        playOrder=shuffle(bgList)
        curIdx=0
        prefetched={}
        prefetchAhead(playOrder,0)
      }
      // 非活跃层换图然后淡入
      inactive.style.backgroundImage='url('+playOrder[curIdx]+')'
      inactive.style.opacity='1'
      active.style.opacity='0'
      // 交换引用
      var tmp=active;active=inactive;inactive=tmp
      // 滑动窗口预取后面两张
      prefetchAhead(playOrder,curIdx)
    },interval)
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init)
  else init()
})()

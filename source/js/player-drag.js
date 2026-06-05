/**
 * 音乐播放器固定左上角 + 导航栏固定顶部
 * 删除了拖拽逻辑，改为固定定位
 */
(function(){
  'use strict'

  // 1. CSS 强制覆盖定位（播放器左上角，导航栏下方）
  var c=document.createElement('style')
  c.textContent=
    '.aplayer-fixed{top:62px!important;left:16px!important;bottom:auto!important;right:auto!important;z-index:99999!important}'+
    '.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important}'+
    '.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'
  document.head.appendChild(c)

  // 2. 导航栏固定：阻止主题自动隐藏
  function keepNav(){
    var nav=document.querySelector('#header-nav')
    if(nav&&nav.classList.contains('header-nav-hidden')){
      nav.classList.remove('header-nav-hidden')
    }
  }

  // MutationObserver 拦截 class 变化
  function watchNav(){
    var nav=document.querySelector('#header-nav')
    if(!nav) return setTimeout(watchNav,200)
    new MutationObserver(function(m){
      if(m.some(function(x){return x.type==='attributes'&&x.attributeName==='class'})){
        if(nav.classList.contains('header-nav-hidden')){
          nav.classList.remove('header-nav-hidden')
        }
      }
    }).observe(nav,{attributes:true,attributeFilter:['class']})
  }

  keepNav()
  watchNav()

  // 兜底：滚动时也检查
  document.addEventListener('scroll',keepNav,{passive:true})

  // pjax 后重新绑定
  document.addEventListener('pjax:complete',function(){
    setTimeout(function(){keepNav();watchNav()},300)
  })
})()

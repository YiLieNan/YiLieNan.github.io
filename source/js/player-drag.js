/**
 * 音乐播放器固定左上角 + 导航栏固定顶部
 * 删除了拖拽逻辑，改为固定定位
 * 导航栏用 CSS 覆盖隐藏效果（不抖动）
 */
(function(){
  'use strict'

  // 1. CSS 强制覆盖定位
  var c=document.createElement('style')
  c.textContent=
    // 播放器左上角（导航栏下方，留出 62px 给导航栏）
    '.aplayer-fixed{top:62px!important;left:16px!important;bottom:auto!important;right:auto!important;z-index:99999!important}'+
    '.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important}'+
    '.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'+
    // 导航栏始终显示：覆盖主题的隐藏 class，不让它动
    '#header-nav.header-nav-hidden{top:0!important}'
  document.head.appendChild(c)

  // 2. 去掉主题加的 header-nav-hidden class（以防它影响其他样式）
  function cleanNav(){
    var nav=document.querySelector('#header-nav')
    if(nav)nav.classList.remove('header-nav-hidden')
  }

  cleanNav()
  document.addEventListener('scroll',cleanNav,{passive:true})

  // pjax 后重新清理
  document.addEventListener('pjax:complete',function(){setTimeout(cleanNav,300)})
})()

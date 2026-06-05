/**
 * 音乐播放器固定左上角 + 导航栏固定顶部 + PJAX 无感切换
 */
(function(){
  'use strict'

  // 1. CSS 强制覆盖定位
  var c=document.createElement('style')
  c.textContent=
    // 播放器左上角（导航栏下方，留出 62px）
    '.aplayer-fixed{top:62px!important;left:16px!important;bottom:auto!important;right:auto!important;z-index:99999!important}'+
    '.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important}'+
    '.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'+
    // 导航栏始终显示
    '#header-nav.header-nav-hidden{top:0!important}'
  document.head.appendChild(c)

  // 2. 导航栏固定
  function cleanNav(){
    var nav=document.querySelector('#header-nav')
    if(nav)nav.classList.remove('header-nav-hidden')
  }
  cleanNav()
  document.addEventListener('scroll',cleanNav,{passive:true})

  // 3. PJAX 无感切换 —— 阻止 Pjax 库的 scrollTo 行为
  // theme-shokax-pjax@0.0.3 在 afterAllSwitches 中用 this.state.options.scrollTo
  // 注意：不是 this.options，而是 loadUrl 中拷贝的 this.state.options
  if(window.Pjax && window.Pjax.prototype){
    var origAfterSwitches = window.Pjax.prototype.afterAllSwitches
    window.Pjax.prototype.afterAllSwitches = function(){
      // 覆盖 state 中的 scrollTo（Pjax 读的是这里）
      if(this.state && this.state.options){
        this.state.options.scrollTo = false
      }
      origAfterSwitches.call(this)
    }
  }

  // pjax 后重新清理导航栏
  document.addEventListener('pjax:complete',function(){setTimeout(cleanNav,300)})
})()

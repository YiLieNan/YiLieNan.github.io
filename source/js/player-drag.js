/**
 * 音乐播放器固定左上角 + 导航栏固定顶部 + PJAX 无感切换
 * v4 — 直接拦截 window.scrollTo(0,0)
 */
(function(){
  'use strict'

  // 1. CSS 强制覆盖定位
  var c=document.createElement('style')
  c.textContent=
    '.aplayer-fixed{top:62px!important;left:16px!important;bottom:auto!important;right:auto!important;z-index:99999!important}'+
    '.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important}'+
    '.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'+
    '#header-nav.header-nav-hidden{top:0!important}'
  document.head.appendChild(c)

  // 2. 导航栏固定
  function cleanNav(){
    var nav=document.querySelector('#header-nav')
    if(nav)nav.classList.remove('header-nav-hidden')
  }
  cleanNav()
  document.addEventListener('scroll',cleanNav,{passive:true})
  document.addEventListener('pjax:complete',function(){setTimeout(cleanNav,300)})

  // 3. PJAX 无感切换 — 滚动保持
  // 策略: 在 PJAX 导航期间拦截 window.scrollTo(0, 0)
  // Pjax 库在 afterAllSwitches 中调 scrollTo(0, scrollToValue)
  // pjax:complete 先触发，scrollTo 在其后，所以用 setTimeout 延后清除标志

  var _busy = false

  // 保存滚动位置
  var _y = 0
  window.addEventListener('pjax:send', function(){
    _y = window.scrollY || window.pageYOffset || 0
    _busy = true
  })

  // pjax:complete 触发后 Pjax 还会执行 scrollTo(0,0)
  // 延时清除标志，让拦截覆盖住那次 scrollTo
  window.addEventListener('pjax:complete', function(){
    // 先恢复位置（以防 scrollTo 没被拦住时也能恢复）
    if(_y > 0){
      window.scrollTo({top: _y, left: 0})
    }
    // 等一段时间再放行 scrollTo
    setTimeout(function(){ _busy = false }, 100)
  })

  // 拦截 window.scrollTo
  // Pjax 调用格式: scrollTo(x, y) — 两个数字参数
  // "回到顶部"按钮调用: scrollTo({top:0, behavior:'smooth'}) — 对象参数
  // 所以只拦截两个数字参数且滚到顶部的调用
  var _st = window.scrollTo.bind(window)
  window.scrollTo = function(){
    // 两个参数且滚到 (0,0) → 且正在 PJAX 中 → 拦掉
    if(_busy && arguments.length >= 2 && arguments[0]===0 && arguments[1]===0){
      return  // 静默拦截
    }
    _st.apply(window, arguments)
  }
})()

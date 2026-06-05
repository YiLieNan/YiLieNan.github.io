/**
 * 音乐播放器固定左上角 + 导航栏固定顶部 + PJAX 无感切换
 * v3 — 完全重写滚动保持逻辑
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

  // 3. PJAX 无感切换 — 滚动位置保持
  // 策略 A: 劫持 Pjax 原型，在 afterAllSwitches 前禁用 scrollTo
  if(window.Pjax && window.Pjax.prototype){
    var _orig = window.Pjax.prototype.afterAllSwitches
    window.Pjax.prototype.afterAllSwitches = function(){
      if(this.state && this.state.options){
        this.state.options.scrollTo = false
      }
      _orig.call(this)
    }
  }

  // 策略 B: 兜底保存/恢复滚动位置
  var _savedY = 0

  window.addEventListener('pjax:send', function(){
    _savedY = window.scrollY || window.pageYOffset || 0
  })

  window.addEventListener('pjax:complete', function(){
    var y = _savedY
    if(!y) return

    // Pjax 的 afterAllSwitches 在 dispatch pjax:complete 后
    // 还会执行 scrollTo(0, 0)，所以需要等一帧再恢复
    var restore = function(){
      var cur = window.scrollY || window.pageYOffset
      if(cur === 0 && y > 0){
        // Pjax 已经把人滚到顶部了，滚回去
        window.scrollTo({top: y, left: 0})
      } else if(cur !== y){
        window.scrollTo({top: y, left: 0})
      }
    }

    // 立即恢复一次
    restore()
    // 下一帧再恢复一次（如果 Pjax 的 scrollTo 在这一帧执行了）
    requestAnimationFrame(function(){ restore() })
  })
})()

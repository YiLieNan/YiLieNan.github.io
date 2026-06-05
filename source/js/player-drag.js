/**
 * 音乐播放器 — 自由拖拽弹窗 + 导航栏固定 + PJAX 无感切换
 * v5 — 全新拖拽实现，交互流畅无白框
 */
(function(){
  'use strict'

  /* ===== CSS 注入 ===== */
  var css = document.createElement('style')
  css.textContent=
    // 播放器初始左上角（导航栏下方），圆角
    '.aplayer-fixed{top:62px!important;left:16px!important;bottom:auto!important;right:auto!important;z-index:99999!important}'+
    '.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;'+
      'box-shadow:0 8px 32px rgba(0,0,0,0.35)!important;cursor:grab!important}'+
    '.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'+
    // 导航栏始终显示
    '#header-nav.header-nav-hidden{top:0!important}'
  document.head.appendChild(css)

  /* ===== 导航栏固定 ===== */
  function cleanNav(){
    var nav=document.querySelector('#header-nav')
    if(nav)nav.classList.remove('header-nav-hidden')
  }
  cleanNav()
  document.addEventListener('scroll',cleanNav,{passive:true})

  /* ===== PJAX 无感切换 — 拦截 scrollTo(0,0) ===== */
  var _busy = false, _y = 0

  window.addEventListener('pjax:send', function(){
    _y = window.scrollY || window.pageYOffset || 0
    _busy = true
  })
  window.addEventListener('pjax:complete', function(){
    if(_y > 0) window.scrollTo({top: _y, left: 0})
    setTimeout(function(){ _busy = false }, 100)
  })

  var _st = window.scrollTo.bind(window)
  window.scrollTo = function(){
    if(_busy && arguments.length >= 2 && arguments[0]===0 && arguments[1]===0) return
    _st.apply(window, arguments)
  }

  /* ===== 播放器自由拖拽 ===== */
  // 从 localStorage 恢复上次位置
  var _savedPos = (function(){
    try{ return JSON.parse(localStorage.getItem('aplayer_pos')) }catch(e){}
    return null
  })()

  var _container = null   // .aplayer-fixed
  var _body = null        // .aplayer-body
  var _drag = false
  var _sx = 0, _sy = 0, _ox = 0, _oy = 0

  // 判断是否点击了播放器控制区（不触发拖拽）
  function isControl(e){
    var t = e.target
    return !!(t.closest('.aplayer-btn') ||
      t.closest('.aplayer-icon') ||
      t.closest('button') ||
      t.closest('.aplayer-bar-wrap') ||
      t.closest('.aplayer-volume-wrap') ||
      t.closest('.aplayer-time') ||
      t.closest('.aplayer-miniswitcher') ||
      t.closest('.aplayer-list'))
  }

  function onDown(e){
    if(isControl(e)) return
    e.preventDefault()
    var ev = e.touches ? e.touches[0] : e
    _drag = true
    _sx = ev.clientX
    _sy = ev.clientY
    var r = _container.getBoundingClientRect()
    _ox = r.left
    _oy = r.top
    // 拖拽时：关过渡、设 will-change、改光标、禁折叠按钮
    _container.style.transition = 'none'
    _container.style.willChange = 'left, top'
    if(_body) _body.style.cursor = 'grabbing'
    var sw = _container.querySelector('.aplayer-miniswitcher')
    if(sw) sw.style.pointerEvents = 'none'
  }

  function onMove(e){
    if(!_drag) return
    e.preventDefault()
    var ev = e.touches ? e.touches[0] : e
    _container.style.left = (_ox + ev.clientX - _sx) + 'px'
    _container.style.top = (_oy + ev.clientY - _sy) + 'px'
  }

  function onUp(){
    if(!_drag) return
    _drag = false
    _container.style.transition = ''
    _container.style.willChange = ''
    if(_body) _body.style.cursor = 'grab'
    var sw = _container.querySelector('.aplayer-miniswitcher')
    if(sw) sw.style.pointerEvents = ''
    // 保存位置到 localStorage
    try{
      var r = _container.getBoundingClientRect()
      localStorage.setItem('aplayer_pos', JSON.stringify({left: r.left, top: r.top}))
    }catch(e){}
  }

  function bindDrag(){
    if(!_body) return
    _body.addEventListener('mousedown', onDown)
    _body.addEventListener('touchstart', onDown, {passive: false})
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove, {passive: false})
    document.addEventListener('touchend', onUp)
  }

  // 恢复上次位置
  function restorePos(){
    if(!_container || !_savedPos) return
    _container.style.left = _savedPos.left + 'px'
    _container.style.top = _savedPos.top + 'px'
  }

  // 等待 APlayer 渲染完成
  var _tries = 0
  function waitPlayer(){
    _container = document.querySelector('.aplayer-fixed')
    if(!_container || !_container.querySelector('.aplayer-body') || !_container.querySelector('.aplayer-pic')){
      if(++_tries > 150) return  // 最多等 30 秒
      return setTimeout(waitPlayer, 200)
    }
    _body = _container.querySelector('.aplayer-body')
    _body.style.cursor = 'grab'
    restorePos()
    bindDrag()
  }

  // 启动
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    waitPlayer()
  } else {
    document.addEventListener('DOMContentLoaded', waitPlayer)
  }
  // pjax 后重新绑定
  document.addEventListener('pjax:complete', function(){
    setTimeout(function(){ cleanNav(); waitPlayer() }, 300)
  })
})()

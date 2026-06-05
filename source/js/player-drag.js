/**
 * 播放器 — 自由拖拽小窗 + 导航栏固定 + PJAX 无感切换
 * v6 — 劫持 setupAPlayer，彻底接管定位
 */
(function(){
  'use strict'

  /* ===== CSS 注入 ===== */
  var css = document.createElement('style')
  css.textContent=
    // 播放器样式：紧凑、圆角
    '#aplayer.aplayer-fixed{top:70px!important;left:16px!important;bottom:auto!important;right:auto!important;z-index:99999!important}'+
    '#aplayer.aplayer-fixed .aplayer-body{border-radius:12px!important;overflow:hidden!important;'+
      'box-shadow:0 4px 20px rgba(0,0,0,0.3)!important;cursor:grab!important}'+
    '#aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:8px!important;overflow:hidden!important}'+
    // 紧凑模式
    '#aplayer.aplayer-fixed{width:280px!important}'+
    '#aplayer.aplayer-fixed .aplayer-info{padding:8px 10px!important}'+
    '#aplayer.aplayer-fixed .aplayer-pic{width:50px!important;height:50px!important}'+
    '#aplayer.aplayer-fixed .aplayer-body{min-height:50px!important}'+
    '#aplayer.aplayer-fixed .aplayer-list{max-height:200px!important}'+
    '#aplayer.aplayer-fixed .aplayer-title{font-size:13px!important}'+
    '#aplayer.aplayer-fixed .aplayer-author{font-size:11px!important}'+
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

  /* ===== PJAX 无感切换 ===== */
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

  /* ===== 播放器 ===== */
  // 劫持 setupAPlayer，在 APlayer 创建后重新定位
  if(typeof setupAPlayer === 'function'){
    var _origSetup = setupAPlayer
    setupAPlayer = function(){
      _origSetup()
      // APlayer 已创建，立即重定位
      afterPlayerReady()
    }
  }

  var _el = null        // .aplayer-fixed
  var _body = null       // .aplayer-body
  var _drag = false
  var _sx = 0, _sy = 0, _ox = 0, _oy = 0

  // 从 localStorage 恢复位置
  var _saved = (function(){
    try{ return JSON.parse(localStorage.getItem('aplayer_pos')) }catch(e){}
    return null
  })()

  function isCtrl(e){
    var t = e.target
    return !!(t.closest('.aplayer-btn')||t.closest('.aplayer-icon')||t.closest('button')||
      t.closest('.aplayer-bar-wrap')||t.closest('.aplayer-volume-wrap')||t.closest('.aplayer-time')||
      t.closest('.aplayer-miniswitcher')||t.closest('.aplayer-list'))
  }

  function onDown(e){
    if(isCtrl(e)) return
    e.preventDefault()
    var ev = e.touches ? e.touches[0] : e
    _drag = true
    _sx = ev.clientX; _sy = ev.clientY
    var r = _el.getBoundingClientRect(); _ox = r.left; _oy = r.top
    _el.style.transition = 'none'
    _el.style.willChange = 'left, top'
    var sw = _el.querySelector('.aplayer-miniswitcher')
    if(sw) sw.style.pointerEvents = 'none'
  }

  function onMove(e){
    if(!_drag) return
    e.preventDefault()
    var ev = e.touches ? e.touches[0] : e
    _el.style.left = (_ox + ev.clientX - _sx) + 'px'
    _el.style.top = (_oy + ev.clientY - _sy) + 'px'
  }

  function onUp(){
    if(!_drag) return
    _drag = false
    _el.style.transition = ''
    _el.style.willChange = ''
    var sw = _el.querySelector('.aplayer-miniswitcher')
    if(sw) sw.style.pointerEvents = ''
    try{
      var r = _el.getBoundingClientRect()
      localStorage.setItem('aplayer_pos', JSON.stringify({left: r.left, top: r.top}))
    }catch(e){}
  }

  function posPlayer(){
    if(!_el) return
    // 清掉 APlayer 的 bottom/right
    _el.style.bottom = ''
    _el.style.right = ''
    _el.style.position = 'fixed'
    _el.style.zIndex = '99999'
    _el.style.margin = '0'
    if(_saved){
      _el.style.top = _saved.top + 'px'
      _el.style.left = _saved.left + 'px'
    } else {
      _el.style.top = '70px'
      _el.style.left = '16px'
    }
    // 光标
    _body = _el.querySelector('.aplayer-body')
    if(_body) _body.style.cursor = 'grab'
  }

  function bindEv(){
    if(!_body) return
    _body.addEventListener('mousedown', onDown)
    _body.addEventListener('touchstart', onDown, {passive: false})
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove, {passive: false})
    document.addEventListener('touchend', onUp)
  }

  function afterPlayerReady(){
    _el = document.querySelector('.aplayer-fixed') || document.getElementById('aplayer')
    if(!_el || !_el.querySelector('.aplayer-body')) return setTimeout(afterPlayerReady, 100)
    _body = _el.querySelector('.aplayer-body')
    posPlayer()
    bindEv()
  }

  // 兜底：如果 setupAPlayer 没被劫持到（比如已执行完），用轮询
  function fallback(){
    if(document.querySelector('.aplayer-fixed')){
      afterPlayerReady()
      return
    }
    setTimeout(fallback, 300)
  }
  setTimeout(fallback, 1000)

  // pjax 后
  document.addEventListener('pjax:complete', function(){
    setTimeout(function(){ cleanNav(); afterPlayerReady() }, 500)
  })
})()

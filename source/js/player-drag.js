/**
 * APlayer 拖拽 — 用 CSS 强制定位左上角 + JS 拖拽
 */
(function(){
  'use strict'

  // 1. 注入 CSS 强制覆盖 APlayer 的默认定位
  var css=document.createElement('style')
  css.textContent='.aplayer-fixed{top:20px!important;left:20px!important;bottom:auto!important;right:auto!important;z-index:99999!important}.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;cursor:grab!important;user-select:none!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important}.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'
  document.head.appendChild(css)

  var el,body,drag=false,sx,sy,ox,oy

  function ds(e){
    if(e.target.closest('.aplayer-info')||e.target.closest('.aplayer-miniswitcher')) return
    e.preventDefault()
    var ev=e.touches?e.touches[0]:e
    drag=true;sx=ev.clientX;sy=ev.clientY
    var r=el.getBoundingClientRect();ox=r.left;oy=r.top
    el.style.transition='none'
    if(body)body.style.cursor='grabbing'
    var sw=el.querySelector('.aplayer-miniswitcher')
    if(sw)sw.style.pointerEvents='none'
  }
  function dm(e){
    if(!drag)return
    e.preventDefault()
    var ev=e.touches?e.touches[0]:e
    el.style.left=(ox+ev.clientX-sx)+'px'
    el.style.top=(oy+ev.clientY-sy)+'px'
  }
  function de(){
    if(!drag)return
    drag=false;el.style.transition=''
    if(body)body.style.cursor='grab'
    var sw=el.querySelector('.aplayer-miniswitcher')
    if(sw)sw.style.pointerEvents=''
  }

  function bind(){
    if(!body)return
    body.addEventListener('mousedown',ds)
    body.addEventListener('touchstart',ds,{passive:false})
    document.addEventListener('mousemove',dm)
    document.addEventListener('mouseup',de)
    document.addEventListener('touchmove',dm,{passive:false})
    document.addEventListener('touchend',de)
  }

  var tries=0
  function wait(){
    el=document.querySelector('.aplayer-fixed')
    if(!el||!el.querySelector('.aplayer-body')||!el.querySelector('.aplayer-info')){
      if(++tries>100)return // 20s timeout
      return setTimeout(wait,200)
    }
    body=el.querySelector('.aplayer-body')
    bind()
  }

  if(document.readyState==='complete'||document.readyState==='interactive'){wait()}
  else{document.addEventListener('DOMContentLoaded',wait)}
  document.addEventListener('pjax:complete',function(){setTimeout(wait,500)})
})()

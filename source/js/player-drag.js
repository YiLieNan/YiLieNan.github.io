/**
 * APlayer 拖拽 — 左上角 + 圆角 + 可拖动
 * 等 MetingJS 渲染完 APlayer 后接管
 */
(function(){
  'use strict'
  var el, body, drag=false, sx,sy,ox,oy

  function style(){
    if(!el) return
    el.style.top='20px'
    el.style.left='20px'
    el.style.bottom='auto'
    el.style.right='auto'
    el.style.zIndex='99999'
    el.style.boxShadow='0 8px 32px rgba(0,0,0,0.35)'
    if(body){
      body.style.borderRadius='16px'
      body.style.overflow='hidden'
      body.style.cursor='grab'
    }
    var sw=el.querySelector('.aplayer-miniswitcher')
    if(sw){sw.style.borderRadius='10px';sw.style.overflow='hidden'}
  }

  function ds(e){
    if(e.target.closest('.aplayer-info')||e.target.closest('.aplayer-miniswitcher')) return
    e.preventDefault()
    var ev=e.touches?e.touches[0]:e
    drag=true; sx=ev.clientX; sy=ev.clientY
    var r=el.getBoundingClientRect(); ox=r.left; oy=r.top
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
    drag=false; el.style.transition=''
    if(body)body.style.cursor='grab'
    var sw=el.querySelector('.aplayer-miniswitcher')
    if(sw)sw.style.pointerEvents=''
  }

  function bind(){
    if(!body)return
    body.addEventListener('mousedown',ds)
    body.addEventListener('touchstart',ds,{passive:false})
  }

  var tries=0
  function wait(){
    el=document.querySelector('.aplayer-fixed')
    if(!el||!el.querySelector('.aplayer-body')||!el.querySelector('.aplayer-info')){
      if(++tries>50)return // 10s timeout
      return setTimeout(wait,200)
    }
    body=el.querySelector('.aplayer-body')
    style()
    bind()
    document.addEventListener('mousemove',dm)
    document.addEventListener('mouseup',de)
    document.addEventListener('touchmove',dm,{passive:false})
    document.addEventListener('touchend',de)
  }

  if(document.readyState==='complete'||document.readyState==='interactive'){wait()}
  else{document.addEventListener('DOMContentLoaded',wait)}
  document.addEventListener('pjax:complete',function(){setTimeout(wait,500)})
})()

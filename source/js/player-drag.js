/**
 * APlayer 可拖动播放器 — 左上角 + 可拖动
 * 如果 MetingJS 加载失败，使用构建时缓存的数据
 */
(function(){
  'use strict'

  // CSS 强制覆盖定位
  var c=document.createElement('style')
  c.textContent='.aplayer-fixed{top:20px!important;left:20px!important;bottom:auto!important;right:auto!important;z-index:99999!important}.aplayer.aplayer-fixed .aplayer-body{border-radius:16px!important;overflow:hidden!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important}.aplayer.aplayer-fixed .aplayer-miniswitcher{border-radius:10px!important;overflow:hidden!important}'
  document.head.appendChild(c)

  var el,body,drag=false,sx,sy,ox,oy

  function isBtn(e){
    var t=e.target
    return t.closest('.aplayer-btn')||t.closest('.aplayer-icon')||t.closest('button')||t.closest('.aplayer-bar-wrap')||t.closest('.aplayer-volume-wrap')||t.closest('.aplayer-time')||t.closest('.aplayer-miniswitcher')
  }

  function ds(e){
    if(isBtn(e)) return
    e.preventDefault()
    var ev=e.touches?e.touches[0]:e
    drag=true;sx=ev.clientX;sy=ev.clientY
    var r=el.getBoundingClientRect();ox=r.left;oy=r.top
    el.style.transition='none'
    if(body)body.style.cursor='grabbing'
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
    if(body)body.style.cursor=''
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
    if(!el||!el.querySelector('.aplayer-body')||!el.querySelector('.aplayer-pic')){
      if(++tries>100)return
      return setTimeout(wait,200)
    }
    body=el.querySelector('.aplayer-body')
    body.style.cursor='grab'
    bind()
  }

  // 构建时缓存的数据作为备用
  function fallback(){
    if(!window.__PLAYLIST_DATA__||!window.__PLAYLIST_DATA__.length) return
    // 如果 10 秒后 MetingJS 还没加载出 APlayer，直接用 APlayer
    var check=setInterval(function(){
      if(document.querySelector('.aplayer-fixed')){clearInterval(check);return}
    },500)
    setTimeout(function(){
      if(document.querySelector('.aplayer-fixed')) return
      // MetingJS 没反应，用本地数据创建 APlayer
      if(typeof APlayer==='undefined') return
      var w=document.createElement('div')
      w.id='aplayer'
      w.className='aplayer aplayer-fixed'
      document.body.appendChild(w)
      new APlayer({
        container:w,
        fixed:true,
        audio:window.__PLAYLIST_DATA__,
        order:'random',
        loop:'all',
        volume:0.7,
        mutex:true,
        listFolded:true,
      })
    },10000)
  }

  if(document.readyState==='complete'||document.readyState==='interactive'){wait();fallback()}
  else{document.addEventListener('DOMContentLoaded',function(){wait();fallback()})}
  document.addEventListener('pjax:complete',function(){setTimeout(wait,500)})
})()

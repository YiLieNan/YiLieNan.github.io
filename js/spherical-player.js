/**
 * 球形音乐播放器 v2 — 干净重写
 */
;(function(){
  'use strict'

  var SONGS = [
    { name:'リテラチュア', artist:'上田麗奈', url:'/music/track-literature.mp3' },
    { name:'ed', artist:'上田麗奈', url:'/music/track-ed.mp3' }
  ]
  if(!SONGS.length) return

  var audio = new Audio()
  audio.style.display = 'none'
  document.body.appendChild(audio)
  audio.volume = parseFloat(localStorage.getItem('sp_vol')) || 0.7

  var state = { idx:0, playing:false, open:false, drag:false }

  // ═══════ 封面图库 ═══════
  var COVERS = []
  ;[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27].forEach(function(n){
    var num=('000'+n).slice(-3)
    COVERS.push('/images/player-covers/cover-'+num+'.jpg')
  })
  var coverIdx = Math.floor(Math.random()*COVERS.length)

  // 创建界面
  var el = document.createElement('div')
  el.id = 'sp-wrap'
  el.innerHTML =
    '<div id="sp-card" style="display:none;position:absolute;bottom:58px;width:280px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.12);overflow:hidden;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif">' +
      '<!-- 封面区 -->' +
      '<div id="sp-cover" style="height:100px;position:relative;overflow:hidden;background:#7c3aed;background-size:cover;background-position:center">' +
        '<!-- 渐显用叠加层 -->' +
        '<div id="sp-cover-next" style="position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.06);transition:opacity 2.5s cubic-bezier(0.0,0.0,0.2,1),transform 2.5s cubic-bezier(0.0,0.0,0.2,1)"></div>' +
        '<!-- 轻毛玻璃遮罩 -->' +
        '<div style="position:absolute;inset:0;background:rgba(255,255,255,0.04);backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px)"></div>' +
        '<div id="sp-rain" style="position:absolute;inset:0;overflow:hidden;pointer-events:none"></div>' +
        '<!-- 封面音符图标 -->' +
        '<div id="sp-cover-icon" style="position:absolute;bottom:10px;right:10px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.25);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,0.15)">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2))"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' +
        '</div>' +
      '</div>' +
      '<!-- 歌曲信息 -->' +
      '<div style="padding:12px 16px 4px;text-align:center">' +
        '<div id="sp-t" style="font-weight:600;color:#1e1b4b;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">--</div>' +
        '<div id="sp-a" style="font-size:12px;color:#999;margin-top:2px">--</div>' +
      '</div>' +
      '<!-- 进度条 -->' +
      '<div style="padding:8px 16px 2px">' +
        '<div id="sp-bar-bg" style="height:3px;background:#eee;border-radius:2px;cursor:pointer;position:relative">' +
          '<div id="sp-bar" style="height:100%;width:0;background:#7c3aed;border-radius:2px;transition:width 0.1s linear"></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:10px;color:#bbb;margin-top:2px">' +
          '<span id="sp-t1">0:00</span><span id="sp-t2">0:00</span>' +
        '</div>' +
      '</div>' +
      '<!-- 控制按钮 -->' +
      '<div style="display:flex;align-items:center;justify-content:center;gap:18px;padding:4px 12px 8px">' +
        '<button class="spb" id="sp-shuffle" style="font-size:13px;color:#999">🔁</button>' +
        '<button class="spb" id="sp-prev" style="font-size:16px;color:#666">⏮</button>' +
        '<button id="sp-playbtn" style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(124,58,237,0.3)">▶</button>' +
        '<button class="spb" id="sp-next" style="font-size:16px;color:#666">⏭</button>' +
        '<button class="spb" id="sp-listbtn" style="font-size:13px;color:#999">📋</button>' +
      '</div>' +
      '<!-- 音量 -->' +
      '<div style="padding:0 16px 10px;display:flex;align-items:center;gap:6px">' +
        '<span style="font-size:11px;color:#bbb">🔊</span>' +
        '<input type="range" id="sp-vol" min="0" max="1" step="0.05" value="'+audio.volume+'" style="flex:1;height:3px;accent-color:#7c3aed;cursor:pointer">' +
      '</div>' +
      '<!-- 列表 -->' +
      '<div id="sp-list" style="display:none;border-top:1px solid #f0f0f0;max-height:180px;overflow-y:auto"></div>' +
    '</div>' +
    '<div id="sp-ball" style="width:60px;height:60px;border-radius:50%;overflow:hidden;box-shadow:0 4px 14px rgba(124,58,237,0.35);cursor:pointer;user-select:none;position:relative">' +
      '<img src="/images/elaina-avatar.webp" style="width:100%;height:100%;object-fit:cover;display:block">' +
      '<div style="position:absolute;inset:0;background:rgba(255,255,255,0.12);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)"></div>' +
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.4))"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' +
      '</div>' +
    '</div>' 
  el.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:99999'
  document.body.appendChild(el)

  var card = el.querySelector('#sp-card')
  var ball = el.querySelector('#sp-ball')
  var playBtn = el.querySelector('#sp-playbtn')
  var bar = el.querySelector('#sp-bar')
  var listEl = el.querySelector('#sp-list')
  var volEl = el.querySelector('#sp-vol')

  function fmt(t){return t?Math.floor(t/60)+':'+('0'+Math.floor(t%60)).slice(-2):'0:00'}
  function $(id){return document.getElementById(id)}

  // 加载歌曲
  function load(i){
    if(i<0||i>=SONGS.length)return
    state.idx=i
    audio.src=SONGS[i].url
    audio.load()
    render()
  }

  // 播放
  function go(){
    audio.play().then(function(){
      state.playing=true
      render()
    }).catch(function(){})
  }
  function stop(){
    audio.pause()
    state.playing=false
    render()
  }

  // 渲染
  function render(){
    var s=SONGS[state.idx]
    if($('sp-t'))$('sp-t').textContent=s?s.name:'--'
    if($('sp-a'))$('sp-a').textContent=s?s.artist:'--'
    if(playBtn)playBtn.innerHTML=state.playing?'⏸':'▶'
    if(bar)bar.style.width=(audio.duration?audio.currentTime/audio.duration*100:0)+'%'
    if($('sp-t1'))$('sp-t1').textContent=fmt(audio.currentTime)
    if($('sp-t2'))$('sp-t2').textContent=fmt(audio.duration)

    // 封面音符旋转
    var icon=document.getElementById('sp-cover-icon')
    if(icon){
      if(state.playing){
        icon.style.transform=''
        icon.style.animation='sp-rotate 4s linear infinite'
      }else{
        var is=getComputedStyle(icon)
        if(is.animationName!=='none'&&is.animationName!==''){
          var im=is.transform
          if(im&&im!=='none'){
            icon.style.transition='none'
            icon.style.transform=im
            void icon.offsetHeight
            icon.style.transition=''
          }
        }
        icon.style.animation='none'
      }
    }

    // 外部球体旋转（播放中）
    if(state.playing){
      ball.style.transform=''
      ball.style.animation='sp-ball-rotate 6s linear infinite'
    }else{
      // 停止时冻结当前旋转角度
      var style=getComputedStyle(ball)
      if(style.animationName!=='none'&&style.animationName!==''){
        var m=style.transform
        if(m&&m!=='none'){
          ball.style.transition='none'
          ball.style.transform=m
          // 强制重绘后再移除过渡
          void ball.offsetHeight
          ball.style.transition=''
        }
      }
      ball.style.animation='none'
    }
  }

  // 封面切换函数（渐变过渡）
  var _coverTimer2 = null
  function nextCover(){
    var cover=document.getElementById('sp-cover')
    var next=document.getElementById('sp-cover-next')
    if(!cover)return
    if(_coverTimer2){clearTimeout(_coverTimer2);_coverTimer2=null}
    coverIdx=(coverIdx+1)%COVERS.length
    var newUrl='url('+COVERS[coverIdx]+')'
    if(next){
      next.style.backgroundImage=newUrl
      next.style.opacity='1'
      next.style.transform='scale(1)'
      _coverTimer2=setTimeout(function(){
        cover.style.backgroundImage=newUrl
        next.style.opacity='0'
        next.style.transform='scale(1.06)'
        _coverTimer2=null
      }, 2500)
    }else{
      cover.style.backgroundImage=newUrl
    }
  }

  // 创建雨窗效果
  function createRain(){
    var el=document.getElementById('sp-rain')
    if(!el||el.children.length)return
    for(var i=0;i<30;i++){
      var drop=document.createElement('div')
      var x=Math.random()*100,l=Math.random()*40+10,d=Math.random()*0.5+0.3
      drop.style.cssText='position:absolute;left:'+x+'%;top:-20px;width:1px;height:'+l+'px;background:rgba(255,255,255,'+d+');animation:sp-rainfall '+ (Math.random()*0.6+0.4) +'s linear infinite;animation-delay:'+Math.random()*1+'s'
      el.appendChild(drop)
    }
  }

  load(0)

  // 按钮事件
  playBtn.onclick=function(){state.playing?stop():go()}
  $('sp-next').onclick=function(){load((state.idx+1)%SONGS.length);go()}
  $('sp-prev').onclick=function(){load((state.idx-1+SONGS.length)%SONGS.length);go()}
  $('sp-shuffle').onclick=function(){this.textContent=this.textContent==='🔁'?'🔀':'🔁'}
  $('sp-listbtn').onclick=function(){
    var d=listEl.style.display
    listEl.style.display=d==='block'?'none':'block'
    if(listEl.style.display==='block'){
      listEl.innerHTML=SONGS.map(function(s,i){
        return '<div onclick="spPlay('+i+')" style="padding:8px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;transition:background 0.15s" onmouseover="this.style.background=\'#f5f0ff\'" onmouseout="this.style.background=\'\'">'+
          '<span style="color:#999;font-size:10px;min-width:14px">'+(i+1)+'</span>'+
          '<div style="flex:1;min-width:0">'+
            '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+s.name+'</div>'+
            '<div style="font-size:11px;color:#999">'+s.artist+'</div>'+
          '</div>'+
          (i===state.idx&&state.playing?'<span style="color:#7c3aed;font-size:10px">▶</span>':'')+
        '</div>'
      }).join('')
    }
  }
  // 进度条
  $('sp-bar-bg').onclick=function(e){
    var r=this.getBoundingClientRect()
    audio.currentTime=(e.clientX-r.left)/r.width*audio.duration
  }
  // 音量
  volEl.oninput=function(){
    audio.volume=parseFloat(this.value)
    try{localStorage.setItem('sp_vol',this.value)}catch(e){}
  }
  // 键盘
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return
    if(e.code==='Space'&&state.open){e.preventDefault();state.playing?stop():go()}
  })

  // 音乐事件
  audio.addEventListener('timeupdate',render)
  audio.addEventListener('loadedmetadata',render)
  audio.addEventListener('ended',function(){load((state.idx+1)%SONGS.length);go()})

  // 面板展开方向自适应（左右 + 上下）
  function adjustCardSide(){
    var wr=el.getBoundingClientRect()
    var midX=window.innerWidth/2
    // 左右方向
    if(wr.left+wr.width/2>midX){
      card.style.right='0';card.style.left=''
    }else{
      card.style.right='';card.style.left='0'
    }
    // 上下方向：先尝试向上展开，超出顶部才反转
    card.style.top='';card.style.bottom='calc(100% + 8px)'
    // 让浏览器先布局（display已经是block），检查是否超出顶部
    requestAnimationFrame(function(){
      var cardRect=card.getBoundingClientRect()
      if(cardRect.top<0){
        // 超出顶部 → 改为向下展开
        card.style.top='calc(100% + 8px)';card.style.bottom=''
      }
    })
  }

  // 球点击 → 展开/收起（拖拽时不触发）
  ball.onclick=function(){
    if(dx.m)return
    state.open=!state.open
    card.style.display=state.open?'block':'none'
    if(state.open){
      nextCover()
      createRain()
      // 每10秒缓慢渐变切换封面
      if(window._coverTimer)clearInterval(window._coverTimer)
      window._coverTimer=setInterval(nextCover,10000)
    }else{
      if(window._coverTimer)clearInterval(window._coverTimer)
    }
    adjustCardSide()
    render()
  }
  // 点击外部关闭
  document.addEventListener('click',function(e){
    if(state.open&&!el.contains(e.target)){
      state.open=false
      card.style.display='none'
      listEl.style.display='none'
    }
  })

  // 球拖拽
  var dx={a:false,ox:0,oy:0,sx:0,sy:0}
  var _touchDrag=false // 标记来自触摸的拖拽
  var _wasDrag=false   // 标记本次交互是拖动还是点击
  ball.onmousedown=function(e){
    if(_touchDrag){_touchDrag=false;return} // 触摸合成的鼠标事件跳过
    dx.a=true;dx.ox=e.clientX-el.offsetLeft;dx.oy=e.clientY-el.offsetTop;dx.sx=e.clientX;dx.sy=e.clientY
    el.style.transition='none'
    e.preventDefault()
  }
  ball.addEventListener('touchstart',function(e){
    _touchDrag=true
    var t=e.touches[0];dx.a=true;dx.ox=t.clientX-el.offsetLeft;dx.oy=t.clientY-el.offsetTop;dx.sx=t.clientX;dx.sy=t.clientY
  },{passive:true})
  document.addEventListener('mousemove',function(e){
    if(!dx.a)return
    if(Math.abs(e.clientX-dx.sx)>5||Math.abs(e.clientY-dx.sy)>5){dx.m=true;_wasDrag=true}
    var x=e.clientX-dx.ox,y=e.clientY-dx.oy
    el.style.left=Math.max(0,Math.min(x,innerWidth-70))+'px';el.style.top=Math.max(0,Math.min(y,innerHeight-70))+'px';el.style.right='';el.style.bottom=''
    if(state.open)adjustCardSide()
  })
  document.addEventListener('touchmove',function(e){
    if(!dx.a)return;var t=e.touches[0]
    if(Math.abs(t.clientX-dx.sx)>5||Math.abs(t.clientY-dx.sy)>5){dx.m=true;_wasDrag=true}
    if(!dx.m)return
    var x=t.clientX-dx.ox,y=t.clientY-dx.oy
    el.style.left=Math.max(0,Math.min(x,innerWidth-70))+'px';el.style.top=Math.max(0,Math.min(y,innerHeight-70))+'px';el.style.right='';el.style.bottom=''
    if(state.open)adjustCardSide()
    e.preventDefault()
  },{passive:false})
  document.addEventListener('mouseup',function(){if(!dx.a)return;dx.a=false;el.style.transition='';dx.m=false})
  document.addEventListener('touchend',function(){if(!dx.a)return;dx.a=false;el.style.transition='';dx.m=false})

  // 球点击 → 展开/收起（拖拽时不触发）
  ball.onclick=function(){
    if(dx.m||_wasDrag){_wasDrag=false;return}
    _wasDrag=false
    state.open=!state.open
    card.style.display=state.open?'block':'none'
    if(state.open){
      nextCover()
      createRain()
      if(window._coverTimer)clearInterval(window._coverTimer)
      window._coverTimer=setInterval(nextCover,10000)
    }else{
      if(window._coverTimer)clearInterval(window._coverTimer)
    }
    adjustCardSide()
    render()
  }

  // 全局播放函数（供列表点击）
  window.spPlay=function(i){
    if(i===state.idx&&state.playing){stop();return}
    load(i);go()
  }

  // 暗色模式适配
  var obs=new MutationObserver(function(){
    var dark=document.documentElement.getAttribute('data-theme')==='dark'||document.documentElement.classList.contains('dark')
    card.style.background=dark?'#22262e':'#fff'
    card.style.boxShadow=dark?'0 8px 32px rgba(0,0,0,0.5)':'0 8px 32px rgba(0,0,0,0.12)'
    if($('sp-t'))$('sp-t').style.color=dark?'#e0e0e0':'#1e1b4b'
    if($('sp-a'))$('sp-a').style.color=dark?'#888':'#999'
    card.querySelectorAll('.spb').forEach(function(b){b.style.color=dark?'#888':'#999'})
  })
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class']})
  // 初始触发
  obs.takeRecords()
})()

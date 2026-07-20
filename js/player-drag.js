/**
 * 导航栏固定 + PJAX 无感切换
 */
(function(){
  'use strict'

  // CSS：导航栏始终显示
  var c=document.createElement('style')
  c.textContent='#header-nav.header-nav-hidden{top:0!important}'
  document.head.appendChild(c)

  // 导航栏固定
  function cleanNav(){
    var nav=document.querySelector('#header-nav')
    if(nav)nav.classList.remove('header-nav-hidden')
  }
  cleanNav()
  document.addEventListener('scroll',cleanNav,{passive:true})

  // PJAX 无感切换
  var _busy=false,_y=0
  window.addEventListener('pjax:send',function(){_y=window.scrollY||window.pageYOffset||0;_busy=true})
  window.addEventListener('pjax:complete',function(){if(_y>0)window.scrollTo({top:_y,left:0});setTimeout(function(){_busy=false},100)})
  var _st=window.scrollTo.bind(window)
  window.scrollTo=function(){if(_busy&&arguments.length>=2&&arguments[0]===0&&arguments[1]===0)return;_st.apply(window,arguments)}

  document.addEventListener('pjax:complete',function(){setTimeout(cleanNav,300)})
})()

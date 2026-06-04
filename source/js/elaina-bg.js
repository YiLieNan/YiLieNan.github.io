/* 伊蕾娜背景切换效果 */
(function() {
  'use strict';

  // 背景图片列表（6张伊蕾娜壁纸循环切换）
  var bgImages = [];
  for (var i = 1; i <= 6; i++) {
    bgImages.push('/images/backgrounds/bg-' + i + '.webp');
  }

  var currentIndex = 0;
  var bodyEl = document.body;
  var intervalTime = 8000; // 8秒切换一张
  var fadeTime = 1000;     // 1秒淡入

  // 创建背景层容器——作为整个页面最底层
  var bgContainer = document.createElement('div');
  bgContainer.id = 'elaina-bg-container';
  bgContainer.style.cssText = 
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;' +
    'transition:opacity ' + fadeTime + 'ms ease-in-out;';

  var bgImg = document.createElement('div');
  bgImg.id = 'elaina-bg-img';
  bgImg.style.cssText = 
    'width:100%;height:100%;background-size:cover;background-position:center;' +
    'background-repeat:no-repeat;' +
    'background-image:url("' + bgImages[0] + '");';
  
  bgContainer.appendChild(bgImg);
  bodyEl.insertBefore(bgContainer, bodyEl.firstChild);

  // 样式覆盖：隐藏原有头图+banner，让背景透出来
  var style = document.createElement('style');
  style.textContent = 
    /* 导航栏半透明 */
    '#header-nav { background: rgba(0,0,0,0.25) !important; }' +
    '#header-nav .main-nav-link { color: #fff !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }' +
    '#sub-nav .nav-icon { color: #fff !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }' +
    /* 隐藏 banner 图片，保留布局 */
    '.banner { background: transparent !important; min-height: 0 !important; padding: 0 !important; }' +
    '.banner img { display: none !important; }' +
    '.banner .banner-bg { display: none !important; }' +
    '#banner { display: none !important; }' +
    /* 主内容区加半透明背景，让文字可读 */
    '#container { background: rgba(255,255,255,0.85) !important; }' +
    /* 淡入动画 */
    '#elaina-bg-container { opacity:0; }' +
    '#elaina-bg-container.show { opacity:1; }';

  document.head.appendChild(style);

  // 淡入显示
  requestAnimationFrame(function() {
    bgContainer.classList.add('show');
  });

  // 定时切换背景
  function switchBackground() {
    currentIndex = (currentIndex + 1) % bgImages.length;
    bgContainer.style.opacity = '0';
    
    setTimeout(function() {
      bgImg.style.backgroundImage = 'url("' + bgImages[currentIndex] + '")';
      bgContainer.style.opacity = '1';
    }, fadeTime);
  }

  setInterval(switchBackground, intervalTime);
})();

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

  // 创建背景层容器
  var bgContainer = document.createElement('div');
  bgContainer.id = 'elaina-bg-container';
  bgContainer.style.cssText = 
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;' +
    'transition:opacity ' + fadeTime + 'ms ease-in-out;';

  var bgImg = document.createElement('div');
  bgImg.id = 'elaina-bg-img';
  bgImg.style.cssText = 
    'width:100%;height:100%;background-size:cover;background-position:center;' +
    'background-repeat:no-repeat;background-attachment:fixed;' +
    'background-image:url("' + bgImages[0] + '");';
  
  bgContainer.appendChild(bgImg);
  bodyEl.insertBefore(bgContainer, bodyEl.firstChild);

  // 让原有横幅透明以便背景透出
  var style = document.createElement('style');
  style.textContent = 
    '#header-nav { background: rgba(0,0,0,0.3) !important; }' +
    '#header-nav .main-nav-link { color: #fff !important; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }' +
    '#sub-nav .nav-icon { color: #fff !important; }' +
    '.banner { position: relative; background: transparent !important; }' +
    '.banner:after { content: ""; position:absolute; top:0; left:0; width:100%; height:100%; ' +
    '  background: rgba(0,0,0,0.2); z-index:0; }' +
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

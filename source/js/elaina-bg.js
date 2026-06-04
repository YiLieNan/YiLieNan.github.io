/* 伊蕾娜背景切换 - 头图使用背景图片 */
(function() {
  'use strict';

  var bgList = [];
  for (var i = 1; i <= 6; i++) {
    bgList.push('/images/backgrounds/bg-' + i + '.webp');
  }

  var idx = 0;
  var interval = 8000;
  var fade = 1000;
  var bgDiv = null;
  var currentImg = null;

  function init() {
    // 创建背景层
    bgDiv = document.createElement('div');
    bgDiv.id = 'elaina-bg';
    bgDiv.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'z-index:-1;pointer-events:none;transition:opacity ' + fade + 'ms ease;' +
      'background:url(' + bgList[0] + ') center/cover no-repeat';

    // 把背景插入到 body 最前面
    document.body.insertBefore(bgDiv, document.body.firstChild);

    // 添加全局样式
    var style = document.createElement('style');
    style.textContent = 
      /* 导航栏半透明 */
      '#header-nav { background: rgba(0,0,0,0.2) !important; }' +
      '#header-nav .main-nav-link, #sub-nav .nav-icon { color: #fff !important; text-shadow: 0 1px 6px rgba(0,0,0,0.6); }' +
      '#header-nav .main-nav-link:hover { color: #a78bfa !important; }' +
      /* 头图区使用背景 */
      '.banner { background: transparent !important; }' +
      '.banner .banner-bg { opacity: 0 !important; }' +
      /* 主内容区半透明背景确保可读 */
      '#container { background: rgba(255,255,255,0.88) !important; }' +
      '#wrap { background: transparent !important; }' +
      /* 文章和侧边栏背景 */
      '.post, .sidebar, .sidebar-author, .widget-wrap, .archive-year, .category-list-item { background: transparent !important; }' +
      /* 初始隐藏然后淡入 */
      '#elaina-bg { opacity: 0; }' +
      '#elaina-bg.show { opacity: 1; }';

    document.head.appendChild(style);

    // 淡入
    requestAnimationFrame(function() { bgDiv.classList.add('show'); });

    // 定时切换
    setInterval(switchBg, interval);
  }

  function switchBg() {
    idx = (idx + 1) % bgList.length;
    bgDiv.style.opacity = '0';
    setTimeout(function() {
      bgDiv.style.backgroundImage = 'url(' + bgList[idx] + ')';
      bgDiv.style.opacity = '1';
    }, fade);
  }

  // 页面加载完初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

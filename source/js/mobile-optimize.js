/**
 * 移动端优化 — 底部导航栏 + 返回顶部按钮
 * 兼容 PJAX 无刷新跳转
 */

;(function() {
  'use strict';

  // ======== 底部 Tab Bar（由 scripts/sync-nav.js 生成） ========
  var TAB_ITEMS = [
    { label: '首页', url: '/', icon: '🏠' },
    { label: '搜索', url: '/tags', icon: '🔍' },
    { label: '学习', url: '/categories/学习/', icon: '📚' },
    { label: '日常', url: '/categories/日常/', icon: '📝' },
    { label: '关于', url: '/about', icon: '👤' },
    { label: '介绍', url: '/intro', icon: 'ℹ️' },
    { label: 'friend', url: '/friend', icon: '🔗' }
  ];

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function getCurrentPath() {
    return window.location.pathname;
  }

  function buildTabBar() {
    // 只在手机端显示
    if (!isMobile()) return;

    // 防止重复创建
    if (document.getElementById('mobile-tab-bar')) return;

    var bar = document.createElement('nav');
    bar.id = 'mobile-tab-bar';
    bar.setAttribute('aria-label', 'Mobile navigation tabs');

    var currentPath = getCurrentPath();

    TAB_ITEMS.forEach(function(item) {
      var a = document.createElement('a');
      a.className = 'tab-item';
      a.href = item.url;

      // 判断active
      var path = currentPath.replace(/\/$/, '');
      var targetPath = item.url.replace(/\/$/, '');
      var isActive = path === targetPath ||
        (item.url === '/' && path === '') ||
        (targetPath !== '/' && path.startsWith(targetPath));

      if (isActive) {
        a.classList.add('active');
      }

      // 图标
      var icon = document.createElement('span');
      icon.className = 'tab-icon';

      // 尝试使用主题的icon-font，否则用emoji fallback
      // 使用unicode箭头字体图标更美观，但简单起见用emoji
      icon.textContent = item.icon;

      // 标签
      var label = document.createElement('span');
      label.className = 'tab-label';
      label.textContent = item.label;

      a.appendChild(icon);
      a.appendChild(label);
      bar.appendChild(a);
    });

    document.body.appendChild(bar);
  }

  // ======== 返回顶部按钮 ========
  function buildBackToTop() {
    if (!isMobile()) return;
    if (document.getElementById('back-to-top')) return;

    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', '回到顶部');
    btn.innerHTML = '↑';
    btn.title = '回到顶部';

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(btn);

    // 监听滚动显示/隐藏
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 300) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ======== APlayer 位置修正（暴力模式） ========
  function fixAPlayerPosition() {
    if (!isMobile()) return;

    // 注入高优先级 CSS
    var style = document.createElement('style');
    style.textContent = '.aplayer-fixed, .aplayer.aplayer-fixed { bottom: 60px !important; }';
    document.head.appendChild(style);

    // 每秒检查+修正，持续20秒
    var count = 0;
    var timer = setInterval(function() {
      var el = document.querySelector('.aplayer.aplayer-fixed') || document.querySelector('.aplayer-fixed');
      if (el) {
        el.style.setProperty('bottom', '60px', 'important');
      }
      count++;
      if (count > 20) clearInterval(timer);
    }, 100);
  }

  // ======== 初始化 & PJAX 兼容 ========
  function init() {
    buildTabBar();
    buildBackToTop();
    fixAPlayerPosition();
  }

  // DOM 就绪
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // PJAX 页面切换后重新初始化
  document.addEventListener('pjax:complete', function() {
    // 移除旧 tab bar（如果有 PJAX 重建了 body）
    var oldBar = document.getElementById('mobile-tab-bar');
    if (oldBar) oldBar.remove();
    var oldBtn = document.getElementById('back-to-top');
    if (oldBtn) oldBtn.remove();

    buildTabBar();
    buildBackToTop();
    fixAPlayerPosition();
  });

  // 窗口大小变化时重新判断（桌面↔手机切换）
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var bar = document.getElementById('mobile-tab-bar');
      var btn = document.getElementById('back-to-top');
      if (isMobile()) {
        if (!bar) buildTabBar();
        if (!btn) buildBackToTop();
      } else {
        if (bar) bar.remove();
        if (btn) btn.remove();
      }
    }, 200);
  });

})();

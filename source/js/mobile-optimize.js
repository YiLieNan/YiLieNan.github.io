/**
 * 移动端优化 — 底部导航栏（与桌面菜单同步）+ 返回顶部按钮 + 右滑返回
 * 兼容 PJAX 无刷新跳转
 * TAB_ITEMS 由 scripts/sync-nav.js 自动同步
 */

;(function() {
  'use strict';

  // ======== 底部 Tab Bar（由 scripts/sync-nav.js 生成） ========
                                                var TAB_ITEMS = [
    { label: 'home', url: '/', icon: '🏠' },
    { label: '搜索', url: '/tags/', icon: '🔍' },
    { label: '学习', url: '/categories/学习/', icon: '📚' },
    { label: '日常', url: '/categories/日常/', icon: '📝' },
    { label: '关于', url: '/about/', icon: '👤' },
    { label: '介绍', url: '/intro/', icon: 'ℹ️' },
    { label: 'friend', url: '/friend/', icon: '🔗' }
  ];

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function getCurrentPath() {
    return window.location.pathname;
  }

  function buildTabBar() {
    if (!isMobile()) return;
    if (document.getElementById('mobile-tab-bar')) return;

    var bar = document.createElement('nav');
    bar.id = 'mobile-tab-bar';
    bar.setAttribute('aria-label', 'Mobile navigation tabs');

    var currentPath = getCurrentPath();

    TAB_ITEMS.forEach(function(item) {
      var a = document.createElement('a');
      a.className = 'tab-item';
      a.href = item.url;

      var path = currentPath.replace(/\/$/, '');
      var targetPath = item.url.replace(/\/$/, '');
      var isActive = path === targetPath ||
        (item.url === '/' && path === '') ||
        (targetPath !== '/' && path.startsWith(targetPath));

      if (isActive) a.classList.add('active');

      var icon = document.createElement('span');
      icon.className = 'tab-icon';
      icon.textContent = item.icon;

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

  // ======== 右滑返回上一页 ========
  function setupSwipeBack() {
    if (!isMobile()) return;

    var startX = 0, startY = 0, isSwiping = false;

    document.addEventListener('touchstart', function(e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!isSwiping || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;
      if (dx > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        isSwiping = false;
        window.history.back();
      }
    }, { passive: true });

    document.addEventListener('touchend', function() {
      isSwiping = false;
    }, { passive: true });
  }

  // ======== 又拍云禁用 giscus 评论 ========
  function disableGiscusOnUpyun() {
    if (!location.hostname.includes('upcdn')) return;
    var s = document.createElement('style');
    s.textContent = '.giscus-comment,.giscus-frame{display:none!important}';
    document.head.appendChild(s);
  }

  // ======== 初始化 & PJAX 兼容 ========
  function init() {
    buildTabBar();
    buildBackToTop();
    setupSwipeBack();
    disableGiscusOnUpyun();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('pjax:complete', function() {
    var oldBar = document.getElementById('mobile-tab-bar');
    if (oldBar) oldBar.remove();
    var oldBtn = document.getElementById('back-to-top');
    if (oldBtn) oldBtn.remove();

    buildTabBar();
    buildBackToTop();
  });

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

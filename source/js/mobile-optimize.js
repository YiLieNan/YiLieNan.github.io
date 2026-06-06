/**
 * 移动端优化 — 顶部导航栏 + 返回顶部按钮 + 右滑返回
 * 兼容 PJAX 无刷新跳转
 */

;(function() {
  'use strict';

  // ======== 顶部 Tab Bar（由 scripts/sync-nav.js 生成） ========
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
      icon.textContent = item.icon;

      // 标签
      var label = document.createElement('span');
      label.className = 'tab-label';
      label.textContent = item.label;

      a.appendChild(icon);
      a.appendChild(label);
      bar.appendChild(a);
    });

    // 插入到顶栏下方
    var header = document.getElementById('header') || document.querySelector('#header-outer');
    if (header) {
      document.body.insertBefore(bar, header.nextSibling);
    } else {
      document.body.appendChild(bar);
    }

    // 根据顶栏实际高度设置 Tab Bar 位置
    function positionBar() {
      if (!isMobile()) return;
      var h = document.getElementById('header') || document.querySelector('#header-outer');
      if (h) {
        var headerBottom = h.offsetTop + h.offsetHeight;
        bar.style.top = headerBottom + 'px';
        // body padding = 顶栏高度 + Tab Bar 高度
        document.body.style.paddingTop = (headerBottom + bar.offsetHeight) + 'px';
      }
    }
    positionBar();
    window.addEventListener('resize', positionBar);
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

  // ======== 右滑返回上一页 ========
  function setupSwipeBack() {
    if (!isMobile()) return;

    var startX = 0, startY = 0;
    var isSwiping = false;

    document.addEventListener('touchstart', function(e) {
      // 只处理单指滑动
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!isSwiping || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;

      // 右滑超过 80px，且水平距离 > 垂直距离（防止误触上下滑动）
      if (dx > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        isSwiping = false;
        window.history.back();
      }
    }, { passive: true });

    document.addEventListener('touchend', function() {
      isSwiping = false;
    }, { passive: true });
  }

  // ======== APlayer 位置修正 ========
  function fixAPlayerPosition() {
    if (!isMobile()) return;

    var style = document.createElement('style');
    style.textContent = '.aplayer-fixed, .aplayer.aplayer-fixed { bottom: 10px !important; }';
    document.head.appendChild(style);

    var count = 0;
    var timer = setInterval(function() {
      var el = document.querySelector('.aplayer.aplayer-fixed') || document.querySelector('.aplayer-fixed');
      if (el) {
        el.style.setProperty('bottom', '10px', 'important');
      }
      count++;
      if (count > 20) clearInterval(timer);
    }, 100);
  }

  // ======== 初始化 & PJAX 兼容 ========
  function init() {
    buildTabBar();
    buildBackToTop();
    setupSwipeBack();
  }

  // DOM 就绪
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // PJAX 页面切换后重新初始化
  document.addEventListener('pjax:complete', function() {
    var oldBar = document.getElementById('mobile-tab-bar');
    if (oldBar) oldBar.remove();
    var oldBtn = document.getElementById('back-to-top');
    if (oldBtn) oldBtn.remove();

    buildTabBar();
    buildBackToTop();
    // 右滑不需要重建，事件绑定在 document 上持续有效
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

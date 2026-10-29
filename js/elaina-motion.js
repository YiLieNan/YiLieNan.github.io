/* 伊蕾娜动效 v1 — GSAP ScrollTrigger 注入式增强
 * 效果：① 首页文章卡片逐张浮现  ② 顶部导航滚动响应  ③ 文章页阅读进度条
 * 约束：只动 transform/opacity（GPU 合成零重排）；pjax 切页自动清理重建；
 *       系统"减少动态效果"时完全禁用；不依赖主题模板结构，元素不存在则跳过。
 */
(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  var styleInjected = false;
  var refreshTimer = null;

  /* 懒加载图片落位会撑高页面布局，触发点需重算（节流） */
  function scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  }

  function injectStyle() {
    if (styleInjected) return;
    styleInjected = true;
    var s = document.createElement('style');
    s.textContent =
      '#elaina-progress{position:fixed;top:0;left:0;width:100%;height:3px;z-index:9999;' +
      'background:linear-gradient(90deg,#a78bfa,#7c3aed);transform:scaleX(0);transform-origin:left;pointer-events:none}' +
      '#header-nav.elaina-scrolled{box-shadow:0 4px 24px rgba(0,0,0,.18)}';
    document.head.appendChild(s);
  }

  function cleanup() {
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    var p = document.getElementById('elaina-progress');
    if (p) p.remove();
    var nav = document.getElementById('header-nav');
    if (nav) nav.classList.remove('elaina-scrolled');
    // 恢复可能被 gsap.from 初始态冻结的卡片
    document.querySelectorAll('.post-article').forEach(function (el) {
      el.style.opacity = '';
      el.style.transform = '';
    });
  }

  function initMotion() {
    cleanup();
    injectStyle();

    /* ① 首页文章卡片逐张浮现（显式初始态 + batch 回调，refresh 后可靠触发） */
    var cards = document.querySelectorAll('article.post-article');
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 36 });
      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 });
        }
      });
    }

    /* ② 顶部导航滚动响应 */
    var nav = document.getElementById('header-nav');
    if (nav) {
      ScrollTrigger.create({
        start: 60,
        onToggle: function (self) { nav.classList.toggle('elaina-scrolled', self.isActive); }
      });
    }

    /* ③ 文章页阅读进度条（有正文才创建） */
    var body = document.querySelector('.post-content') || document.querySelector('.article-entry');
    if (body) {
      var bar = document.createElement('div');
      bar.id = 'elaina-progress';
      document.body.appendChild(bar);
      gsap.to(bar, {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: body,
          start: 'top 60%',
          end: 'bottom bottom',
          scrub: 0.3
        }
      });
    }

    ScrollTrigger.refresh();
  }

  /* 懒加载图片落位 → 布局变化 → 触发点重算 */
  document.addEventListener('lazyloaded', scheduleRefresh);

  /* pjax 无刷新切页：旧页清理 → 新页重建 */
  document.addEventListener('pjax:send', cleanup);
  document.addEventListener('pjax:complete', function () { setTimeout(initMotion, 80); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(initMotion, 60); });
  } else {
    setTimeout(initMotion, 60);
  }
})();

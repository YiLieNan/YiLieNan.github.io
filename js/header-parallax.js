/**
 * 头图视差滚动 v1（2026-11-20）
 * 往下滑时头图以 0.35 倍速"后退"，产生深度感。
 * 纯 transform，GPU 加速，rAF 节流。
 */
(function () {
  'use strict';
  if (!window.matchMedia) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var header = null;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (!header) header = document.getElementById('header');
      if (!header) return;
      var y = window.scrollY;
      var h = header.offsetHeight || 400;
      // 只在头图可见范围内生效；视差量 = 滚动距离 × 0.35（图比内容"慢"）
      if (y < h * 1.5) {
        header.style.setProperty('--header-parallax', Math.round(y * 0.35) + 'px');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

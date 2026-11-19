/**
 * 平滑滚动 v1（2026-11-19）
 * 轻量 Lenis 风格：拦截 wheel 事件，用 rAF 插值实现惯性滚动。
 * 兼容：手机端跳过（原生触摸已经流畅）；reduced-motion 跳过。
 */
(function () {
  'use strict';

  if (!window.matchMedia) return;
  if (matchMedia('(max-width: 768px)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var current = window.scrollY;
  var target = current;
  var ease = 0.08;
  var running = false;

  function update() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.5) {
      current = target;
      running = false;
      return;
    }
    window.scrollTo(0, current);
    requestAnimationFrame(update);
  }

  window.addEventListener(
    'wheel',
    function (e) {
      if (e.ctrlKey || e.defaultPrevented) return; // 不拦缩放/已处理
      e.preventDefault();
      target = Math.max(0, Math.min(target + e.deltaY * 1.2,
        document.documentElement.scrollHeight - window.innerHeight));
      if (!running) {
        running = true;
        current = window.scrollY;
        requestAnimationFrame(update);
      }
    },
    { passive: false },
  );

  // 点击锚链接/搜索跳转时同步 target
  window.addEventListener('scroll', function () {
    if (!running) {
      current = target = window.scrollY;
    }
  });
})();

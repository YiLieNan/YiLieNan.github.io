/* 液态玻璃光斑跟随 v1（2026-10-28）
 * 桌面鼠标设备上，把指针位置写入玻璃卡片的 --gx/--gy（供 ::after 光斑定位）。
 * 事件委托在 document 上：pjax 切页、动态插入的卡片都天然生效，无需重建。
 * 触屏设备 / 系统"减少动态效果"时整段跳过（光斑由 CSS 隐藏）。
 */
(function () {
  'use strict';

  if (!window.matchMedia) return;
  if (!matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SEL = '.post-wrap,.article-inner,.sidebar-wrap,.widget-wrap,.blog-comments-card,.tool-card';
  var lastEvt = null;
  var raf = 0;

  function apply() {
    raf = 0;
    var ev = lastEvt;
    if (!ev || !ev.target || !ev.target.closest) return;
    var el = ev.target.closest(SEL);
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    el.style.setProperty('--gx', (((ev.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (((ev.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
  }

  document.addEventListener(
    'mousemove',
    function (ev) {
      lastEvt = ev;
      if (!raf) raf = requestAnimationFrame(apply);
    },
    { passive: true },
  );
})();

/**
 * Mesh 渐变呼吸层 v1（2026-11-19）
 * 叠在壁纸轮换之上，canvas 驱动的暖色流体渐变——让背景"活着"。
 * 灵感来自 lomocat.xyz 的 mesh-background，但配色适配伊蕾娜壁纸的暖色系。
 *
 * 实现：3 个大型模糊径向渐变色块在 canvas 上缓慢漂移，
 * mix-blend-mode: overlay 让壁纸透出来，渐变提供"光的流动感"。
 * 手机端降级为 CSS 动画（省 GPU）；reduced-motion 静态。
 */
(function () {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.className = 'elaina-mesh-layer';
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'z-index:0;pointer-events:none;mix-blend-mode:overlay;opacity:0.5';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = matchMedia('(max-width: 768px)').matches;

  // ---- 色块定义（暖色系，呼应伊蕾娜壁纸）----
  var blobs = [
    { hue: 28, sat: 70, light: 55, x: 0.2, y: 0.3, r: 0.5, dx: 0.0003, dy: -0.0002, phase: 0 },
    { hue: 348, sat: 45, light: 60, x: 0.7, y: 0.2, r: 0.45, dx: -0.0002, dy: 0.0003, phase: 2 },
    { hue: 210, sat: 30, light: 60, x: 0.5, y: 0.7, r: 0.55, dx: 0.0002, dy: 0.0002, phase: 4 },
  ];

  var ctx, W, H, running = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function draw(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];
      var bx = (b.x + Math.sin(t * b.dx * 1000 + b.phase) * 0.15) * W;
      var by = (b.y + Math.cos(t * b.dy * 1000 + b.phase) * 0.12) * H;
      var br = b.r * Math.min(W, H);
      var g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, 'hsla(' + b.hue + ',' + b.sat + '%,' + b.light + '%,0.25)');
      g.addColorStop(0.5, 'hsla(' + b.hue + ',' + b.sat + '%,' + b.light + '%,0.08)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  function init() {
    // 在 #container 之前插入（壁纸 z=-1 之上、内容之下）
    var container = document.getElementById('container');
    if (!container) return;
    container.insertBefore(canvas, container.firstChild);
    resize();
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', resize);

    if (reduced || isMobile) {
      // 静态：画一帧就停
      draw(0);
      running = false;
      return;
    }
    running = true;
    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

---
title: 关于我
date: 2026-06-06 18:30:00
---

<div id="intro-app" style="min-height:300px;text-align:center;padding:30px 20px">
  <div style="text-align:center;padding:30px 0 10px">
    <img id="intro-avatar" src="/images/elaina-avatar.webp" style="width:120px;height:120px;border-radius:50%;object-fit:cover;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:3px solid #fff" onerror="this.src='/images/elaina-avatar.webp'">
  </div>
  <h1 id="intro-name" style="font-size:26px;color:#d63031;margin:16px 0 8px;text-align:center">YiLieNan</h1>
  <p id="intro-bio" style="font-size:15px;color:#555;margin:0 0 20px;text-align:center;line-height:1.6">加载中...</p>
  <p id="intro-desc" style="font-size:14px;color:#888;margin:0 0 30px;text-align:center;line-height:1.6"></p>
  <div id="intro-links" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:0 0 30px"></div>
</div>

<script>
fetch('/intro/data.json')
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.avatar) document.getElementById('intro-avatar').src = d.avatar;
    if (d.name) document.getElementById('intro-name').textContent = d.name;
    document.getElementById('intro-bio').textContent = d.bio || '';
    document.getElementById('intro-desc').textContent = d.description || '';
    var linksHtml = '';
    if (d.links && d.links.length) {
      d.links.forEach(function(l) {
        linksHtml += '<a href="' + l.url + '" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:#fce8e8;color:#d63031;text-decoration:none;font-size:14px">' + esc(l.label) + '</a>';
      });
    }
    document.getElementById('intro-links').innerHTML = linksHtml;
  })
  .catch(function() { /* 保留默认显示 */ });
function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
</script>

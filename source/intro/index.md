---
title: 关于我
date: 2026-06-06 18:30:00
---

<div id="intro-app" style="min-height:300px;text-align:center;padding:60px 0;color:#999">加载中...</div>

<script>
fetch('/intro/data.json')
  .then(function(r) { return r.json(); })
  .then(function(d) {
    var html = '';
    html += '<div style="text-align:center;padding:30px 0 10px">';
    html += '<img src="' + (d.avatar || '/images/elaina-avatar.webp') + '" style="width:120px;height:120px;border-radius:50%;object-fit:cover;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:3px solid #fff">';
    html += '</div>';
    html += '<h1 style="font-size:26px;color:#d63031;margin:16px 0 8px;text-align:center">' + esc(d.name || '') + '</h1>';
    if (d.bio) html += '<p style="font-size:15px;color:#555;margin:0 20px 20px;text-align:center;line-height:1.6">' + esc(d.bio) + '</p>';
    if (d.description) html += '<p style="font-size:14px;color:#888;margin:0 20px 30px;text-align:center;line-height:1.6">' + esc(d.description) + '</p>';
    if (d.links && d.links.length) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:0 20px 30px">';
      d.links.forEach(function(l) {
        html += '<a href="' + l.url + '" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:#fce8e8;color:#d63031;text-decoration:none;font-size:14px">' + esc(l.label) + '</a>';
      });
      html += '</div>';
    }
    document.getElementById('intro-app').innerHTML = html;
  })
  .catch(function() {
    document.getElementById('intro-app').innerHTML = '<p style="padding:40px;color:var(--red-1);text-align:center">加载失败</p>';
  });
function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
</script>

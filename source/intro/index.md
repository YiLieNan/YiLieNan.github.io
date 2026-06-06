---
title: 关于我
date: 2026-06-06 18:30:00
---

<div id="intro-app" style="min-height:300px;text-align:center;padding:60px 0;color:var(--grey-9,#999)">加载中...</div>

<script>
fetch('/intro/data.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var html = '';

    // 头像
    html += '<div style="text-align:center;padding:30px 0 10px">';
    html += '<img src="' + data.avatar + '" style="width:120px;height:120px;border-radius:50%;object-fit:cover;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:3px solid var(--red-2,#fff)">';
    html += '</div>';

    // 名字
    html += '<h1 style="text-align:center;font-size:26px;color:var(--red-1,#d63031);margin:16px 0 8px">' + data.name + '</h1>';

    // 简介
    if (data.bio) {
      html += '<p style="text-align:center;font-size:15px;color:var(--color-default,#555);margin:0 20px 20px;line-height:1.6">' + data.bio + '</p>';
    }

    // 详细介绍
    if (data.description) {
      html += '<p style="text-align:center;font-size:14px;color:var(--grey-9,#888);margin:0 20px 30px;line-height:1.6">' + data.description + '</p>';
    }

    // 链接
    if (data.links && data.links.length) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:0 20px 30px">';
      data.links.forEach(function(link) {
        html += '<a href="' + link.url + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:var(--red-5,#fce8e8);color:var(--red-1,#d63031);text-decoration:none;font-size:14px;transition:all 0.2s">';
        html += '<span>' + link.label + '</span>';
        html += '</a>';
      });
      html += '</div>';
    }

    document.getElementById('intro-app').innerHTML = html;
  })
  .catch(function(err) {
    document.getElementById('intro-app').innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--red-1)">加载失败</p>';
  });
</script>

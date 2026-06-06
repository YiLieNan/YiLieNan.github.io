---
title: 标签
date: 2026-06-06 16:00:00
type: tags
---

<div id="tag-app" style="min-height:200px;text-align:center;padding:40px 0;color:var(--grey-9,#999)">加载中...</div>

<script>
fetch('/tags/tags-data.json')
  .then(function(r){ return r.json() })
  .then(function(tags){
    var app = document.getElementById('tag-app');
    if (!tags || !tags.length) {
      app.innerHTML = '<p>暂无标签</p>';
      return;
    }
    var maxCount = Math.max.apply(null, tags.map(function(t){ return t.count }));
    if (maxCount === 0) maxCount = 1;

    var html = '';
    html += '<div style="margin:20px 0">';
    html += '<input type="text" id="tag-search" placeholder="搜索标签..." style="width:100%;padding:12px 16px;border:2px solid var(--red-3,#e8a0a0);border-radius:10px;font-size:16px;background:var(--color-wrap,#fff);color:var(--color-default,#444);outline:none;box-sizing:border-box">';
    html += '</div>';
    html += '<div id="tag-list" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:10px 0">';

    tags.forEach(function(tag){
      var size = 14 + (tag.count / maxCount) * 14;
      var fs = Math.round(size * 10) / 10;
      html += '<a href="' + tag.path + '" style="display:inline-block;font-size:' + fs + 'px;padding:8px 16px;border-radius:10px;background:var(--red-5,#fce8e8);color:var(--red-1,#d63031);text-decoration:none;transition:all 0.2s;white-space:nowrap" onmouseover="this.style.background=\'var(--red-1,#d63031)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'var(--red-5,#fce8e8)\';this.style.color=\'var(--red-1,#d63031)\'">';
      html += tag.name + ' <small style="font-size:0.65em;opacity:0.6">(' + tag.count + ')</small>';
      html += '</a>';
    });

    html += '</div>';

    // Search
    setTimeout(function(){
      var inp = document.getElementById('tag-search');
      var lst = document.getElementById('tag-list');
      if (inp && lst) {
        inp.oninput = function(){
          var q = this.value.toLowerCase().trim();
          var as = lst.getElementsByTagName('a');
          for (var i = 0; i < as.length; i++) {
            as[i].style.display = (!q || as[i].textContent.toLowerCase().indexOf(q) >= 0) ? 'inline-block' : 'none';
          }
        };
      }
    }, 0);

    app.innerHTML = html;
  })
  .catch(function(err){
    document.getElementById('tag-app').innerHTML = '<p style="color:var(--red-1)">加载失败: ' + err.message + '</p>';
  });
</script>

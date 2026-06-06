---
title: 标签
date: 2026-06-06 16:00:00
---

<div id="tag-app" style="min-height:200px">
  <p style="text-align:center;padding:60px 0;color:var(--grey-9,#999)">加载中...</p>
</div>

<script>
fetch('/tags/tags-data.json')
  .then(function(r){ return r.json() })
  .then(function(tags){
    if (!tags || !tags.length) {
      document.getElementById('tag-app').innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--grey-9)">暂无标签</p>';
      return;
    }
    var maxCount = 0;
    tags.forEach(function(t){ if(t.count>maxCount)maxCount=t.count; });
    if (maxCount === 0) maxCount = 1;

    var html = '';

    // 搜索框
    html += '<div style="padding:20px 16px 0">';
    html += '<input type="text" id="tag-search" placeholder="搜索标签..." style="width:100%;padding:10px 14px;border:2px solid var(--red-3,#e8a0a0);border-radius:8px;font-size:14px;background:var(--color-wrap,#fff);color:var(--color-default,#444);outline:none;box-sizing:border-box">';
    html += '</div>';

    // 标签列表 - 模仿主题的 tagcloud 样式
    html += '<div id="tag-list" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:20px 16px">';

    tags.forEach(function(tag){
      var size = 14 + (tag.count / maxCount) * 14;
      var fs = Math.round(size * 10) / 10;
      html += '<a href="' + tag.path + '" style="display:inline-block;font-size:' + fs + 'px;padding:8px 16px;border-radius:8px;background:var(--red-5,#fce8e8);color:var(--red-1,#d63031);text-decoration:none;transition:all 0.2s;white-space:nowrap">';
      html += tag.name;
      html += ' <span style="font-size:0.65em;opacity:0.6">' + tag.count + '</span>';
      html += '</a>';
    });

    html += '</div>';

    document.getElementById('tag-app').innerHTML = html;

    // 搜索过滤
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
  })
  .catch(function(){
    document.getElementById('tag-app').innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--red-1)">加载失败，请刷新重试</p>';
  });
</script>

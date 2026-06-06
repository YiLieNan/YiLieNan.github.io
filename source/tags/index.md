---
title: 标签
date: 2026-06-06 16:00:00
---

<div id="tag-app" style="min-height:200px">
  <p style="text-align:center;padding:60px 0;color:var(--grey-9,#999)">加载中...</p>
</div>

<script>
(function(){
  var tags = null;
  var posts = null;
  var mode = 'tags'; // 'tags' or 'posts'
  var app = document.getElementById('tag-app');

  function render() {
    if (mode === 'tags') renderTags();
    else renderPosts();
  }

  function renderTags() {
    if (!tags || !tags.length) {
      app.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--grey-9)">暂无标签</p>';
      return;
    }
    var maxCount = 0;
    tags.forEach(function(t){ if(t.count>maxCount)maxCount=t.count; });
    if (maxCount === 0) maxCount = 1;

    var html = '';

    // 模式切换
    html += '<div style="display:flex;gap:8px;padding:16px 16px 0">';
    html += '<span style="flex:1;text-align:center;padding:8px 0;border-radius:8px;background:var(--red-1,#d63031);color:#fff;font-size:14px;font-weight:bold">🏷️ 标签</span>';
    html += '<span id="switch-to-posts" style="flex:1;text-align:center;padding:8px 0;border-radius:8px;background:var(--red-5,#fce8e8);color:var(--red-1,#d63031);font-size:14px;cursor:var(--cursor-pointer)">📝 文章</span>';
    html += '</div>';

    // 搜索框
    html += '<div style="padding:12px 16px 0">';
    html += '<input type="text" id="tag-search" placeholder="搜索标签..." style="width:100%;padding:10px 14px;border:2px solid var(--red-3,#e8a0a0);border-radius:8px;font-size:14px;background:var(--color-wrap,#fff);color:var(--color-default,#444);outline:none;box-sizing:border-box">';
    html += '</div>';

    // 标签列表
    html += '<div id="tag-list" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:20px 16px">';
    tags.forEach(function(tag){
      html += '<a href="' + tag.path + '" class="article-tag-list-link" style="display:inline-block;padding:8px 16px;border-radius:8px;background:var(--red-5);color:var(--red-1);text-decoration:none;transition:all 0.2s;white-space:nowrap;font-size:14px;box-shadow:var(--shadow-meta)">';
      html += tag.name;
      html += ' <span style="font-size:0.75em;opacity:0.6">' + tag.count + '</span>';
      html += '</a>';
    });
    html += '</div>';

    app.innerHTML = html;

    document.getElementById('switch-to-posts').onclick = function(){ mode='posts'; render(); };

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
      inp.focus();
    }
  }

  function renderPosts() {
    if (!posts || !posts.length) {
      app.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--grey-9)">暂无文章</p>';
      return;
    }

    var html = '';

    // 模式切换
    html += '<div style="display:flex;gap:8px;padding:16px 16px 0">';
    html += '<span id="switch-to-tags" style="flex:1;text-align:center;padding:8px 0;border-radius:8px;background:var(--red-5,#fce8e8);color:var(--red-1,#d63031);font-size:14px;cursor:var(--cursor-pointer)">🏷️ 标签</span>';
    html += '<span style="flex:1;text-align:center;padding:8px 0;border-radius:8px;background:var(--red-1,#d63031);color:#fff;font-size:14px;font-weight:bold">📝 文章</span>';
    html += '</div>';

    // 搜索框
    html += '<div style="padding:12px 16px 0">';
    html += '<input type="text" id="post-search" placeholder="搜索文章标题..." style="width:100%;padding:10px 14px;border:2px solid var(--red-3,#e8a0a0);border-radius:8px;font-size:14px;background:var(--color-wrap,#fff);color:var(--color-default,#444);outline:none;box-sizing:border-box">';
    html += '</div>';

    // 文章列表
    html += '<div id="post-list" style="padding:16px">';
    posts.forEach(function(p){
      html += '<a href="' + p.path + '" style="display:block;padding:12px 16px;border-radius:8px;background:var(--red-5,#fce8e8);color:var(--color-default,#444);text-decoration:none;transition:all 0.2s;margin-bottom:8px">';
      html += '<span style="font-size:14px;color:var(--red-1,#d63031);font-weight:bold">' + p.title + '</span>';
      if (p.date) html += '<br><span style="font-size:12px;color:var(--grey-9,#999)">' + p.date + '</span>';
      if (p.categories) html += ' <span style="font-size:12px;color:var(--grey-9,#999)">' + p.categories + '</span>';
      html += '</a>';
    });
    html += '</div>';

    app.innerHTML = html;

    document.getElementById('switch-to-tags').onclick = function(){ mode='tags'; render(); };

    var inp = document.getElementById('post-search');
    var lst = document.getElementById('post-list');
    if (inp && lst) {
      inp.oninput = function(){
        var q = this.value.toLowerCase().trim();
        var as = lst.getElementsByTagName('a');
        for (var i = 0; i < as.length; i++) {
          var title = as[i].querySelector('span:first-child');
          var match = !q || (title && title.textContent.toLowerCase().indexOf(q) >= 0);
          as[i].style.display = match ? 'block' : 'none';
        }
      };
      inp.focus();
    }
  }

  // 加载数据
  Promise.all([
    fetch('/tags/tags-data.json').then(function(r){ return r.json(); }).then(function(d){ tags=d; }).catch(function(){}),
    fetch('/tags/posts-data.json').then(function(r){ return r.json(); }).then(function(d){ posts=d; }).catch(function(){})
  ]).then(function(){
    if (!tags && !posts) {
      app.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--red-1)">加载失败</p>';
    } else {
      render();
    }
  });
})();
</script>

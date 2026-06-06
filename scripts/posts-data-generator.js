/**
 * 生成文章标题数据 JSON，供 tags 页面的文章搜索使用
 */
hexo.extend.generator.register("posts-data", function () {
  var posts = this.locals.get("posts");
  if (!posts || !posts.length) return [];

  var data = [];
  posts.forEach(function (p) {
    data.push({
      title: p.title,
      path: "/" + p.path,
      date: p.date ? p.date.format("YYYY-MM-DD") : "",
      categories: p.categories ? p.categories.map(function(c){ return c.name; }).join(",") : "",
    });
  });

  return {
    path: "tags/posts-data.json",
    data: JSON.stringify(data),
    layout: false,
  };
});

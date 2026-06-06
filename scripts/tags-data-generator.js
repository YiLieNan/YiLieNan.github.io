/**
 * 生成标签数据 JSON 供 tags 页面 JS 使用
 */
hexo.extend.generator.register("tags-data", function () {
  var tags = this.locals.get("tags");
  if (!tags || !tags.length) return [];

  var data = [];
  tags.forEach(function (t) {
    data.push({
      name: t.name,
      path: t.path,
      count: t.length,
    });
  });

  return {
    path: "tags/tags-data.json",
    data: JSON.stringify(data),
    layout: false,
  };
});

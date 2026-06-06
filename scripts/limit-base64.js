/**
 * 防止嵌入 base64 大图导致 marked 解析器栈溢出
 * 在渲染前自动移除文章中超过 100KB 的 base64 内嵌图片
 */
hexo.extend.filter.register("before_post_render", function (data) {
  if (!data.content) return;

  // 匹配所有 data:image/ 开头的 base64 URL
  var newContent = data.content.replace(
    /data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]{50000,}/g,
    "\n\n> ⚠️ 图片过大已自动移除，请使用图床外链代替\n\n"
  );

  // 如果内容变了，记个日志
  if (newContent !== data.content) {
    console.log(
      "  [filter] Removed embedded base64 image from:",
      data.source
    );
  }

  data.content = newContent;
});

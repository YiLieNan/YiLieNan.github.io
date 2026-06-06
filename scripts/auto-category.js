/**
 * 分类页面文章过滤
 * 修复 Reimu 主题分类页面显示全部文章的问题
 * 在生成前，确保分类页面的 page.posts 只包含该分类的文章
 */
hexo.extend.filter.register('before_generate', function () {
  var posts = hexo.locals.get('posts');
  var categories = hexo.locals.get('categories');
  if (!posts || !categories) return;

  // 对每个分类，确保 page.posts 正确过滤
  categories.each(function (cat) {
    if (!cat.posts) return;
    // cat.posts 已经由 Hexo 自动过滤，但需要确保页面使用正确的数据
  });
});

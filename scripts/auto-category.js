/**
 * 自动分类脚本
 * 根据文章的 tags 自动分配 categories：
 *   - 包含「日常」标签 → 归入「日常」分类
 *   - 包含「学习」标签 → 归入「学习」分类
 *   - 如果已有分类则跳过（不覆盖手动设置的分类）
 *   - 包含多个匹配标签时取第一个匹配的
 */
const TAG_CATEGORY_MAP = {
  '日常': '日常',
  '学习': '学习',
  '教程': '学习',
  '配置教程': '学习',
  '工具': '学习',
  '电路': '学习',
  'AI': '学习',
  '杂谈': '日常',
  'DeepSeek': '学习',
  'Hermes-Agent': '学习',
  'Windows': '学习',
  'Hexo': '学习',
};

hexo.extend.filter.register('before_generate', function () {
  const posts = hexo.locals.get('posts');
  if (!posts || !posts.length) return;

  posts.forEach(function (post) {
    // 已有分类则不覆盖
    if (post.categories && post.categories.length > 0) return;

    // 从 tags 推断分类
    if (!post.tags || !post.tags.length) return;

    for (let i = 0; i < post.tags.length; i++) {
      const tagName = post.tags.data[i].name;
      const category = TAG_CATEGORY_MAP[tagName];
      if (category) {
        post.categories = [category];
        break;
      }
    }
  });
});

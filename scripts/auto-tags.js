/**
 * 自动标签生成器
 * 在 hexo generate 时根据文章内容自动补全标签
 */
hexo.extend.filter.register('before_post_render', function(data) {
  if (!data.content && !data._content) return data;

  const content = (data.content || data._content || '').toLowerCase();
  const title = (data.title || '').toLowerCase();
  const combined = title + ' ' + content;

  const existingTags = (data.tags || []).map(t => typeof t === 'string' ? t.toLowerCase() : (t.name || '').toLowerCase());

  // 关键词 → 标签映射表
  const rules = [
    // 技术/编程
    { keywords: ['python', 'django', 'flask', 'pip'], tag: 'Python' },
    { keywords: ['javascript', 'js', 'node.js', 'nodejs', 'npm', 'react', 'vue', 'typescript', 'ts'], tag: 'JavaScript' },
    { keywords: ['html', 'css', '网页', '前端', 'web'], tag: '前端' },
    { keywords: ['c语言', 'c语言', 'c++', 'c艹', '指针', 'malloc'], tag: 'C语言' },
    { keywords: ['电路', 'eda', 'pcb', '嘉立创', '立创', 'altium', 'kicad'], tag: '电路' },
    { keywords: ['嵌入式', '单片机', 'stm32', 'esp32', 'arduino', 'rtos', 'freertos'], tag: '嵌入式' },
    { keywords: ['linux', 'ubuntu', 'wsl', 'bash', 'shell', '终端', '命令行'], tag: 'Linux' },
    { keywords: ['git', 'github', '版本控制'], tag: 'Git' },
    { keywords: ['数据库', 'mysql', 'sqlite', 'sql', 'mongodb', 'redis'], tag: '数据库' },
    { keywords: ['docker', '容器', 'k8s', 'kubernetes'], tag: 'Docker' },
    { keywords: ['vim', 'neovim', 'vscode', 'ide', '编辑器'], tag: '编辑器' },

    // 博客相关
    { keywords: ['hexo', '博客', 'reimu', 'blog'], tag: 'Hexo' },
    { keywords: ['github pages', 'github', 'actions', 'ci/cd'], tag: '部署' },

    // AI
    { keywords: ['ai', '人工智能', 'llm', '大模型', 'gpt', 'chatgpt', 'openai', 'claude', 'deepseek', 'hermes', 'agent'], tag: 'AI' },
    { keywords: ['machine learning', '机器学习', '深度学习', 'pytorch', 'tensorflow'], tag: '机器学习' },

    // 硬件/工具
    { keywords: ['硬件', '焊', '万用表', '示波器', '传感器'], tag: '硬件' },
    { keywords: ['windows', 'win', '系统安装', '配置'], tag: 'Windows' },
    { keywords: ['教程', '指南', '配置', '安装', '入门', '上手'], tag: '教程' },
    { keywords: ['markdown', 'md'], tag: 'Markdown' },

    // 日常
    { keywords: ['日记', '日常', '生活', '随笔', '感想', '感悟'], tag: '日常' },
    { keywords: ['动漫', '动画', '番剧', '二次元'], tag: '动漫' },
    { keywords: ['游戏', 'ns', 'switch', 'steam', 'ps5'], tag: '游戏' },
    { keywords: ['摄影', '照片', '相机'], tag: '摄影' },
    { keywords: ['读书', '书单', '阅读', '读后感'], tag: '读书' },
    { keywords: ['音乐', '歌', '网易云', 'aplayer', '播放器'], tag: '音乐' },
    { keywords: ['美食', '做饭', '菜谱', '吃货'], tag: '美食' },
    { keywords: ['旅行', '旅游', '出行', '游记'], tag: '旅行' },

    // 工具
    { keywords: ['效率', '工具', '软件', 'app', '推荐'], tag: '工具' },
    { keywords: ['笔记', 'obsidian', 'notion', 'onenote', 'evernote'], tag: '笔记' },
  ];

  const newTags = new Set(existingTags);
  let added = false;

  for (const rule of rules) {
    // 检查是否已存在同类标签
    const alreadyTagged = existingTags.some(t => {
      const tLower = t.toLowerCase();
      return rule.keywords.some(kw => tLower.includes(kw) || kw.includes(tLower));
    });
    if (alreadyTagged) continue;

    // 检查关键词是否在内容中出现
    const match = rule.keywords.some(kw => combined.includes(kw));
    if (match) {
      newTags.add(rule.tag);
      added = true;
    }
  }

  if (added) {
    data.tags = Array.from(newTags);
  }

  return data;
});

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Retypeset 是基于 Astro 框架的静态博客主题,核心特点是**多语言优先**和**排版美学**。使用 TypeScript + UnoCSS + pnpm 构建。

## 常用命令

```bash
# 开发
pnpm dev              # 运行类型检查 + 启动开发服务器
pnpm build            # 构建生产版本 + 应用 LQIP
pnpm preview          # 预览构建结果

# 代码质量
pnpm lint             # ESLint 检查
pnpm lint:fix         # 自动修复 lint 问题

# 内容管理
pnpm new-post <name>  # 创建新文章(带 frontmatter 模板)
pnpm apply-lqip       # 为图片生成 LQIP 占位符(构建后自动执行)
pnpm format-posts     # 格式化文章内容

# 主题更新
pnpm update-theme     # 从上游拉取主题更新
```

## 核心架构

### 1. 配置系统 (src/config.ts)

整个主题由单一配置文件驱动,包含 8 个配置域:

- **site**: 站点元信息(title/author/url/base)
- **color**: 双主题色系(使用 OKLch 色彩空间)
- **global**: 全局行为(语言/字体/日期格式/TOC/KaTeX)
- **comment**: 评论系统(Giscus/Twikoo/Waline)
- **seo**: SEO 和分析配置
- **footer**: 页脚链接和版权
- **preload**: 性能优化(图片域名预加载)

**重要导出**:
- `allLocales`: 所有启用的语言列表
- `defaultLocale`: 默认语言(不显示在 URL 中)
- `base`: 基础路径(处理子目录部署)

### 2. 国际化架构 (src/i18n/)

四层分离设计,各司其职:

**src/i18n/config.ts** - 语言映射
- `langMap`: 语言代码到 locale 的映射
- 第三方服务(Giscus/Twikoo/Waline)的语言映射

**src/i18n/ui.ts** - UI 翻译
- 支持 11 种语言的界面文本
- 结构: `ui[lang].key`

**src/i18n/lang.ts** - 语言识别
- `getLangFromPath()`: 从 URL 提取当前语言
- `getNextGlobalLang()`: 语言切换循环逻辑

**src/i18n/path.ts** - URL 本地化
- `getPostPath()` / `getTagPath()`: 生成本地化 URL
- `getLocalizedPath()`: 处理 base 路径 + 语言前缀
- `getNextLangPath()`: 语言切换时的 URL 转换

### 3. 内容管理 (src/content/ + src/utils/content.ts)

**Content Collections** (content.config.ts):
- **posts**: 博客文章
  - 必填: `title`, `published`
  - 可选: `description`, `updated`, `tags`, `draft`, `pin`, `toc`, `lang`, `abbrlink`
- **about**: 关于页面(仅需 `lang`)

**关键字段**:
- `lang`: 文章语言,`''` 表示通用文章(在所有语言版本显示)
- `abbrlink`: 自定义短链接(覆盖默认 id)
- `pin`: 置顶优先级(数值越大越靠前)
- `draft`: 草稿标记(只在开发模式显示)

**内容工具函数** (utils/content.ts):
所有函数使用 `memoize` 缓存,避免重复查询:
- `getPosts(lang)`: 获取所有文章(按发布日期倒序)
- `getRegularPosts(lang)` / `getPinnedPosts(lang)`: 分离置顶文章
- `getPostsByYear(lang)`: 按年份分组(归档页)
- `getAllTags(lang)`: 获取所有标签(按文章数排序)
- `getPostsByTag(tag, lang)`: 特定标签的文章

**语言过滤逻辑**:
```typescript
// 显示文章的条件: 匹配当前语言 OR 语言为空(通用文章)
data.lang === currentLang || data.lang === ''
```

### 4. 插件系统 (src/plugins/)

**Remark 插件**(处理 Markdown AST):
- `remark-reading-time.mjs`: 计算阅读时间,注入到 frontmatter
- `remark-container-directives.mjs`: 支持 `:::note` / `:::fold` 容器语法
- `remark-leaf-directives.mjs`: 支持行内指令(Github 卡片/媒体嵌入/音效)

**Rehype 插件**(处理 HTML):
- `rehype-heading-anchor.mjs`: 为标题添加锚点链接
- `rehype-image-processor.mjs`: 处理远程图片 + LQIP 占位符
- `rehype-code-copy-button.mjs`: 代码块复制按钮
- `rehype-external-links.mjs`: 外链添加 `target="_blank"`

**处理链路**: Markdown → Remark 插件 → Rehype 插件 → HTML

### 5. 路由机制 (src/pages/)

使用 Astro **文件系统路由 + Rest 参数**实现多语言:

```
/[...index].astro          # 首页: / 或 /zh/ 或 /en/
/[...posts_slug].astro     # 文章: /posts/hello/ 或 /zh/posts/hello/
/[...tags].astro           # 标签列表
/[...tags_tag].astro       # 单个标签
/[...about].astro          # 关于页
```

**多语言路径生成逻辑**:
1. 默认语言不显示语言前缀: `/posts/hello/`
2. 其他语言添加前缀: `/zh/posts/hello/`, `/en/posts/hello/`
3. `lang: ''` 的文章在所有语言版本都生成路径

### 6. LQIP 优化流程 (scripts/apply-lqip.ts)

**作用**: 为图片生成低质量占位符(Low-Quality Image Placeholder),减少布局偏移

**工作流程**:
1. 扫描 `dist/_astro/**/*.webp` 找到所有构建后的图片
2. 使用 OKLab 色彩算法生成每张图片的 LQIP 值(20-bit 整数)
3. 保存映射到 `src/assets/lqip-map.json`
4. 在 HTML 中注入 CSS 变量 `style="--lqip:123456"`
5. CSS 通过 `--lqip` 解码并显示模糊占位符

**增量更新**: 只处理新图片,已有 LQIP 会被缓存

### 7. 缓存机制 (src/utils/cache.ts)

**核心函数**: `memoize(fn)`
- 缓存异步函数的结果,使用 `JSON.stringify(args)` 作为缓存键
- 缓存的是 Promise 对象(不是结果)
- 失败的 Promise 自动清除(允许重试)

**被缓存的函数**:
- 所有 `utils/content.ts` 中的内容查询函数
- 阅读时间计算
- 标签和文章查询

## 开发注意事项

### 添加新语言
1. 修改 `src/config.ts` 的 `global.moreLocales`
2. 在 `src/i18n/ui.ts` 添加翻译文本
3. 在 `src/content/posts/` 和 `src/content/about/` 添加对应语言的内容

### 创建新文章
```bash
pnpm new-post my-first-post
# 在 src/content/posts/ 生成 my-first-post.md

# 为特定语言创建文章,在 frontmatter 中设置:
lang: 'zh'  # 只在中文版本显示

# 创建通用文章(所有语言都显示),省略 lang 字段或设置:
lang: ''
```

### 自定义插件
在 `src/plugins/` 添加新的 `.mjs` 文件,然后在 `astro.config.ts` 的 `markdown.remarkPlugins` 或 `markdown.rehypePlugins` 中注册。

### 修改主题色
编辑 `src/config.ts` 的 `color.light` 和 `color.dark`,使用 OKLch 色彩空间:
```typescript
light: {
  primary: '62% 0.25 258',  // L C H
  secondary: '80% 0.1 220'
}
```

### 路径别名
TypeScript 配置了路径别名 `@/*` 指向 `src/*`,在导入时使用:
```typescript
import { themeConfig } from '@/config'
```

## 架构亮点

1. **配置驱动**: 用户只需修改 `src/config.ts`,无需改代码
2. **多语言原生**: 从路由到内容到 UI 的完整多语言设计
3. **性能优化**: Memoize 缓存 + LQIP 占位符 + 图片预加载
4. **灵活的内容模型**: 通用文章 + 自定义 URL + 置顶逻辑
5. **类型安全**: 完整的 TypeScript 类型定义
6. **可扩展**: 清晰的插件系统,易于添加新功能

---
name: publish-blog-article
description: Guides article publishing in Astro Retypeset blog with metadata configuration and local validation workflow
---

# 博客文章发布

## 何时使用

- 需要创建或修改博客文章时
- 需要配置文章元数据时
- 需要验证文章格式和显示效果时
- 当用户提到"发布文章"、"写博客"、"添加文章" 、 “检查文章”时

## 使用方法

### 1. 文件位置

所有文章必须放在：`src/content/posts/`

**文件命名：**
- 格式：`.md` 或 `.mdx`
- 使用小写字母、数字、连字符或下划线
- 示例：`restful_api_guide.md`、`markdown-style-guide.md`

### 2. 元数据配置（Frontmatter）

#### 必需字段

```yaml
---
title: 文章标题
published: 2026-01-21
---
```

#### 完整模板

```yaml
---
title: 文章标题
published: 2026-01-21
updated: 2026-01-21
description: 文章简介，50-160字符，用于SEO
tags: [标签1, 标签2, 标签3]
lang: ''
toc: true
draft: false
pin: 0
abbrlink: custom-url-slug
---
```

#### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| **title** | string | ✅ | 文章标题 |
| **published** | date | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| **updated** | date | ❌ | 更新日期，格式 `YYYY-MM-DD` |
| **description** | string | ❌ | 文章简介，50-160字符 |
| **tags** | array | ❌ | 标签数组，建议3-5个 |
| **lang** | string | ❌ | 语言代码，默认 `''` |
| **toc** | boolean | ❌ | 是否显示目录，默认继承全局配置 |
| **draft** | boolean | ❌ | 草稿状态，`true` 不会发布 |
| **pin** | number | ❌ | 置顶优先级，0-99，数值越大越靠前 |
| **abbrlink** | string | ❌ | 自定义URL，只能用小写字母、数字、连字符 |

### 4. 本地验证流程

#### 步骤 1：启动开发服务器

```bash
npm run dev
# 或
pnpm run dev
```

访问：`http://localhost:4321`

#### 步骤 2：验证检查清单

**元数据验证：**
- [ ] `title` 和 `published` 字段存在
- [ ] 日期格式正确（YYYY-MM-DD）
- [ ] `tags` 格式正确（数组）
- [ ] `abbrlink` 只包含小写字母、数字、连字符
- [ ] `draft` 设置正确（false 表示发布）

**内容验证：**
- [ ] 有且只有一个 H1 标题
- [ ] 文章在列表中正常显示
- [ ] 文章详情页正常显示
- [ ] 目录（TOC）正确生成（如果启用）

#### 步骤 3：构建验证

```bash
npm run build
# 或
pnpm run build
```

确认构建成功，无错误信息。

### 5. 使用验证脚本（推荐）

本 Skill 提供了自动化验证脚本，可以快速检查文章格式和构建状态。

#### 文章格式验证

使用 `validate_post.py` 自动检查文章的元数据和内容格式：

```bash
# 验证单个文件
python .agent/skills/PostBlog/validate_post.py src/content/posts/my-article.md

# 验证多个文件
python .agent/skills/PostBlog/validate_post.py src/content/posts/*.md
```

## 快速检查清单

发布前最后检查：

- [ ] 文件在 `src/content/posts/` 目录
- [ ] 包含 `title` 和 `published` 字段
- [ ] 日期格式正确（YYYY-MM-DD）
- [ ] 有且只有一个 H1 标题
- [ ] 运行 `npm run dev` 验证显示正常
- [ ] 运行 `npm run build` 构建成功

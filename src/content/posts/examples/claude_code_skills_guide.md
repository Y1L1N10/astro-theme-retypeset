---
title: Claude Code Skills 入门教程
published: 2026-01-22
updated: 2026-01-22
description: Claude Code Skills 快速入门指南，介绍基础概念、三种内容类型、文件结构规范和最佳实践，帮助你快速上手 Agent Skills
tags: [AI, Claude, Agent Skills, 开发工具, 入门教程]
lang: ''
toc: true
draft: false
pin: 0
abbrlink: claude-code-skills-guide
---
# Claude Code Skills 完整教程

## 目录
1. [什么是 Agent Skills](#什么是-agent-skills)
2. [工作原理](#工作原理)
3. [三种内容类型](#三种内容类型)
4. [Skill 文件结构规范](#skill-文件结构规范)
5. [配置 Skills](#配置-skills)
6. [最佳实践](#最佳实践)

---

## 什么是 Agent Skills

Agent Skills 是 Claude Code 中的可复用知识模块,用于扩展 AI 代理的能力和领域知识。通过 Skills,你可以:

- **传递项目特定知识**:团队的编码标准、架构模式、部署流程等
- **提供技术文档**:API 参考、框架使用指南、最佳实践
- **定义工作流程**:代码审查流程、测试策略、CI/CD 配置
- **共享上下文信息**:项目背景、业务逻辑、技术栈说明

Skills 让 Claude Code 能够以符合你团队标准和项目需求的方式工作,而不需要每次都重复说明相同的信息。

### 核心优势

- **可复用性**:一次编写,多个项目复用
- **一致性**:确保团队成员和 AI 遵循相同的标准
- **效率提升**:减少重复性的上下文说明
- **知识沉淀**:将团队经验转化为可执行的知识库

---

## 工作原理

### 执行流程

```
用户输入 → Claude Code 识别需求 → 加载相关 Skills → 结合 Skills 知识执行任务 → 输出结果
```

### 详细机制

1. **Skills 发现**:Claude Code 在启动时扫描配置的 Skills 目录
2. **内容索引**:解析 Skill 文件,提取元数据和内容摘要
3. **智能匹配**:根据用户任务自动选择相关的 Skills
4. **上下文注入**:将 Skill 内容作为额外上下文提供给 AI
5. **任务执行**:AI 结合 Skill 知识和用户指令完成任务

### 上下文管理

Claude Code 会智能管理上下文窗口:

- 优先加载与当前任务最相关的 Skills
- 动态调整加载的 Skill 数量以适应 token 限制
- 支持 Skill 之间的引用和组合

---

## 三种内容类型

Skills 支持三种主要内容类型,每种适用于不同的场景。

### 1. Markdown 文档 (.md)

**适用场景**:文档、指南、说明性内容

**特点**:
- 易于编写和维护
- 支持丰富的格式化(标题、列表、代码块等)
- 适合描述性知识和流程

**示例**:

```markdown
# 代码审查标准

## 必检项目

- 代码符合 ESLint 配置
- 所有函数都有 JSDoc 注释
- 测试覆盖率不低于 80%
- 无安全漏洞(运行 npm audit)

## 审查流程

1. 开发者提交 PR
2. CI 自动运行测试
3. 至少一位 Senior 开发者审查
4. 所有评论解决后合并
```

### 2. 代码文件 (.js, .py, .ts 等)

**适用场景**:代码模板、配置示例、实现参考

**特点**:
- 提供具体的代码实现
- 可作为复制粘贴的模板
- 展示最佳实践的具体应用

**示例 (TypeScript)**:

```typescript
// API Handler 标准模板

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * 标准 API Handler 结构
 * 
 * 所有 API handlers 必须:
 * 1. 使用 Zod 验证输入
 * 2. 统一错误处理
 * 3. 返回标准格式的响应
 */

// 请求验证 Schema
const RequestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
});

export const exampleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 验证输入
    const validatedData = RequestSchema.parse(req.body);
    
    // 2. 业务逻辑
    const result = await processData(validatedData);
    
    // 3. 返回标准响应
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // 4. 统一错误处理
    next(error);
  }
};
```

### 3. 纯文本文件 (.txt)

**适用场景**:简单说明、配置列表、环境变量

**特点**:
- 极简格式,无额外标记
- 适合简单的列表和说明
- 加载速度快

**示例**:

```
项目环境变量配置说明

开发环境:
- NODE_ENV=development
- API_URL=http://localhost:3000
- DB_HOST=localhost
- LOG_LEVEL=debug

生产环境:
- NODE_ENV=production
- API_URL=https://api.example.com
- DB_HOST=prod-db.example.com
- LOG_LEVEL=error

敏感信息使用 AWS Secrets Manager
数据库密码不得硬编码
```

---

## Skill 文件结构规范

### 基本结构

推荐的 Skills 目录结构:

```
project/
├── .claude/
│   └── skills/
│       ├── coding-standards/
│       │   ├── typescript-style.md
│       │   ├── api-patterns.ts
│       │   └── testing-guide.md
│       ├── deployment/
│       │   ├── aws-deploy.md
│       │   └── env-config.txt
│       └── architecture/
│           ├── system-design.md
│           └── database-schema.sql
└── [项目文件...]
```

### 文件命名规范

**推荐做法**:
- 使用小写字母和连字符:`api-standards.md`
- 描述性名称:`react-component-patterns.md`
- 按主题分类:`testing/unit-test-guide.md`

**避免**:
- 空格或特殊字符:`API Standards.md` ❌
- 过于简短:`std.md` ❌
- 不清晰的缩写:`tsg.md` ❌

### Skill 文件内容规范

每个 Skill 文件应该:

1. **开头包含清晰的标题和目的说明**

```markdown
# React 组件开发规范

本文档定义了项目中 React 组件的开发标准,包括文件结构、命名约定、
状态管理和性能优化最佳实践。
```

2. **结构化组织内容**

```markdown
## 组件文件结构

## 命名约定

## Props 定义

## 状态管理

## 性能优化

## 示例代码
```

3. **包含具体示例**

理论说明 + 代码示例,而不是仅有抽象描述。

4. **保持聚焦和精简**

每个 Skill 专注于一个主题,避免过大的文件。

### 元数据建议 (可选)

在文件开头添加元数据注释:

```markdown
<!--
Skill: React Component Standards
Version: 2.0
Last Updated: 2024-01-15
Author: Engineering Team
Tags: react, frontend, components, standards
-->

# React 组件开发规范
...
```

---

## 配置 Skills

### 方法 1: 使用默认位置

Claude Code 会自动扫描项目根目录下的 `.claude/skills/` 目录:

```bash
# 创建 Skills 目录
mkdir -p .claude/skills

# 添加 Skill 文件
echo "# 我的第一个 Skill" > .claude/skills/my-first-skill.md
```

### 方法 2: 自定义 Skills 路径

通过配置文件指定自定义路径(如果支持):

```json
// .claude/config.json
{
  "skills": {
    "paths": [
      ".claude/skills",
      "docs/development-guides",
      "../shared-skills"
    ]
  }
}
```

### 方法 3: 项目级 vs 全局 Skills

**项目级 Skills** (推荐):
```
your-project/.claude/skills/
```
- 特定于当前项目
- 随项目代码版本控制
- 团队共享

**全局 Skills**:
```
~/.config/claude-code/skills/
```
- 跨项目复用
- 个人偏好设置
- 通用开发标准

### 启用/禁用 Skills

在使用 Claude Code 时,你可以:

```bash
# 使用默认 Skills
claude-code "创建新的 API endpoint"

# 禁用 Skills
claude-code --no-skills "创建新的 API endpoint"

# 只使用特定 Skill
claude-code --skill=api-standards "创建新的 API endpoint"
```

### 验证 Skills 配置

检查 Skills 是否正确加载:

```bash
# 列出所有可用 Skills
claude-code --list-skills

# 查看 Skill 内容
claude-code --show-skill=api-standards
```

---

## 最佳实践

### 1. 保持 Skills 更新

```markdown
建立定期审查机制:
- 每个 Sprint 结束时审查相关 Skills
- 当技术栈升级时更新对应文档
- 新模式出现时及时添加到 Skills
```

### 2. 版本控制

```bash
# Skills 应该纳入版本控制
git add .claude/skills/
git commit -m "Update API standards Skill"
```

### 3. 团队协作

- 将 Skills 作为代码审查的一部分
- 鼓励团队成员贡献和改进 Skills
- 在 onboarding 时介绍项目的 Skills

### 4. 粒度控制

**好的做法** ✅:
- `react-hooks-patterns.md` (专注于 Hooks)
- `api-error-handling.md` (专注于错误处理)
- `database-migrations.md` (专注于数据库迁移)

**避免** ❌:
- `everything-about-react.md` (过于宽泛)
- `all-standards.md` (内容过多)

### 5. 使用层次化组织

```
skills/
├── foundation/          # 基础规范
│   ├── git-workflow.md
│   └── code-style.md
├── backend/             # 后端相关
│   ├── api-design.md
│   └── database.md
└── frontend/            # 前端相关
    ├── react-patterns.md
    └── css-conventions.md
```

### 6. 提供上下文和理由

不仅说"做什么",还要说"为什么":

```markdown
## 使用 TypeScript 严格模式

所有项目必须启用 TypeScript 的严格模式:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**原因**:
- 在编译时捕获更多潜在错误
- 提高代码可维护性
- 强制更好的类型定义习惯
```

### 7. 包含反例

展示正确和错误的做法:

```markdown
## API 响应格式

✅ **正确**:
```json
{
  "success": true,
  "data": { "id": 123, "name": "John" },
  "meta": { "timestamp": "2024-01-15T10:00:00Z" }
}
```

❌ **错误**:
```json
{
  "id": 123,
  "name": "John"
}
```

缺少 success 标志和元数据。
```

### 8. 测试 Skills 效果

定期验证 Skills 是否有效:

```bash
# 使用 Skill 完成任务
claude-code "按照我们的标准创建新的 API endpoint"

# 检查生成的代码是否符合 Skill 中的规范
```

### 9. 文档化例外情况

```markdown
## 命名约定

### 一般规则
组件使用 PascalCase: `UserProfile.tsx`

### 例外情况
- 页面组件可以使用小写:`index.tsx`
- 工具函数文件使用 camelCase:`formatDate.ts`
- 常量文件使用 UPPER_CASE:`API_ENDPOINTS.ts`
```

### 10. 建立反馈循环

```markdown
在 Skill 中添加:

## 反馈和改进

如果你发现此标准有问题或有改进建议:
1. 在 #engineering-standards Slack 频道讨论
2. 提交 PR 更新此文档
3. 在团队会议中提出

最后更新: 2024-01-15
维护者: @engineering-team
```

---

## 总结

Agent Skills 是 Claude Code 的强大功能,通过系统化地组织和传递项目知识,可以显著提升 AI 辅助开发的效率和质量。

**关键要点**:
- Skills 让 AI 理解你的项目标准和最佳实践
- 支持 Markdown、代码文件和纯文本三种格式
- 遵循清晰的文件结构和命名规范
- 持续更新和维护 Skills 以保持相关性
- 将 Skills 纳入团队的开发流程和版本控制

开始使用 Skills,让 Claude Code 成为真正了解你项目的智能开发助手!

---

*本文档基于 Claude Code 的 Skills 功能编写。如需了解最新特性,请访问 [Claude Code 官方文档](https://docs.claude.com)。*
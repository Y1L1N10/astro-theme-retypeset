---
title: Claude Code 团队的 10 个使用技巧
published: 2026-02-10
description: 本文分享了来自 Claude Code 团队的 10 个实用技巧，包括并行工作、Plan Mode 纪律性使用、持续优化 CLAUDE.md、复用 Skills 等核心建议。
tags: [Claude Code, AI, 生产力, 技巧]
abbrlink: claude-code-10-tips
---

# Claude Code 团队的 10 个使用技巧

> 来源：Boris Cherny (@bcherny) - Claude Code 创建者
> 发布时间：2026年1月31日
> 原推文：https://x.com/bcherny/status/2017742741636321619

---

## 前言

这些技巧来自 Claude Code 团队的实际使用经验。**重要提醒：没有唯一正确的使用方式**，每个人的设置都不同。你应该实验并找到最适合自己的工作流程。

---

## 1. 并行工作 (Do More in Parallel)

**团队第一推荐：单个最大的生产力解锁**

- 同时运行 **3-5 个 git worktrees**，每个运行独立的 Claude 会话
- 部分人设置 shell 别名（如 `za`, `zb`, `zc`）实现一键切换
- 部分人设立专门的 **"analysis" worktree**，仅用于读取日志和运行 BigQuery
- Boris 个人使用多个 git checkouts 而非 worktrees

**参考文档：**
https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees

---

## 2. Plan Mode 的纪律性使用

**每个人都用 Plan Mode，但纪律各不相同**

- 每个复杂任务都从 Plan Mode 开始，把精力投入到计划中，让 Claude 一次完成实现
- **团队技巧：** 让一个 Claude 写计划，再启动第二个 Claude 以"资深工程师"身份审核计划后再执行
- **关键洞察：** 当任务出现问题时，切回 Plan Mode 重新规划，不要继续硬推
- 也可将 Plan Mode 用于验证步骤，不仅仅是实现

---

## 3. 持续优化 CLAUDE.md

**让 Claude 为自己编写规则**

- 每次修正错误后，在提示词结尾加上：**"更新你的 CLAUDE.md，避免再犯这个错误"**
- Claude 擅长为自己编写规则
- 团队无情地持续编辑 CLAUDE.md，迭代直到 Claude 的错误率明显下降
- 一位工程师让 Claude 为每个任务/项目维护笔记目录，每次 PR 后更新，然后在 CLAUDE.md 中指向这些笔记

---

## 4. 创建并复用 Skills，提交到 git

**团队建议的 Skills 使用场景：**

- 如果某件事你每天做超过一次，就把它转化为 skill 或 command
- 创建 `/techdebt` 斜杠命令，在每次会话结束时查找并清理重复代码
- 设置斜杠命令同步 7 天的 Slack、GDrive、Asana 和 GitHub 到一个上下文转储
- 构建类似分析工程师的 agents，编写 dbt 模型、审查代码、在开发环境测试变更

**参考文档：**
https://code.claude.com/docs/en/skills#extend-claude-with-skills

---

## 5. Claude 自主修复大部分 Bug

**团队的做法：**

- 启用 Slack MCP，直接粘贴 Slack bug 讨论串到 Claude，说"修复它"。零上下文切换
- 或者直接说"去修复失败的 CI 测试"，不要微观管理具体怎么做
- 让 Claude 查看 docker logs 来排查分布式系统问题 —— Claude 在这方面能力惊人

---

## 6. 提升提示词水平

**团队技巧：**

- 使用对抗性提示：**"严格审查我的这些改动，在我通过你的测试之前不要创建 PR"**
- 让 Claude 挑战你

---

## 7. 充分利用 MCP 集成

**连接你的工具栈**

- 使用 MCP 工具访问 Slack、BigQuery、Sentry 等
- 直接从代码库、讨论串、数据库中提取上下文

---

## 8. 长时间运行的任务

**三种处理方式：**

1. 提示 Claude 在任务完成时使用后台 agent 验证其工作
2. 使用 agent Stop hooks 进行更确定性的验证
3. 使用 ralph-wiggum 插件（由 @GeoffreyHuntley 原创构思）

**无阻塞运行：**
- 在沙箱中使用 `--permission-mode=dontAsk` 或 `--dangerously-skip-permissions`，让 Claude 持续工作不被权限提示阻塞

**参考资源：**
- https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-wiggum
- https://code.claude.com/docs/en/hooks-guide

---

## 9. 构建反馈循环验证工作成果

**最重要的建议：给 Claude 验证其工作的方法**

- 如果 Claude 拥有反馈循环，最终结果质量能提升 **2-3 倍**
- 验证方式因领域而异：可能简单如运行 bash 命令、运行测试套件、或在浏览器/手机模拟器中测试应用
- **确保投入精力让验证机制坚如磐石**
- Boris 的例子：Claude 使用 Claude Chrome 扩展测试 claude.ai/code 的每个变更，打开浏览器测试 UI，迭代直到代码工作且用户体验良好

**参考文档：**
https://code.claude.com/docs/en/chrome

---

## 10. 用 Claude 学习

**团队使用 Claude Code 学习的技巧：**

### a. 启用解释性输出
在 `/config` 中启用 **"Explanatory"** 或 **"Learning"** 输出样式，让 Claude 解释变更背后的 **"为什么"**

### b. 生成可视化演示
让 Claude 生成可视化的 HTML 演示文稿，解释不熟悉的代码。效果出奇地好！

### c. ASCII 图表
要求 Claude 绘制新协议和代码库的 ASCII 图表帮助你理解

### d. 间隔重复学习 Skill
构建间隔重复学习 skill：你解释自己的理解，Claude 提问以填补空白，存储结果

---

## 核心理念

**10 个技巧，10 种不同的工作流**

一致性不在于具体技术，而在于底层哲学：

1. **并行优于优化：** 运行更多会话，而非更聪明的会话
2. **Plan Mode 用于恢复：** 不仅是设置，更是遇到困难时的重置手段
3. **Claude 自我改进：** 让它为自己编写规则
4. **强制验证：** 建立反馈循环确保质量

---

## 参考资源

- Boris Cherny Twitter: [@bcherny](https://x.com/bcherny)
- Claude Code 文档: https://code.claude.com/docs
- 原始推文: https://x.com/bcherny/status/2017742741636321619

---

**记住：没有唯一正确的方式。实验并找到适合你的工作流程！**

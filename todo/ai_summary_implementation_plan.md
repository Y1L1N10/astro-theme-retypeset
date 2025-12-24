# AI 文章总结功能实施方案

本文档详细说明了在 `astro-theme-retypeset` 框架中集成 AI 文章总结功能的技术细节、实施步骤及前期准备。

---

## 一、 前期准备 (User Checklist)

在开始代码实现前，您需要准备以下资源：

1.  **Gemini API Key**: 
    *   前往 [Google AI Studio](https://aistudio.google.com/) 申请。
    *   推荐使用 **Gemini 1.5 Flash**，其响应速度快且免费额度足以支撑个人博客。
2.  **环境变量配置**:
    *   在本地项目根目录的 `.env` 文件中添加：`GEMINI_API_KEY=你的密钥`。
    *   后续部署（如 Vercel/Netlify）时，需在对应的控制面板设置该环境变量。
3.  **运行环境确认**:
    *   确保您的 Astro 项目支持 **SSR (Server Side Rendering)** 或有 **API Routes** 支持。如果目前是纯静态导出，可能需要切换到 `output: 'server'` 或 `hybrid` 模式以支持 API 请求转发。

---

## 二、 实施策略 (Strategy)

### 核心路径：API 转发 + 客户端渲染
为了兼顾 SEO 和加载速度，我们采取以下策略：
1.  **按需生成**：总结内容不由静态构建生成，而是用户进入页面后手动点击或自动异步触发。
2.  **中转服务**：通过 Astro API Routes 转发请求，隐藏 API Key 并处理提示词（Prompt）。
3.  **流式输出 (Streaming)**：采用 SSE (Server-Sent Events) 让 AI 逐字吐出内容，提升“智能感”。
4.  **本地缓存**：将生成的总结存入浏览器的 `localStorage`，避免同一篇文章重复消耗 Token。

---

## 三、 具体实现方案 (Implementation Plan)

### 1. 后端：API 路由 (Serverless Function)
*   **路径**: `src/pages/api/ai-summary.ts`
*   **职责**: 
    *   接收文章正文（或部分摘要）。
    *   构造特定的系统 Prompt（例如：“你是一个阅读助手，请用三句话总结以下文章，并使用和正文一致的语言...”）。
    *   调用 Google AI SDK 并将结果流式返回。

### 2. 前端：AI 总结组件 (Astro Component)
*   **路径**: `src/components/AI/AISummary.astro`
*   **功能模块**:
    *   **UI层**: 一个带有“AI”标识的卡片，使用毛玻璃效果，渐变边框。
    *   **逻辑层**:
        *   检查 `localStorage` 是否已有缓存。
        *   调用 `/api/ai-summary` 接口。
        *   处理流式读取（TransformStream）。
        *   打字机动画展示。
    *   **交互层**: 包含“重新生成”、“复制总结”等微交互。

### 3. 集成：模板注入
*   **路径**: `src/pages/[...posts_slug].astro`
*   **操作**:
    *   在文章标题与正文之间插入 `<AISummary />` 组件。
    *   通过 Props 传递文章正文 (`post.body`) 或清理后的纯文本。

---

## 四、 视觉美化方案 (Aesthetics)

为了匹配 `retypeset` 主题的高级感：
*   **色彩**: 使用 `primary` 色的透明度变化（如 `bg-primary/5`）。
*   **边框**: 动态流光边框动画（AI 计算中...）。
*   **字体**: 使用精致的衬线体或针对总结文本进行排版微调。
*   **动效**: 使用 UnoCSS 的 `transition` 和 `animate-fade-in`，让卡片平滑出现。

---

## 五、 实施路线图 (Roadmap)

1.  **Step 1**: 确定 API 通路，实现基础的“点击 -> 后端取回 -> 显示”闭环。
2.  **Step 2**: 完善 UI 设计，接入 UnoCSS 样式和加载动画。
3.  **Step 3**: 优化体验，实现流式输出（Streaming）和本地存储。
4.  **Step 4**: 针对多语言文章（zh/en）进行 Prompt 优化。

---

> [!NOTE]
> 文档创建日期：2025-12-18
> 状态：待启动 (Pending)

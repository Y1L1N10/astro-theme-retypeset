---
title: 在 Astro 中集成 Cursify 弹力足球光标特效
published: 2025-12-24
description: '记录了在 Astro 博客项目中集成 Cursify Springy Cursor 特效的全过程，包括 React 组件集成、Lint 修复、View Transitions 持久化以及针对 Chrome 缩放的坐标系修复。'
updated: ''
tags:
  - Astro
  - React
  - Cursify
  - Frontend
draft: false
pin: 0
toc: true
lang: zh
abbrlink: integrate-cursify
---

本文记录了将 [Cursify](https://cursify.vercel.app/components/springy-cursor) 的 "Springy Cursor"（弹力足球）鼠标特效集成到基于 Astro 的博客项目中的完整过程。

## 1. 集成步骤

### 1.1 安装依赖
首先需要为 Astro 项目添加 React 支持，并安装动画相关的依赖。

```bash
# 1. 安装 React 集成
npx astro add react

# 2. 安装核心依赖
pnpm add motion clsx tailwind-merge
```

### 1.2 移植 `cn` 工具函数
Cursify 的组件依赖 `clsx` 和 `tailwind-merge` 来处理样式类名。

```typescript
import type { ClassValue } from 'clsx'
// src/utils/cn.ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
> **注意**：这里特意将 `import type` 与普通 `import` 分开，以符合项目的 ESLint 规范。

### 1.3 创建 React 组件
在 `src/components/React/SpringyCursor.tsx` 中实现了光标逻辑。该组件基于原生 Canvas API，通过物理弹簧模型模拟了足球的跟随和回弹效果。

### 1.4 全局引入
为了让特效全站生效，我们将其添加到主布局文件 `src/layouts/Layout.astro` 中。

```astro
<!-- src/layouts/Layout.astro -->
<body>
  <!-- 必须在客户端挂载 -->
  <SpringyCursor client:only="react" transition:persist transition:name="cursor-overlay" />
  <slot />
</body>
```

## 2. 遇到的问题及解决方案

### 问题一：特效与指针错位 (Chrome Zoom 问题)
**现象**：在设置了 `html { zoom: 0.9 }` 的网站中，Springy Cursor 的特效中心与鼠标指针不重合，且当鼠标还没移动到屏幕底部时，足球就已经发生了反弹（“提前触底”）。

**原因**：Chrome 的 `zoom` 属性会非线性地影响 `visual viewport`。Canvas 获取到的 `window.innerHeight` 是逻辑像素，而在 `zoom: 0.9` 下，Canvas 自身的渲染像素被挤压，导致物理坐标系不匹配。

**解决方案**：实施“反向缩放” (Inverse Zoom)。
在 Canvas 组件初始化时，检测全局 zoom 值并在 Canvas 样式上做反向抵消，强制其回归 1:1 的视口比例。

```typescript
function onWindowResize() {
  // 获取全局 zoom (Chrome 非标准属性)
  // @ts-expect-error - zoom is non-standard
  const rootZoom = Number.parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1

  // 反向抵消缩放
  canvas.style.zoom = (1 / rootZoom).toString()

  // 强制分辨率与视口 1:1 对齐
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
```

### 问题二：页面切换时特效重置
**现象**：点击导航链接切换页面时，光标特效会消失并重新从左上角加载。

**原因**：Astro 的 View Transitions 在页面导航时会卸载并重绘 Body 内容。如果组件位置在 DOM 树中发生了变化（即使看起来没变，但父容器层级变了），状态就会丢失。

**解决方案**：
1.  **持久化指令**：给组件添加 `transition:persist` 属性。
2.  **提升层级**：将组件移到 `<body>` 的**最顶层**，确保它不被任何条件渲染的容器包裹。ASTRO 只有在组件于 DOM 树中的位置完全固定时，才能正确识别并复用它。

### 问题三：系统光标干扰
**现象**：网页上同时显示原生的箭头光标和足球光标，视觉效果混乱。

**解决方案**：在全局 CSS 中隐藏系统光标。

```css
/* src/styles/global.css */
/* 暂时保留了系统光标以便调试，如需隐藏可重新添加以下代码 */
/*
body, a, button, [role="button"] {
  cursor: none;
}
*/
```
*(注：后续为了用户体验，我们选择保留了系统光标，仅作为装饰性跟随特效)*

## 3. 最终效果
- **精准跟随**：无论页面如何缩放，足球始终紧贴鼠标。
- **物理边界**：足球只有在真正触碰到屏幕边缘时才会回弹。
- **跨页保持**：在不同页面间跳转时，足球运动状态无缝衔接，不再重置。

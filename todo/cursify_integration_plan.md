# 实施计划：集成 Cursify 鼠标特效 (Springy Cursor)

该计划旨在说明如何在你当前的 Astro 项目（基于 UnoCSS）中集成 [Cursify](https://cursify.vercel.app/components/springy-cursor) 的鼠标特效。

## 1. 环境准备

由于 Cursify 的组件是基于 React 和 Framer Motion 构建的，我们需要先为项目添加 React 支持。

### 1.1 安装 React 集成
在终端运行以下命令：
```bash
npx astro add react
```
*该命令会自动更新 `astro.config.ts` 并安装 `react` 和 `react-dom`。*

### 1.2 安装核心依赖
安装 Cursify 组件所需的工具库和动画库：
```bash
pnpm add motion clsx tailwind-merge
```

## 2. 基础配置

### 2.1 创建样式工具函数
Cursify 使用 `cn` 函数来处理类名合并。在你的项目工具文件夹中创建或更新：

**文件路径：** `src/utils/cn.ts`
```typescript
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 3. 组件实现

### 3.1 复制组件代码
在 `src/components` 下创建一个专门存放 React 组件的文件夹，并添加 `SpringyCursor` 代码。

**文件路径：** `src/components/React/SpringyCursor.tsx`
> 提示：从 [Cursify 源代码](https://cursify.vercel.app/components/springy-cursor) 复制具体的代码实现，并确保导入上述的 `cn` 函数。

### 3.2 自定义 Hook (use-mouse)
Cursify 多数组件引用了 `use-mouse.tsx`。
**文件路径：** `src/hooks/use-mouse.tsx` (或者放在 React 组件同级)

## 4. 页面集成

### 4.1 全局引入特效
为了让全站生效，需要修改主布局文件。

**文件路径：** `src/layouts/Layout.astro`

```astro
---
// 在 Frontmatter 部分引入组件
import SpringyCursor from '../components/React/SpringyCursor';
---

<html>
  <body>
    <!--
      使用 client:only="react"
      因为鼠标特效依赖于浏览器 API (window/document)，
      必须强制在客户端渲染。
    -->
    <SpringyCursor client:only="react" />
    <slot />
  </body>
</html>
```

## 5. UnoCSS / Tailwind 兼容性说明
你的项目目前使用 `UnoCSS`。
- **无需额外配置**: 你的 `uno.config.ts` 已包含 `presetWind3()`，它完美兼容 Cursify 使用的 Tailwind CSS 语法（如 `fixed`, `pointer-events-none`, `z-50` 等）。
- **指针隐藏**: 如果生效后出现双光标，请在全局 CSS 中添加：
  ```css
  html, body {
    cursor: none;
  }
  a, button {
    cursor: none;
  }
  ```

---
**状态**: ⏳ 等待实施
**参考文档**: [Cursify Get Started](https://cursify.vercel.app/get-started)

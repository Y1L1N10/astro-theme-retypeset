---
title: Web 渲染模式简明指南
published: 2025-12-18
description: 深入浅出地讲解 SSG、SSR、CSR、ISR、孤岛架构及水合等多种 Web 渲染模式，通过披萨外卖的比喻助你轻松理解现代 Web 开发核心概念。
tags:
  - Web 开发
  - 渲染模式
  - 前端性能设计
  - Astro
lang: zh
abbrlink: simple-web-rendering
---

> 用最简单的方式理解现代 Web 开发

---

## 🍕 三种渲染方式（用披萨外卖比喻）

### 1. SSG - 预制披萨（Static Site Generation）

```
早上 8 点 → 披萨店做好所有披萨 → 放在保温箱
顾客来了 → 直接拿 → 0 等待 ⚡⚡⚡
```

**代码示例**：
```javascript
// 构建时生成 HTML
npm run build
// ↓
dist/
  ├── index.html        ✅ 已生成
  ├── blog/post-1.html  ✅ 已生成
  └── blog/post-2.html  ✅ 已生成
```

**适合**：博客、文档、营销页面
**速度**：⚡⚡⚡ 超快
**缺点**：内容更新需要重新构建

---

### 2. SSR - 现做披萨（Server-Side Rendering）

```
顾客点单 → 厨师现做 → 等 3 分钟 → 拿到热披萨
```

**代码示例**：
```javascript
// 每次请求时生成 HTML
app.get('/blog/:id', async (req, res) => {
  const post = await db.getPost(req.params.id) // 实时获取数据
  const html = render(<BlogPost post={post} />) // 渲染成 HTML
  res.send(html) // 返回完整页面
})
```

**适合**：需要实时数据的页面（股票、天气、个性化内容）
**速度**：⚡ 中等
**优点**：内容总是最新的

---

### 3. CSR - 半成品披萨（Client-Side Rendering）

```
顾客收到 → 面团 + 配料 → 自己在家烤 → 等待
```

**代码示例**：
```html
<!-- 服务器返回 -->
<html>
  <body>
    <div id="app"></div>  <!-- 空的！ -->
    <script src="app.js"></script>  <!-- 浏览器下载并执行 -->
  </body>
</html>
```

```javascript
// JS 下载后在浏览器执行
fetch('/api/posts').then((data) => {
  document.getElementById('app').innerHTML = renderPosts(data)
})
```

**适合**：后台管理、需要登录的应用
**速度**：🐢 首次慢
**优点**：交互流畅、服务器压力小

---

## 📊 快速对比表

| 方式 | 何时生成 HTML | 速度 | SEO | 适用场景 |
|------|--------------|------|-----|----------|
| **SSG** | 构建时 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 博客、文档 |
| **SSR** | 请求时 | ⚡⚡ | ⭐⭐⭐⭐⭐ | 新闻、电商 |
| **CSR** | 浏览器端 | ⚡ | ⭐⭐ | 管理后台 |

---

## 🎯 你的博客应该用什么？

### 混合模式（最佳实践）

```
博客文章（99% 流量）  → SSG    ⚡⚡⚡ 极速
管理后台（1% 流量）   → SSR    ⚡   够用
```

**Astro 配置**：
```javascript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid', // 混合模式！
})
```

```astro
---
// 文章页面 - 静态生成
export const prerender = true;
---
<h1>我的博客文章</h1>

---
// 编辑器页面 - 服务器渲染
export const prerender = false;
---
<h1>在线编辑器</h1>
```

---

## 🚀 进阶概念（3 个核心）

### 1. ISR - 增量静态再生成

```
第一次访问 → 返回缓存的 HTML（快）
60 秒后   → 后台更新 HTML
下次访问  → 返回新的 HTML
```

**用途**：内容不常更新，但又需要偶尔刷新（产品页面）

---

### 2. Islands Architecture - 孤岛架构

```html
<html>
  <header>纯 HTML</header>           <!-- 无 JS -->

  <main>纯 HTML 文章内容</main>      <!-- 无 JS -->

  <SearchWidget />                   <!-- 有 JS 🏝️ -->

  <CommentForm />                    <!-- 有 JS 🏝️ -->

  <footer>纯 HTML</footer>           <!-- 无 JS -->
</html>
```

**好处**：只在需要的地方加载 JS，其他都是轻量的 HTML

**代表框架**：Astro（你正在用的！）

---

### 3. Hydration - 水合/激活

```
服务器生成 HTML → 发送到浏览器 → 立即可见 ✅
                                ↓
                        JS 下载并执行
                                ↓
                        页面变得可交互 ✅
```

**例子**：
```javascript
// 1. 服务器生成
<button>点击我</button> // 可见但点击无效

// 2. JS 加载后 "激活"
ReactDOM.hydrate(
  <button onClick={handleClick}>点击我</button>,
  document.getElementById('root')
)
// 现在可以点击了！
```

---

## 💡 性能优化核心 3 招

### 1. 代码分割（Code Splitting）

```javascript
// ❌ 坏：一次加载所有
import Home from './Home';
import Blog from './Blog';
import About from './About';
// 打包后 → bundle.js (1.5MB) 太大！

// ✅ 好：按需加载
const Home = lazy(() => import('./Home'));
const Blog = lazy(() => import('./Blog'));
// 访问首页 → 只下载 home.js (200KB)
// 访问博客 → 才下载 blog.js (300KB)
```

---

### 2. 图片优化

```html
<!-- ❌ 坏 -->
<img src="photo.jpg">  <!-- 可能是 5MB 的原图 -->

<!-- ✅ 好 -->
<img
  src="photo.webp"           <!-- 现代格式，体积小 50% -->
  loading="lazy"             <!-- 快到屏幕时才加载 -->
  width="800"
  height="600"               <!-- 防止页面跳动 -->
  alt="描述"
>
```

---

### 3. CDN 缓存

```
用户在新加坡 → 访问你的网站
    ↓
CDN 节点（新加坡）← 就近访问，50ms ⚡
    ↓
源服务器（美国）  ← 第一次才访问，500ms
```

---

## 🛠️ 常见框架选择

### 个人博客 → Astro
```javascript
// 零配置，默认就很快
export default defineConfig({
  // 简单！
})
```

### React 全栈 → Next.js
```javascript
// 功能最全，生态最好
export default async function Page() {
  const data = await fetch('...')
  return <div>{data.title}</div>
}
```

### Vue 全栈 → Nuxt
```vue
<script setup>
const { data } = await useFetch('/api/posts');
</script>
```

### 追求性能 → Astro + React Islands
```astro
---
// 大部分静态，少量交互
---
<StaticContent />
<InteractiveWidget client:load />
```

---

## ✅ 记住 3 个关键点

1. **SSG 速度最快**，适合不常变的内容（你的博客文章）
2. **SSR 内容最新**，适合实时数据（你的编辑器）
3. **混合模式最实用**，根据页面选择不同策略

---

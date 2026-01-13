---
title: GitHub Actions 入门完整指南
published: 2026-01-13
description: 从零开始学习 GitHub Actions 和 YAML，30 分钟快速上手自动化工作流
tags: [GitHub Actions, CI/CD, YAML, DevOps, 自动化]
lang: ''
toc: true
---

> 从零开始学习 GitHub Actions 和 YAML，30 分钟快速上手自动化工作流

## 1. 什么是 GitHub Actions

### 1.1 核心概念

**GitHub Actions** 是 GitHub 提供的 CI/CD（持续集成/持续部署）自动化平台。

```
代码推送 → 自动测试 → 自动构建 → 自动部署
```

### 1.2 五大核心组件

| 组件 | 说明 | 类比 |
|------|------|------|
| **Workflow（工作流）** | 完整的自动化流程 | 一份完整的工作计划 |
| **Job（作业）** | 工作流中的一个任务 | 计划中的某个大任务 |
| **Step（步骤）** | 作业中的具体操作 | 任务中的具体步骤 |
| **Action（动作）** | 可复用的操作单元 | 可以重复使用的工具 |
| **Runner（运行器）** | 执行工作流的服务器 | 干活的机器 |

### 1.3 为什么要用 GitHub Actions？

✅ **自动化测试** - 每次提交代码自动运行测试
✅ **自动化部署** - 代码合并后自动部署到服务器
✅ **定时任务** - 定期执行脚本（数据备份、爬虫等）
✅ **代码检查** - 自动进行代码质量检查
✅ **多环境测试** - 同时在多个环境/版本下测试

---

## 2. YAML 基础速成

### 2.1 什么是 YAML

YAML 是一种配置文件格式，以**可读性**和**简洁性**著称。

```yaml
# 这是注释
name: John Doe # 键值对
age: 30 # 数字
isStudent: false # 布尔值
```

### 2.2 三大核心语法

#### 语法 1：键值对
```yaml
key: value
name: GitHub Actions
version: 1.0
```

#### 语法 2：列表（数组）
```yaml
# 方式 1：使用短横线
fruits:
  - Apple
  - Banana
  - Orange

# 方式 2：内联格式
fruits: [Apple, Banana, Orange]
```

#### 语法 3：嵌套（层级）
```yaml
person:
  name: John
  age: 30
  address:
    city: Beijing
    country: China
```

### 2.3 关键规则（必须记住！）

| 规则 | 说明 | 示例 |
|------|------|------|
| ✅ **用空格缩进** | 通常 2 个空格 | `  name: value` |
| ❌ **不能用 Tab** | Tab 会报错 | ~~`	name: value`~~ |
| ✅ **冒号后加空格** | 必须有空格 | `name: value` |
| ❌ **冒号后不能紧挨** | 会报错 | ~~`name:value`~~ |
| ✅ **缩进必须对齐** | 同级必须对齐 | 见下方示例 |

**缩进对齐示例：**
```yaml
# ✅ 正确
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        run: echo "Hello"

# ❌ 错误（缩进不对齐）
jobs:
  build:
    runs-on: ubuntu-latest
  steps:  # 错误！应该缩进
    - name: Checkout
```

### 2.4 YAML vs JSON 对比

**JSON 格式：**
```json
{
  "name": "CI",
  "on": ["push", "pull_request"],
  "jobs": {
    "build": {
      "runs-on": "ubuntu-latest"
    }
  }
}
```

**等价的 YAML 格式：**
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
```

YAML 更简洁，无需大量括号和引号！

---

## 3. 创建第一个工作流

### 3.1 文件位置

所有工作流文件必须放在：
```
你的仓库/
  .github/
    workflows/
      your-workflow.yml  ← 工作流文件
```

### 3.2 最简单的工作流

创建文件 `.github/workflows/hello.yml`：

```yaml
name: Hello World

on: push # 当有代码推送时触发

jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
      - name: Print Hello
        run: echo "Hello, GitHub Actions!"
```

**提交后会发生什么？**
1. 你推送代码到 GitHub
2. GitHub Actions 自动检测到工作流
3. 启动一个 Ubuntu 虚拟机
4. 执行命令 `echo "Hello, GitHub Actions!"`
5. 在 Actions 标签页看到运行结果

### 3.3 完整的工作流结构

```yaml
# 1. 工作流名称
name: My Workflow

# 2. 触发条件
on:
  push:
    branches: [main]

# 3. 作业定义
jobs:
  # 作业名称
  build:
    # 运行环境
    runs-on: ubuntu-latest

    # 执行步骤
    steps:
      - name: Step 1
        run: echo "First step"

      - name: Step 2
        run: echo "Second step"
```

---

## 4. 工作流核心组成

### 4.1 name - 工作流名称

```yaml
name: CI Pipeline # 显示在 GitHub Actions 页面
```

### 4.2 on - 触发条件

#### 基本触发事件
```yaml
# 单个事件
on: push

# 多个事件
on: [push, pull_request]

# 详细配置
on:
  push:
    branches:
      - main        # 只有 main 分支
      - develop     # 或 develop 分支
  pull_request:
    branches:
      - main        # PR 到 main 时触发
```

#### 更多触发选项
```yaml
on:
  push:
    branches:
      - main
      - 'release/**' # 通配符：所有 release/ 开头的分支
    paths:
      - 'src/**' # 只有 src 目录变化时触发
    paths-ignore:
      - 'docs/**' # 忽略 docs 目录的变化
```

### 4.3 jobs - 作业定义

```yaml
jobs:
  # 作业 1
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  # 作业 2（依赖作业 1）
  test:
    needs: build # 等 build 完成后再执行
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### 4.4 runs-on - 运行环境

```yaml
runs-on: ubuntu-latest      # Ubuntu（最常用）
runs-on: ubuntu-22.04       # 指定 Ubuntu 版本
runs-on: windows-latest     # Windows
runs-on: macos-latest       # macOS
```

### 4.5 steps - 执行步骤

#### 两种步骤类型

**类型 1：使用预定义 Action**
```yaml
steps:
  - name: 检出代码
    uses: actions/checkout@v3 # 使用官方 action

  - name: 设置 Node.js
    uses: actions/setup-node@v3
    with: # 传递参数
      node-version: '18'
```

**类型 2：运行命令**
```yaml
steps:
  - name: 安装依赖
    run: npm install

  - name: 运行测试
    run: npm test

  - name: 多行命令
    run: |
      echo "Step 1"
      npm install
      npm test
```

---

## 5. 触发事件详解

### 5.1 代码推送触发

```yaml
on:
  push:
    branches:
      - main
      - develop
      - 'feature/**' # 匹配 feature/xxx
    tags:
      - 'v*' # 匹配 v1.0, v2.0 等标签
```

### 5.2 Pull Request 触发

```yaml
on:
  pull_request:
    types:
      - opened # PR 创建时
      - synchronize # PR 更新时
      - reopened # PR 重新打开时
    branches:
      - main
```

### 5.3 定时任务触发

```yaml
on:
  schedule:
    - cron: '0 0 * * *' # 每天午夜（UTC 时间）
    - cron: '*/15 * * * *' # 每 15 分钟
    - cron: '0 9 * * 1-5' # 工作日早上 9 点
```

**Cron 表达式格式：**
```
┌─── 分钟 (0-59)
│ ┌─── 小时 (0-23)
│ │ ┌─── 日期 (1-31)
│ │ │ ┌─── 月份 (1-12)
│ │ │ │ ┌─── 星期 (0-6, 0=星期日)
* * * * *
```

**常用 Cron 示例：**
```yaml
'0 * * * *'      # 每小时
'0 0 * * *'      # 每天午夜
'0 9 * * *'      # 每天早上 9 点
'0 0 * * 1'      # 每周一午夜
'0 0 1 * *'      # 每月 1 号
'*/30 * * * *'   # 每 30 分钟
```

### 5.4 手动触发

```yaml
on:
  workflow_dispatch: # 在 Actions 页面手动运行
    inputs: # 可选：添加输入参数
      environment:
        description: 部署环境
        required: true
        default: staging
        type: choice
        options:
          - staging
          - production
```

### 5.5 多种触发方式组合

```yaml
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
```

---

## 6. 常用实战示例

### 6.1 Node.js 项目 CI/CD

```yaml
name: Node.js CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16, 18, 20] # 测试多个版本

    steps:
      # 1. 检出代码
      - name: 检出代码
        uses: actions/checkout@v3

      # 2. 设置 Node.js
      - name: 设置 Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm # 缓存 npm 依赖

      # 3. 安装依赖
      - name: 安装依赖
        run: npm ci

      # 4. 运行 Lint
      - name: 代码检查
        run: npm run lint

      # 5. 运行测试
      - name: 运行测试
        run: npm test

      # 6. 构建项目
      - name: 构建
        run: npm run build

  deploy:
    needs: test # 等测试通过后再部署
    if: github.ref == 'refs/heads/main' # 只在 main 分支部署
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: 部署到服务器
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          echo "开始部署..."
          npm run deploy
```

### 6.2 Python 项目测试

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.8', '3.9', '3.10', '3.11']

    steps:
      - uses: actions/checkout@v3

      - name: 设置 Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: 安装依赖
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest

      - name: 运行测试
        run: pytest
```

### 6.3 Docker 构建和推送

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: 登录 Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: 提取元数据
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: username/app

      - name: 构建并推送
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### 6.4 定时任务（每日数据备份）

```yaml
name: Daily Backup

on:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨 2 点（UTC）
  workflow_dispatch: # 支持手动触发

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v3

      - name: 执行备份脚本
        env:
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASS: ${{ secrets.DB_PASS }}
        run: |
          ./scripts/backup.sh

      - name: 上传到云存储
        run: |
          # 上传备份文件到 S3/OSS 等
          echo "上传备份文件..."
```

### 6.5 自动发布 Release

```yaml
name: Release

on:
  push:
    tags:
      - 'v*' # 推送标签时触发，如 v1.0.0

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: 构建项目
        run: |
          npm install
          npm run build

      - name: 创建 Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            ## 更新内容
            - 新增功能 A
            - 修复 Bug B
          draft: false
          prerelease: false

      - name: 上传构建产物
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
```

### 6.6 API 自动化测试（你的场景）

```yaml
name: API Automated Tests

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 * * * *' # 每小时执行一次
  workflow_dispatch: # 支持手动触发

jobs:
  api-test:
    runs-on: ubuntu-latest

    steps:
      - name: 检出代码
        uses: actions/checkout@v3

      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: npm

      - name: 安装 Apifox CLI
        run: npm install -g apifox-cli

      - name: 运行 API 测试
        env:
          APIFOX_TOKEN: ${{ secrets.APIFOX_TOKEN }}
        run: |
          apifox run \
            --access-token $APIFOX_TOKEN \
            -t 7740512 \
            -e 40692630 \
            -n 1 \
            -r html,cli

      - name: 上传测试报告
        if: always() # 无论成功失败都上传
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: apifox-reports/
          retention-days: 30 # 保留 30 天

      - name: 发送通知（测试失败时）
        if: failure()
        run: |
          # 这里可以添加发送邮件/钉钉/企业微信通知的代码
          echo "测试失败，发送通知..."
```

---

## 7. 进阶技巧

### 7.1 环境变量和密钥

#### 定义环境变量
```yaml
env:
  NODE_ENV: production # 全局环境变量

jobs:
  build:
    env:
      API_URL: https://api.example.com # 作业级环境变量

    steps:
      - name: 使用环境变量
        env:
          DEBUG: true # 步骤级环境变量
        run: |
          echo $NODE_ENV
          echo $API_URL
          echo $DEBUG
```

#### 使用 GitHub Secrets
```yaml
steps:
  - name: 使用密钥
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: |
      echo "API Key 已设置"
      # 密钥不会在日志中显示
```

**如何添加 Secrets：**
1. 进入仓库 Settings
2. 左侧菜单选择 Secrets and variables → Actions
3. 点击 New repository secret
4. 输入名称和值

### 7.2 条件执行

```yaml
steps:
  # 只在 main 分支执行
  - name: 部署到生产环境
    if: github.ref == 'refs/heads/main'
    run: npm run deploy:prod

  # 只在 PR 时执行
  - name: 运行额外检查
    if: github.event_name == 'pull_request'
    run: npm run check

  # 只在成功时执行
  - name: 发送成功通知
    if: success()
    run: echo "Success!"

  # 只在失败时执行
  - name: 发送失败通知
    if: failure()
    run: echo "Failed!"

  # 总是执行（清理工作）
  - name: 清理临时文件
    if: always()
    run: rm -rf tmp/
```

### 7.3 矩阵策略（多版本测试）

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
        include:
          - os: ubuntu-latest
            node-version: 20
            experimental: true
        exclude:
          - os: macos-latest
            node-version: 16

    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

这会创建 8 个作业：
- ubuntu + node 16, 18, 20
- windows + node 16, 18, 20
- macos + node 18, 20（排除了 16）

### 7.4 缓存依赖（加速构建）

```yaml
steps:
  - uses: actions/checkout@v3

  # 缓存 npm 依赖
  - name: 缓存 node_modules
    uses: actions/cache@v3
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  - run: npm install
```

### 7.5 构建产物（Artifacts）

```yaml
jobs:
  build:
    steps:
      - run: npm run build

      # 上传构建产物
      - name: 上传构建文件
        uses: actions/upload-artifact@v3
        with:
          name: dist-files
          path: dist/
          retention-days: 7 # 保留 7 天

  deploy:
    needs: build
    steps:
      # 下载构建产物
      - name: 下载构建文件
        uses: actions/download-artifact@v3
        with:
          name: dist-files
          path: dist/

      - name: 部署
        run: rsync -avz dist/ user@server:/var/www/
```

### 7.6 作业输出和传递

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.get-version.outputs.version }}

    steps:
      - id: get-version
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT

  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps:
      - name: 使用上一个作业的输出
        run: echo "Version is ${{ needs.job1.outputs.version }}"
```

### 7.7 并发控制

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: production-deploy
      cancel-in-progress: true # 取消进行中的部署
    steps:
      - run: ./deploy.sh
```

---

## 8. 常见问题和错误

### 8.1 YAML 语法错误

#### ❌ 错误 1：使用 Tab 缩进
```yaml
jobs:
	build:  # 错误！不能用 Tab
		runs-on: ubuntu-latest
```
**解决方法：** 使用 2 个空格缩进

#### ❌ 错误 2：冒号后没有空格
```yaml
name:CI  # 错误！
on:push  # 错误！
```
**解决方法：** 冒号后加空格
```yaml
name: CI
on: push
```

#### ❌ 错误 3：缩进不对齐
```yaml
steps:
  - name: Step 1
  run: echo "hello"  # 错误！应该缩进
```
**解决方法：** 对齐缩进
```yaml
steps:
  - name: Step 1
    run: echo "hello"
```

#### ❌ 错误 4：列表项缩进错误
```yaml
steps:
  - name: Step 1 # 错误！应该缩进
    run: echo "hello"
```
**解决方法：**
```yaml
steps:
  - name: Step 1
    run: echo "hello"
```

### 8.2 工作流常见错误

#### 错误 1：找不到命令
```yaml
steps:
  - run: npm test # 错误：npm: command not found
```
**原因：** 没有安装 Node.js
**解决方法：**
```yaml
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - run: npm test
```

#### 错误 2：权限不足
```yaml
steps:
  - run: ./deploy.sh # 错误：Permission denied
```
**解决方法：**
```yaml
steps:
  - run: chmod +x deploy.sh
  - run: ./deploy.sh
```

#### 错误 3：找不到文件
```yaml
steps:
  - run: cat README.md # 错误：No such file
```
**原因：** 没有检出代码
**解决方法：**
```yaml
steps:
  - uses: actions/checkout@v3 # 先检出代码
  - run: cat README.md
```

#### 错误 4：密钥未设置
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }} # 值为空
```
**解决方法：** 在仓库 Settings → Secrets 中添加 API_KEY

### 8.3 调试技巧

#### 技巧 1：启用调试日志
在仓库 Settings → Secrets 中添加：
- `ACTIONS_RUNNER_DEBUG` = `true`
- `ACTIONS_STEP_DEBUG` = `true`

#### 技巧 2：打印变量
```yaml
steps:
  - name: 调试信息
    run: |
      echo "Event: ${{ github.event_name }}"
      echo "Ref: ${{ github.ref }}"
      echo "Actor: ${{ github.actor }}"
      env
```

#### 技巧 3：使用 tmate 远程调试
```yaml
steps:
  - name: Setup tmate session
    uses: mxschmitt/action-tmate@v3
    if: failure() # 失败时启动
```

### 8.4 性能优化

1. **使用缓存**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

2. **并行执行作业**
```yaml
jobs:
  test-frontend:
    runs-on: ubuntu-latest

  test-backend:
    runs-on: ubuntu-latest
  # 这两个作业会同时执行
```

3. **使用 setup-node 的缓存功能**
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: npm # 自动缓存
```

---

## 附录

### A. 常用 GitHub Actions

| Action | 用途 | 示例 |
|--------|------|------|
| `actions/checkout@v3` | 检出代码 | `uses: actions/checkout@v3` |
| `actions/setup-node@v3` | 安装 Node.js | `uses: actions/setup-node@v3` |
| `actions/setup-python@v4` | 安装 Python | `uses: actions/setup-python@v4` |
| `actions/cache@v3` | 缓存依赖 | `uses: actions/cache@v3` |
| `actions/upload-artifact@v3` | 上传构建产物 | `uses: actions/upload-artifact@v3` |
| `docker/build-push-action@v4` | 构建 Docker | `uses: docker/build-push-action@v4` |

### B. 默认环境变量

```yaml
${{ github.repository }}      # 仓库名 owner/repo
${{ github.ref }}            # 引用 refs/heads/main
${{ github.sha }}            # 提交 SHA
${{ github.actor }}          # 触发用户
${{ github.event_name }}     # 事件类型 push/pull_request
${{ github.workspace }}      # 工作目录路径
${{ runner.os }}             # 操作系统 Linux/Windows/macOS
${{ runner.temp }}           # 临时目录
```

### C. 有用的资源

- **官方文档**: https://docs.github.com/actions
- **Actions 市场**: https://github.com

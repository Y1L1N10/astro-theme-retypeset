---
title: Google Antigravity Skills 完整使用指南
published: 2026-01-21
updated: 2026-01-21
description: 深入解析 Google Antigravity AI 编程助手的 Skills 系统,涵盖创建、配置、调用方法及实战案例,帮助开发者构建高效的项目级和全局级工作流程
tags: [AI, Antigravity, 开发工具, 工作流, 最佳实践]
lang: ''
toc: true
draft: false
pin: 0
abbrlink: google-antigravity-skills-guide
---

# Google Antigravity Skills 完整使用指南

## 一、创建 Skills 的步骤

### 1.1 确定 Skill 的作用域

**选择存放位置：**

- **项目级 Skills（工作区）**：`<项目根目录>/.agent/skills/`
  - 仅在当前项目中生效
  - 适合项目特定的工作流程

- **全局 Skills**：`~/.gemini/antigravity/skills/`
  - 在所有项目中生效
  - 适合通用工具和个人习惯

### 1.2 创建 Skill 文件夹

```bash
# 项目级 Skill
mkdir -p .agent/skills/my-skill

# 全局 Skill
mkdir -p ~/.gemini/antigravity/skills/my-skill
```

### 1.3 创建必需的 SKILL.md 文件

```bash
cd .agent/skills/my-skill
touch SKILL.md
```

### 1.4 （可选）添加其他资源

```bash
# 创建可选的目录结构
mkdir scripts      # 存放 Python 或 Bash 脚本
mkdir references   # 存放文档、示例
mkdir resources    # 存放模板文件
```

**完整的 Skill 目录结构示例：**

```
my-skill/
├── SKILL.md              # 必需：元数据和指令
├── scripts/              # 可选
│   ├── deploy.sh
│   └── test_runner.py
├── references/           # 可选
│   └── api_examples.md
└── resources/            # 可选
    └── template.json
```

---

## 二、SKILL.md 书写格式

### 2.1 基本格式结构

```markdown
---
name: skill-name
description: 用第三人称描述这个 Skill 的功能和使用场景，包含关键词
---

# Skill 标题

## 何时使用
- 列出适用场景
- 触发条件

## 使用方法
具体的步骤、规范、示例代码

## 注意事项
特殊说明、限制条件
```

### 2.2 关键要素说明

#### **Frontmatter（前置元数据）**

- `name`：Skill 的唯一标识符，使用小写和连字符
- `description`：**最重要**，决定 Agent 是否激活此 Skill
  - 使用第三人称
  - 包含关键词和使用场景
  - 清晰、具体、可搜索

**好的 description 示例：**
```yaml
description: Generates unit tests for Python code using pytest conventions and mocking best practices
```

**不好的 description 示例：**
```yaml
description: 帮你写测试 # 太模糊
```

#### **正文内容**

- **何时使用**：明确列出触发条件
- **使用方法**：详细的步骤、代码示例、规范
- **注意事项**：限制、依赖、特殊说明

### 2.3 完整示例模板

```markdown
---
name: pytest-generator
description: Generates comprehensive unit tests for Python functions using pytest framework with fixtures, mocking, and edge case coverage
---

# Python Pytest 测试生成器

## 何时使用
- 当需要为 Python 函数或类生成单元测试时
- 当要求使用 pytest 框架时
- 当需要包含 mock、fixture 或参数化测试时

## 使用方法

### 1. 测试文件命名
- 测试文件命名：`test_<module_name>.py`
- 测试函数命名：`test_<function_name>_<scenario>`

### 2. 基本测试结构
```python
import pytest
from module import function_to_test

def test_function_to_test_basic_case():
    # Arrange
    input_data = ...
    expected = ...

    # Act
    result = function_to_test(input_data)

    # Assert
    assert result == expected
```

### 3. 必须包含的测试类型
- 正常情况测试
- 边界条件测试
- 异常情况测试
- 参数化测试（使用 `@pytest.mark.parametrize`）

### 4. Mock 使用规范
使用 `pytest-mock` 或 `unittest.mock` 进行依赖隔离

## 注意事项
- 测试覆盖率应达到 80% 以上
- 每个测试函数只测试一个功能点
- 使用有意义的断言消息
```

---

## 三、调用方法

### 3.1 全局调用（Global Skills）

**设置步骤：**

1. **创建全局 Skill**

```bash
mkdir -p ~/.gemini/antigravity/skills/code-style
cd ~/.gemini/antigravity/skills/code-style
```

2. **编写 SKILL.md**

```markdown
---
name: python-code-style
description: Enforces Python code formatting using Black, isort, and type hints following PEP 8 standards
---

# Python 代码风格规范

## 何时使用
- 编写或修改 Python 代码时
- 需要格式化代码时
- 添加类型注解时

## 使用方法
1. 使用 Black 格式化，行长度 88
2. 使用 isort 排序导入
3. 添加类型提示
4. 遵循 PEP 8 命名规范
```

3. **在任何项目中自动生效**

```bash
# 在任意项目目录下
cd ~/my-project
# Agent 会自动加载全局 Skills
```

**使用场景：**
- 个人代码风格偏好
- 通用工具脚本
- 跨项目复用的最佳实践

---

### 3.2 项目级调用（Workspace Skills）

**设置步骤：**

1. **在项目根目录创建 Skill**

```bash
cd ~/my-project
mkdir -p .agent/skills/deploy
cd .agent/skills/deploy
```

2. **编写项目特定的 SKILL.md**

```markdown
---
name: kubernetes-deploy
description: Deploys application to production Kubernetes cluster using Helm charts with blue-green deployment strategy
---

# Kubernetes 部署流程

## 何时使用
- 当需要部署到生产环境时
- 当提到 "deploy" 或 "发布" 时

## 使用方法
1. 检查 `values.yaml` 配置
2. 运行 `helm upgrade --install`
3. 验证 Pod 状态
4. 执行健康检查

## 部署脚本
参考 `scripts/deploy.sh`
```

3. **提交到版本控制**

```bash
git add .agent/skills/
git commit -m "Add deployment skill"
git push
```

**团队协作：**
- 团队成员克隆仓库后自动获得相同的 Skills
- 保持工作流程一致性

---

## 四、实际案例演示

### 案例 1：Git 提交信息格式化

**目录结构：**
```
.agent/skills/git-commit/
└── SKILL.md
```

**SKILL.md 内容：**

```markdown
---
name: conventional-commits
description: Formats Git commit messages following Conventional Commits specification with type, scope, and description
---

# Git 提交信息规范

## 何时使用
- 执行 git commit 时
- 需要生成或修改提交信息时
- 当用户提到 "commit" 或"提交"时

## 提交格式

### 基本结构
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具变动

### 示例
```
feat(auth): add JWT token authentication

- Implement JWT token generation
- Add middleware for token validation
- Update user model with token methods

Closes #123
```

## 规则
- subject 不超过 50 字符
- subject 使用祈使句
- body 每行不超过 72 字符
- footer 引用相关 issue
```

**使用演示：**

```
用户：帮我写一个提交信息，我添加了用户登录功能
Agent：根据 Conventional Commits 规范，建议的提交信息：

feat(auth): implement user login functionality

- Add login API endpoint
- Create authentication middleware
- Add user session management
- Implement password hashing with bcrypt
```

---

### 案例 2：API 设计规范

**目录结构：**
```
.agent/skills/api-design/
├── SKILL.md
├── references/
│   └── rest_examples.md
└── resources/
    └── openapi_template.yaml
```

**SKILL.md 内容：**

```markdown
---
name: rest-api-design
description: Designs RESTful APIs following best practices with proper HTTP methods, status codes, and resource naming conventions
---

# REST API 设计规范

## 何时使用
- 设计新的 API 端点时
- 审查 API 设计时
- 当用户提到 "API" 或 "接口" 时

## 资源命名规范

### URL 结构
```
/api/v1/{resources}/{resource-id}/{sub-resources}
```

### 规则
- 使用复数名词：`/users` 而非 `/user`
- 使用小写和连字符：`/user-profiles` 而非 `/userProfiles`
- 避免动词：使用 HTTP 方法表达操作

## HTTP 方法映射

| 方法 | 操作 | 示例 |
|------|------|------|
| GET | 获取资源 | `GET /api/v1/users` |
| POST | 创建资源 | `POST /api/v1/users` |
| PUT | 完整更新 | `PUT /api/v1/users/123` |
| PATCH | 部分更新 | `PATCH /api/v1/users/123` |
| DELETE | 删除资源 | `DELETE /api/v1/users/123` |

## 状态码使用

- `200 OK`: 成功
- `201 Created`: 创建成功
- `204 No Content`: 删除成功
- `400 Bad Request`: 请求错误
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 无权限
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器错误

## 响应格式

### 成功响应
```json
{
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "meta": {
    "timestamp": "2025-01-21T10:00:00Z"
  }
}
```

### 错误响应
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email address"
      }
    ]
  }
}
```

## 分页规范

使用查询参数：
```
GET /api/v1/users?page=1&limit=20&sort=-created_at
```

响应包含分页信息：
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**使用演示：**

```
用户：设计一个博客系统的 API
Agent：基于 REST API 最佳实践，建议如下设计：

文章管理：
- GET /api/v1/posts - 获取文章列表
- POST /api/v1/posts - 创建文章
- GET /api/v1/posts/{id} - 获取单篇文章
- PUT /api/v1/posts/{id} - 更新文章
- DELETE /api/v1/posts/{id} - 删除文章

评论管理（嵌套资源）：
- GET /api/v1/posts/{id}/comments - 获取文章评论
- POST /api/v1/posts/{id}/comments - 添加评论

所有接口返回统一的 JSON 格式，使用标准 HTTP 状态码...
```

---

### 案例 3：数据库迁移管理

**目录结构：**
```
.agent/skills/db-migration/
├── SKILL.md
├── scripts/
│   └── migration_template.py
└── references/
    └── alembic_guide.md
```

**SKILL.md 内容：**

```markdown
---
name: alembic-migrations
description: Creates and manages database schema migrations using Alembic with proper versioning and rollback capabilities
---

# Alembic 数据库迁移

## 何时使用
- 修改数据库 schema 时
- 创建新的数据库表时
- 需要生成迁移脚本时

## 迁移步骤

### 1. 生成迁移脚本
```bash
alembic revision --autogenerate -m "描述性消息"
```

### 2. 迁移文件命名规范
```
YYYY_MM_DD_HHMM_description.py
例：2025_01_21_1200_add_user_email_index.py
```

### 3. 迁移脚本结构

```python
"""Add user email index

Revision ID: abc123
Revises: def456
Create Date: 2025-01-21 12:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = 'abc123'
down_revision = 'def456'
branch_labels = None
depends_on = None

def upgrade():
    # 向前迁移
    op.create_index(
        'ix_users_email',
        'users',
        ['email'],
        unique=True
    )

def downgrade():
    # 回滚操作
    op.drop_index('ix_users_email', table_name='users')
```

### 4. 必须包含的内容
- ✅ 完整的 `upgrade()` 函数
- ✅ 对应的 `downgrade()` 函数
- ✅ 描述性的 docstring
- ✅ 数据迁移脚本（如有数据变更）

### 5. 执行迁移
```bash
# 升级
alembic upgrade head

# 回滚一个版本
alembic downgrade -1

# 查看历史
alembic history
```

## 最佳实践

### 表创建
```python
def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
```

### 列添加（需考虑现有数据）
```python
def upgrade():
    # 先添加可空列
    op.add_column('users', sa.Column('phone', sa.String(20), nullable=True))

    # 填充默认值
    op.execute("UPDATE users SET phone = '' WHERE phone IS NULL")

    # 再设置为非空
    op.alter_column('users', 'phone', nullable=False)
```

### 数据迁移
```python
def upgrade():
    # 使用 op.execute 执行 SQL
    connection = op.get_bind()
    connection.execute(
        sa.text("UPDATE users SET status = 'active' WHERE status IS NULL")
    )
```

## 注意事项
- 始终在开发环境测试迁移和回滚
- 大表操作考虑分批处理
- 备份生产数据库后再执行
- 避免在迁移中删除数据

**使用演示：**

```
用户：我需要给 users 表添加一个 is_verified 字段
Agent：我会创建一个 Alembic 迁移脚本：

[生成文件: migrations/versions/2025_01_21_1430_add_user_verified_flag.py]

"""Add is_verified flag to users table

Revision ID: 1a2b3c4d
Revises: 9z8y7x6w
Create Date: 2025-01-21 14:30:00
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('users',
        sa.Column('is_verified', sa.Boolean(),
                  nullable=False,
                  server_default='false')
    )
    op.create_index('ix_users_is_verified', 'users', ['is_verified'])

def downgrade():
    op.drop_index('ix_users_is_verified', table_name='users')
    op.drop_column('users', 'is_verified')

执行命令：
alembic upgrade head
```

---

## 五、Skills 使用技巧总结

### ✅ 最佳实践

1. **渐进式开发**
   - 先在项目中创建和测试
   - 验证有效后再移到全局目录

2. **控制数量**
   - 避免安装过多 Skills
   - 保持 Skills 专注单一职责

3. **优化 Description**
   - 使用具体关键词
   - 包含使用场景
   - 第三人称描述

4. **保持轻量**
   - 仅包含文本文件
   - 避免大型二进制文件
   - 脚本保持简洁

### ⚠️ 常见陷阱

- ❌ Description 过于模糊
- ❌ 单个 Skill 包含过多功能
- ❌ 忘记编写 downgrade/回滚逻辑
- ❌ 在 Skill 中硬编码项目路径

### 🔄 工作流建议

创建 Skill → 本地测试 → 优化 Description →
团队分享（项目级）→ 提炼通用部分 → 全局复用

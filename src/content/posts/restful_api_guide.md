---
title: RESTful API 完整指南
published: 2025-12-30
description: 全面的 RESTful API 设计指南，涵盖核心原则、HTTP 方法、URL 设计规范、状态码、认证授权及最佳实践
tags: [API, RESTful, HTTP, 后端开发, 架构设计]
lang: ''
toc: true
---

# RESTful API 完整指南

## 什么是 RESTful API

REST (Representational State Transfer) 是一种软件架构风格,由 Roy Fielding 在 2000 年的博士论文中提出。RESTful API 是遵循 REST 架构风格设计的 Web API,它使用 HTTP 协议进行通信,将服务器端的资源以统一的方式暴露给客户端。

### REST 的特点
- **无状态性**: 每个请求都包含处理该请求所需的全部信息
- **客户端-服务器分离**: 前后端解耦,可独立演化
- **可缓存**: 响应数据可以被标记为可缓存或不可缓存
- **统一接口**: 使用标准的 HTTP 方法操作资源
- **分层系统**: 客户端无需知道是否直接连接到最终服务器

---

## REST 的核心原则

### 1. 资源 (Resource)
资源是 REST 架构的核心概念,任何可以被命名的信息都可以是资源。资源通过 URI (统一资源标识符) 来标识。

```
示例:
- 用户资源: /users
- 特定用户: /users/123
- 用户的订单: /users/123/orders
```

### 2. 表现层 (Representation)
资源的具体表现形式,常见格式包括 JSON、XML、HTML 等。目前 JSON 是最常用的格式。

### 3. 状态转移 (State Transfer)
通过 HTTP 方法对资源进行操作,实现资源状态的转移。

### 4. 统一接口
REST 要求使用统一的接口来操作资源,主要包括:
- 资源标识
- 通过表现层操作资源
- 自描述消息
- 超媒体作为应用状态引擎 (HATEOAS)

---

## HTTP 方法

RESTful API 使用标准的 HTTP 方法来表示对资源的操作:

### GET - 获取资源
用于检索资源,不应该有副作用(幂等操作)。

```http
GET /api/users          # 获取用户列表
GET /api/users/123      # 获取 ID 为 123 的用户
GET /api/users/123/orders  # 获取用户 123 的订单列表
```

### POST - 创建资源
用于创建新资源。

```http
POST /api/users
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

### PUT - 完整更新资源
用于完整替换现有资源,需要提供资源的所有字段。

```http
PUT /api/users/123
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000"
}
```

### PATCH - 部分更新资源
用于部分更新资源,只需提供需要修改的字段。

```http
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

### DELETE - 删除资源
用于删除指定资源。

```http
DELETE /api/users/123
```

### HEAD - 获取资源元数据
类似于 GET,但只返回响应头,不返回响应体。

### OPTIONS - 获取资源支持的方法
用于获取资源支持的 HTTP 方法。

---

## URL 设计规范

### 基本原则

1. **使用名词而非动词**
   ```
   ✅ Good: GET /api/users
   ❌ Bad:  GET /api/getUsers
   ```

2. **使用复数形式**
   ```
   ✅ Good: /api/users
   ❌ Bad:  /api/user
   ```

3. **使用小写字母和连字符**
   ```
   ✅ Good: /api/user-orders
   ❌ Bad:  /api/UserOrders
   ❌ Bad:  /api/user_orders
   ```

4. **避免深层嵌套**
   ```
   ✅ Good: /api/users/123/orders
   ❌ Bad:  /api/companies/456/departments/789/teams/012/members
   ```

5. **使用查询参数进行过滤、排序和分页**
   ```
   GET /api/users?status=active&sort=created_at&page=2&limit=20
   ```

### URL 结构示例

```
# 集合资源
GET    /api/users              # 获取用户列表
POST   /api/users              # 创建新用户

# 单个资源
GET    /api/users/123          # 获取特定用户
PUT    /api/users/123          # 完整更新用户
PATCH  /api/users/123          # 部分更新用户
DELETE /api/users/123          # 删除用户

# 子资源
GET    /api/users/123/orders   # 获取用户的订单
POST   /api/users/123/orders   # 为用户创建订单

# 过滤和搜索
GET    /api/users?role=admin&status=active
GET    /api/products?category=electronics&price_min=100&price_max=500

# 排序
GET    /api/users?sort=created_at:desc
GET    /api/products?sort=price:asc,name:asc

# 分页
GET    /api/users?page=2&limit=20
GET    /api/users?offset=40&limit=20
```

---

## 状态码

HTTP 状态码用于表示请求的处理结果:

### 2xx 成功
- **200 OK**: 请求成功(用于 GET、PUT、PATCH)
- **201 Created**: 资源创建成功(用于 POST)
- **204 No Content**: 请求成功但无返回内容(用于 DELETE)

### 3xx 重定向
- **301 Moved Permanently**: 资源永久移动
- **304 Not Modified**: 资源未修改,可使用缓存

### 4xx 客户端错误
- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 未认证
- **403 Forbidden**: 无权限访问
- **404 Not Found**: 资源不存在
- **405 Method Not Allowed**: HTTP 方法不支持
- **409 Conflict**: 资源冲突(如重复创建)
- **422 Unprocessable Entity**: 请求格式正确但语义错误
- **429 Too Many Requests**: 请求过于频繁

### 5xx 服务器错误
- **500 Internal Server Error**: 服务器内部错误
- **502 Bad Gateway**: 网关错误
- **503 Service Unavailable**: 服务不可用

---

## 请求与响应

### 请求格式

```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 28
}
```

### 响应格式

#### 成功响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 28,
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

#### 列表响应示例(带分页)

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "用户1"
      },
      {
        "id": 2,
        "name": "用户2"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

#### 错误响应示例

```json
{
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email format is invalid"
    },
    {
      "field": "age",
      "message": "Age must be greater than 0"
    }
  ]
}
```

### 常用响应头

```http
Content-Type: application/json
Cache-Control: no-cache
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 版本控制

API 版本控制有多种方式:

### 1. URL 路径版本控制(推荐)
```
https://api.example.com/v1/users
https://api.example.com/v2/users
```

优点: 清晰明确,易于理解和使用
缺点: URL 会随版本变化

### 2. 请求头版本控制
```http
GET /api/users
Accept: application/vnd.example.v1+json
```

优点: URL 保持不变
缺点: 不够直观

### 3. 查询参数版本控制
```
https://api.example.com/users?version=1
```

优点: 简单
缺点: 容易被忽略,不够规范

---

## 认证与授权

### 1. API Key
```http
GET /api/users
X-API-Key: your-api-key-here
```

### 2. Bearer Token (JWT)
```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. OAuth 2.0
更复杂的授权框架,适用于第三方应用访问。

```http
GET /api/users
Authorization: Bearer ACCESS_TOKEN
```

### 4. Basic Authentication
```http
GET /api/users
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

---

## 最佳实践

### 1. 使用 HTTPS
所有 API 通信都应该使用 HTTPS 加密。

### 2. 实现限流
防止 API 滥用,保护服务器资源。

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### 3. 提供详细的文档
使用 Swagger/OpenAPI 规范编写 API 文档。

### 4. 使用合适的 HTTP 状态码
准确使用状态码帮助客户端理解请求结果。

### 5. 支持过滤、排序和分页
```
GET /api/users?status=active&sort=created_at:desc&page=1&limit=20
```

### 6. 使用 HATEOAS
在响应中包含相关资源的链接。

```json
{
  "id": 123,
  "name": "张三",
  "links": {
    "self": "/api/users/123",
    "orders": "/api/users/123/orders",
    "profile": "/api/users/123/profile"
  }
}
```

### 7. 支持字段筛选
允许客户端指定返回的字段。

```
GET /api/users?fields=id,name,email
```

### 8. 处理跨域请求 (CORS)
正确配置 CORS 头,支持跨域访问。

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 9. 返回有意义的错误信息
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "issue": "Email is already registered"
      }
    ]
  }
}
```

### 10. 使用适当的数据格式
优先使用 JSON,必要时支持其他格式(如 XML)。

---

## 常见错误处理

### 验证错误
```json
{
  "status": 422,
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 认证错误
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 权限错误
```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 资源不存在
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "User with ID 123 not found"
}
```

### 服务器错误
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "request_id": "abc-123-def"
}
```

---

## 实际应用示例

### 用户管理 API 完整示例

```
# 获取用户列表
GET /api/v1/users?page=1&limit=20&status=active
Response: 200 OK

# 获取单个用户
GET /api/v1/users/123
Response: 200 OK

# 创建用户
POST /api/v1/users
Body: { "name": "张三", "email": "zhangsan@example.com" }
Response: 201 Created

# 更新用户
PUT /api/v1/users/123
Body: { "name": "张三", "email": "new@example.com", "age": 30 }
Response: 200 OK

# 部分更新用户
PATCH /api/v1/users/123
Body: { "email": "updated@example.com" }
Response: 200 OK

# 删除用户
DELETE /api/v1/users/123
Response: 204 No Content

# 获取用户订单
GET /api/v1/users/123/orders
Response: 200 OK

# 搜索用户
GET /api/v1/users/search?q=张三&fields=id,name,email
Response: 200 OK
```

---

## 相关工具推荐

### 1. API 调试与测试
- **Postman**: 最流行的 API 开发平台,支持调试、测试、文档和 Mock。
- **Insomnia**: 轻量级、界面美观的 API 客户端,支持 GraphQL。
- **Curl**: 强大的命令行 HTTP 工具,适合脚本和服务器端调试。

### 2. 文档生成
- **Swagger (OpenAPI)**: 业界标准的 API 描述语言和工具集。
- **Redoc**:基于 OpenAPI 规范生成美观的交互式文档。

### 3. Mock 服务
- **Mockoon**: 简单易用的本地 Mock 服务器工具。
- **JSON Server**: 快速利用 JSON 文件搭建伪 REST API。

### 4. 抓包工具
- **Charles**: 强大的网络抓包代理工具,支持 HTTPS解密。
- **Wireshark**: 网络协议分析器,用于深入的网络数据包分析。

---

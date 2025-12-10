---
title: HTTP 状态码完整速查表
published: 2025-12-10
description: Web 开发必备的 HTTP 状态码速查表，涵盖常用 Top 10 状态码及 1xx-5xx 全系列详细含义与说明。
tags: [HTTP, Web开发, API, 状态码, 速查表]
lang: ''
toc: true
---

# HTTP 状态码完整速查表

## 📌 测试开发中常用状态码（Top 10）

| 状态码 | 含义 | 优先级 |
|--------|------|--------|
| 200 | OK（请求成功） | ⭐⭐⭐⭐⭐ |
| 400 | Bad Request（请求格式错误） | ⭐⭐⭐⭐⭐ |
| 401 | Unauthorized（未授权，需认证） | ⭐⭐⭐⭐⭐ |
| 403 | Forbidden（禁止访问，无权限） | ⭐⭐⭐⭐⭐ |
| 404 | Not Found（资源不存在） | ⭐⭐⭐⭐⭐ |
| 500 | Internal Server Error（服务器内部错误） | ⭐⭐⭐⭐⭐ |
| 201 | Created（资源已创建） | ⭐⭐⭐⭐ |
| 204 | No Content（无内容） | ⭐⭐⭐⭐ |
| 429 | Too Many Requests（请求过频） | ⭐⭐⭐⭐ |
| 502 | Bad Gateway（网关错误） | ⭐⭐⭐ |

---

## 1xx 信息响应

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 100 | Continue | 继续请求，用于大文件上传 |
| 101 | Switching Protocols | 切换协议（如 HTTP 升级为 WebSocket） |

## 2xx 成功

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功，返回所需数据 |
| 201 | Created | 资源创建成功，通常用于 POST 请求 |
| 202 | Accepted | 服务器已接受请求，但尚未处理完成 |
| 203 | Non-Authoritative Information | 返回的信息来自第三方缓存 |
| 204 | No Content | 请求成功，但无内容返回（常用于 DELETE） |
| 205 | Reset Content | 请求成功，客户端应重置视图 |
| 206 | Partial Content | 返回部分内容（断点续传） |

## 3xx 重定向

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 300 | Multiple Choices | 有多个可能的响应 |
| 301 | Moved Permanently | 资源永久迁移到新 URL |
| 302 | Found | 资源临时重定向（大多数浏览器按 GET 处理） |
| 303 | See Other | 重定向到其他资源（强制使用 GET） |
| 304 | Not Modified | 资源未修改，使用缓存版本 |
| 305 | Use Proxy | 必须通过代理访问 |
| 307 | Temporary Redirect | 临时重定向（保持原 HTTP 方法） |
| 308 | Permanent Redirect | 永久重定向（保持原 HTTP 方法） |

## 4xx 客户端错误

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 400 | Bad Request | 请求格式错误、参数非法 |
| 401 | Unauthorized | 未授权，需要身份认证或认证失败 |
| 402 | Payment Required | 需要付款（很少使用） |
| 403 | Forbidden | 服务器理解但拒绝执行（权限不足） |
| 404 | Not Found | 请求的资源不存在 |
| 405 | Method Not Allowed | HTTP 方法不允许（如 POST 到只支持 GET 的端点） |
| 406 | Not Acceptable | 服务器无法提供请求的格式 |
| 407 | Proxy Authentication Required | 需要代理认证 |
| 408 | Request Timeout | 请求超时 |
| 409 | Conflict | 请求冲突（如重复创建、数据冲突） |
| 410 | Gone | 资源已永久删除 |
| 411 | Length Required | 请求必须包含 Content-Length 头 |
| 412 | Precondition Failed | 先决条件失败 |
| 413 | Payload Too Large | 请求体过大 |
| 414 | URI Too Long | URL 过长 |
| 415 | Unsupported Media Type | 不支持的媒体类型 |
| 416 | Range Not Satisfiable | 无法满足 Range 请求 |
| 417 | Expectation Failed | 期望条件失败 |
| 418 | I'm a teapot | 我是茶壶（愚人节玩笑） |
| 421 | Misdirected Request | 请求被错误路由 |
| 422 | Unprocessable Entity | 请求格式正确但包含语义错误 |
| 423 | Locked | 资源被锁定 |
| 424 | Failed Dependency | 前置条件失败 |
| 425 | Too Early | 请求过早 |
| 426 | Upgrade Required | 需要升级协议 |
| 428 | Precondition Required | 需要先决条件 |
| 429 | Too Many Requests | 请求过频，被限流 |
| 431 | Request Header Fields Too Large | 请求头过大 |
| 451 | Unavailable For Legal Reasons | 因法律原因不可用 |

## 5xx 服务器错误

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 500 | Internal Server Error | 服务器内部错误，具体原因不明 |
| 501 | Not Implemented | 服务器功能未实现 |
| 502 | Bad Gateway | 网关错误，上游服务响应有误 |
| 503 | Service Unavailable | 服务暂时不可用（维护、过载） |
| 504 | Gateway Timeout | 网关超时，上游服务无响应 |
| 505 | HTTP Version Not Supported | 不支持的 HTTP 版本 |
| 506 | Variant Also Negotiates | 服务器配置错误 |
| 507 | Insufficient Storage | 服务器存储空间不足 |
| 508 | Loop Detected | 检测到循环 |
| 510 | Not Extended | 需要进一步扩展 |
| 511 | Network Authentication Required | 需要网络认证 |

---

## 快速判断规则

- **1xx** ℹ️ 信息响应（很少用到）
- **2xx** ✅ 成功（请求已处理）
- **3xx** 🔄 重定向（需要进一步操作）
- **4xx** ❌ 客户端错误（你的问题）
- **5xx** 🔧 服务器错误（服务器的问题）
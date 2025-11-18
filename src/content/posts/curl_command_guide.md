---
title: curl 常用指令总结
published: 2025-11-17
description: 全面的 curl 命令使用指南，包含基本用法、HTTP 方法、文件操作、身份认证等实用技巧和最佳实践
tags: [curl, HTTP, API, 命令行, 网络工具]
lang: ''
toc: true
---

# curl 常用指令总结

## 基本用法

### GET 请求
```bash
# 最基本的 GET 请求
curl https://api.example.com

# 显示响应头信息
curl -i https://api.example.com

# 只显示响应头
curl -I https://api.example.com

# 显示详细请求过程
curl -v https://api.example.com
```

## HTTP 方法

### POST 请求
```bash
# 发送 JSON 数据
curl -X POST https://api.example.com/data \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","age":25}'

# 发送表单数据
curl -X POST https://api.example.com/form \
  -d "username=user" \
  -d "password=pass"

# 从文件读取数据
curl -X POST https://api.example.com/data \
  -d @data.json
```

### PUT 请求
```bash
curl -X PUT https://api.example.com/resource/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"更新的名称"}'
```

### DELETE 请求
```bash
curl -X DELETE https://api.example.com/resource/1
```

## 请求头设置

```bash
# 设置单个请求头
curl -H "Authorization: Bearer token123" https://api.example.com

# 设置多个请求头
curl -H "Authorization: Bearer token123" \
  -H "Accept: application/json" \
  -H "User-Agent: MyApp/1.0" \
  https://api.example.com
```

## 身份认证

```bash
# Basic 认证
curl -u username:password https://api.example.com

# Bearer Token
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com

# API Key
curl -H "X-API-Key: your_api_key" https://api.example.com
```

## 文件操作

### 下载文件
```bash
# 下载并保存为原文件名
curl -O https://example.com/file.zip

# 下载并指定文件名
curl -o myfile.zip https://example.com/file.zip

# 断点续传
curl -C - -O https://example.com/largefile.zip
```

### 上传文件
```bash
# 上传单个文件
curl -F "file=@/path/to/file.jpg" https://api.example.com/upload

# 上传多个文件
curl -F "file1=@image1.jpg" \
  -F "file2=@image2.jpg" \
  https://api.example.com/upload

# 带额外参数上传
curl -F "file=@document.pdf" \
  -F "description=重要文档" \
  https://api.example.com/upload
```

## 重定向和 Cookie

```bash
# 跟随重定向
curl -L https://example.com

# 保存 Cookie
curl -c cookies.txt https://example.com/login

# 使用 Cookie
curl -b cookies.txt https://example.com/dashboard

# 同时保存和使用 Cookie
curl -b cookies.txt -c cookies.txt https://example.com
```

## 输出控制

```bash
# 静默模式（不显示进度条）
curl -s https://api.example.com

# 保存响应到文件
curl https://api.example.com -o response.json

# 只输出 HTTP 状态码
curl -s -o /dev/null -w "%{http_code}" https://api.example.com

# 显示请求时间信息
curl -w "时间: %{time_total}s\n" -o /dev/null -s https://api.example.com
```

## 代理设置

```bash
# 使用 HTTP 代理
curl -x http://proxy.example.com:8080 https://api.example.com

# 使用 SOCKS5 代理
curl -x socks5://proxy.example.com:1080 https://api.example.com

# 带认证的代理
curl -x http://proxy.example.com:8080 \
  -U proxyuser:proxypass \
  https://api.example.com
```

## 超时设置

```bash
# 连接超时（秒）
curl --connect-timeout 10 https://api.example.com

# 整体操作超时（秒）
curl --max-time 30 https://api.example.com

# 同时设置
curl --connect-timeout 10 --max-time 30 https://api.example.com
```

## SSL/TLS 相关

```bash
# 忽略 SSL 证书验证（不推荐用于生产环境）
curl -k https://self-signed.example.com

# 指定 SSL 证书
curl --cert client.pem --key key.pem https://api.example.com

# 指定 CA 证书
curl --cacert ca-bundle.crt https://api.example.com
```

## 限速和重试

```bash
# 限制下载速度（字节/秒）
curl --limit-rate 100K https://example.com/file.zip

# 失败时重试
curl --retry 3 https://api.example.com

# 重试延迟
curl --retry 3 --retry-delay 5 https://api.example.com
```

## 常用组合示例

### RESTful API 调用
```bash
# GET 获取资源列表
curl -X GET "https://api.example.com/users?page=1&limit=10" \
  -H "Authorization: Bearer token123" \
  -H "Accept: application/json"

# POST 创建资源
curl -X POST "https://api.example.com/users" \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com"}'

# PUT 更新资源
curl -X PUT "https://api.example.com/users/123" \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@example.com"}'

# DELETE 删除资源
curl -X DELETE "https://api.example.com/users/123" \
  -H "Authorization: Bearer token123"
```

### 测试 API 响应时间
```bash
curl -w "\n总时间: %{time_total}s\n连接时间: %{time_connect}s\n" \
  -o /dev/null -s https://api.example.com
```

### GraphQL 查询
```bash
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name email } }"}'
```

## 常用选项速查

| 选项 | 说明 |
|------|------|
| `-X, --request` | 指定 HTTP 方法 |
| `-H, --header` | 添加请求头 |
| `-d, --data` | 发送 POST 数据 |
| `-F, --form` | 发送表单数据（multipart/form-data） |
| `-o, --output` | 保存到指定文件 |
| `-O, --remote-name` | 保存为远程文件名 |
| `-i, --include` | 显示响应头 |
| `-I, --head` | 只获取响应头 |
| `-v, --verbose` | 显示详细信息 |
| `-s, --silent` | 静默模式 |
| `-L, --location` | 跟随重定向 |
| `-u, --user` | 设置用户名和密码 |
| `-b, --cookie` | 发送 Cookie |
| `-c, --cookie-jar` | 保存 Cookie |
| `-x, --proxy` | 使用代理 |
| `-k, --insecure` | 跳过 SSL 验证 |
| `--connect-timeout` | 连接超时时间 |
| `--max-time` | 最大操作时间 |

## 调试技巧

```bash
# 查看完整的请求和响应过程
curl -v https://api.example.com 2>&1 | grep -E '^>|^<|^\*'

# 测试 API 可用性
curl -f -s -o /dev/null https://api.example.com && echo "可用" || echo "不可用"

# 保存完整的调试信息
curl -v https://api.example.com 2> debug.log
```

## 高级用法

### 并行请求
```bash
# 使用 & 在后台运行多个请求
curl https://api1.example.com & \
curl https://api2.example.com & \
curl https://api3.example.com & \
wait
```

### URL 编码
```bash
# curl 会自动对 URL 进行编码
curl "https://api.example.com/search?q=hello world"

# 手动编码特殊字符
curl --data-urlencode "query=特殊字符 & 符号" https://api.example.com
```

### 自定义 DNS 解析
```bash
# 指定域名解析到特定 IP
curl --resolve example.com:443:127.0.0.1 https://example.com
```

### HTTP/2 支持
```bash
# 使用 HTTP/2 协议
curl --http2 https://api.example.com

# 强制使用 HTTP/2
curl --http2-prior-knowledge https://api.example.com
```

## 实用技巧

### 批量下载
```bash
# 下载连续编号的文件
curl -O https://example.com/file[1-10].jpg

# 下载指定列表的文件
curl -O https://example.com/{file1,file2,file3}.jpg
```

### 模拟浏览器
```bash
# 设置 User-Agent 模拟浏览器
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  https://example.com

# 设置 Referer
curl -H "Referer: https://google.com" https://example.com
```

### 性能测试
```bash
# 显示详细的性能指标
curl -w "\n\
DNS 解析时间: %{time_namelookup}s\n\
TCP 连接时间: %{time_connect}s\n\
SSL 握手时间: %{time_appconnect}s\n\
传输开始时间: %{time_starttransfer}s\n\
总时间: %{time_total}s\n\
下载速度: %{speed_download} bytes/s\n\
" -o /dev/null -s https://api.example.com
```

## 故障排查

```bash
# 显示 curl 版本和支持的协议
curl --version

# 显示支持的所有选项
curl --help all

# 使用 --trace 进行详细调试
curl --trace trace.log https://api.example.com

# 使用 --trace-ascii 输出可读的调试信息
curl --trace-ascii trace.txt https://api.example.com
```

## 安全注意事项

1. **避免在命令行暴露敏感信息**：使用环境变量或配置文件
   ```bash
   # 使用环境变量
   curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com
   
   # 从文件读取
   curl -H @headers.txt https://api.example.com
   ```

2. **生产环境不要使用 `-k` 选项**：这会跳过 SSL 证书验证

3. **限制重定向次数**：防止恶意重定向
   ```bash
   curl -L --max-redirs 3 https://example.com
   ```

4. **设置超时**：避免请求挂起
   ```bash
   curl --connect-timeout 10 --max-time 30 https://api.example.com
   ```
---
title: 腾讯云轻量服务器 SSH 密钥连接配置指南
published: 2026-02-06
description: 腾讯云轻量服务器 (Ubuntu 24) SSH 密钥连接配置详细指南，解决 22 端口连接被拦截及 2222 端口配置等常见问题。
tags: [SSH, Tencent Cloud, Ubuntu, Server, Guide]
lang: ''
toc: true
abbrlink: ssh-connection-guide
---

# 腾讯云轻量服务器 SSH 密钥连接配置指南

## 环境信息

- **服务器**: 腾讯云轻量应用服务器 (Ubuntu 24)
- **实例名**: OpenClaw(Clawdbot)-Y8bq
- **IP**: x.x.x.x
- **本地系统**: macOS

---

## 快速复刻步骤

### 1. 腾讯云控制台操作

1. 创建 SSH 密钥对，下载 `.pem` 私钥文件
2. 绑定密钥到实例（需要重启实例生效）
3. 防火墙放行端口 **2222**（TCP，全部 IPv4）

> ⚠️ 腾讯云轻量服务器 22 端口可能被网关层拦截，建议使用 2222 端口

### 2. 服务器端配置（通过 VNC 登录操作）

```bash
# 编辑 SSH socket 配置
sudo systemctl edit ssh.socket
```

添加以下内容：

```
[Socket]
ListenStream=
ListenStream=22
ListenStream=2222
```

保存后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl restart ssh.socket
sudo systemctl restart sshd
```

验证端口监听：

```bash
sudo ss -tlnp | grep 2222
```

### 3. 本地配置（macOS/Linux）

```bash
# 复制密钥到 SSH 目录
cp ~/Downloads/sp_key.pem ~/.ssh/

# 设置权限（必须）
chmod 600 ~/.ssh/sp_key.pem

# 创建 SSH 配置
cat >> ~/.ssh/config << 'EOF'
Host yilin
    HostName xx.xxx.xxx.xxx
    User ubuntu
    Port 2222
    IdentityFile ~/.ssh/sp_key.pem
EOF

# 设置配置文件权限
chmod 644 ~/.ssh/config
```

### 4. 连接测试

```bash
ssh yilin
```

---

## 遇到的问题与原因

| 问题 | 现象 | 原因 | 解决方案 |
|------|------|------|----------|
| 连接立即关闭 | `Connection closed by remote host` | 腾讯云网关层拦截 22 端口连接 | 改用 2222 端口 |
| 服务器日志无记录 | 本地 IP 不在 auth.log 中 | 连接未到达 SSH 服务 | 确认是网关层问题 |
| 2222 端口未监听 | `ss -tlnp` 无 2222 | Ubuntu 24 使用 socket 激活模式 | 修改 ssh.socket 配置 |
| VPN 影响连接 | 出口 IP 异常 | 梯子改变网络路由 | 关闭 VPN 后连接 |

---

## 排查命令速查

```bash
# 本地：详细连接日志
ssh -vvv yilin

# 本地：检查公网 IP
curl ifconfig.me

# 服务器：查看 SSH 日志
sudo tail -f /var/log/auth.log

# 服务器：检查端口监听
sudo ss -tlnp | grep ssh

# 服务器：检查 SSH 配置
sshd -T | grep -E "port|pubkey"

# 服务器：检查 iptables
sudo iptables -L -n
```

---

## 常用连接命令

```bash
ssh yilin           # 连接服务器
exit                # 退出连接（或 Ctrl+D）
```

---

## 评估

| 项目 | 结果 |
|------|------|
| 根本原因 | 腾讯云轻量服务器网关层对 22 端口有额外安全策略 |
| 解决方案 | 使用非标准端口 2222 绕过网关限制 |
| 耗时因素 | 初期误以为是密钥/配置问题，实际是网络层拦截 |
| 建议 | 腾讯云轻量服务器优先使用非 22 端口进行 SSH 连接 |

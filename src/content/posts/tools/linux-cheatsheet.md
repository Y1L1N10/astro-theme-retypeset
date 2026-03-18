---
title: Linux 命令行速查表 🐧
published: 2026-02-02
description: 便于记忆的 Linux 日常操作指南，涵盖命令行快捷键、文件操作、进程管理、网络相关及实用组合技。
tags: [Linux, CheatSheet, CLI]
lang: ''
toc: true
abbrlink: linux-cheatsheet
---

# Linux 命令行速查表 🐧

> 便于记忆的日常操作指南

---

## 一、命令行编辑快捷键

| 快捷键 | 记忆法 | 作用 |
|--------|--------|------|
| `Ctrl + U` | **U**ndo 撤销 | 删除光标前全部 |
| `Ctrl + K` | **K**ill 杀掉 | 删除光标后全部 |
| `Ctrl + W` | **W**ord 单词 | 删除前一个单词 |
| `Ctrl + C` | **C**ancel 取消 | 取消当前命令 |
| `Ctrl + L` | c**L**ear 清屏 | 清空屏幕 |
| `Ctrl + A` | **A**头 (字母表开头) | 跳到行首 |
| `Ctrl + E` | **E**nd 结尾 | 跳到行尾 |
| `Ctrl + R` | **R**everse 反向搜索 | 搜索历史命令 |
| `↑` / `↓` | 上下翻 | 翻阅历史命令 |
| `Tab` | 自动补全 | 补全文件名/命令 |

---

## 二、文件和目录操作

### 查看

| 命令 | 记忆法 | 作用 | 示例 |
|------|--------|------|------|
| `ls` | **L**i**S**t 列出 | 列出文件 | `ls -la` 显示全部含隐藏 |
| `pwd` | **P**rint **W**orking **D**ir | 显示当前目录 | `pwd` |
| `cd` | **C**hange **D**ir | 切换目录 | `cd /home` |
| `cat` | con**CAT**enate 连接显示 | 查看文件内容 | `cat file.txt` |
| `less` | 比 more 更少 (更强) | 分页查看 | `less bigfile.log` |
| `head` | 头部 | 查看前10行 | `head -n 20 file.txt` |
| `tail` | 尾部 | 查看后10行 | `tail -f log.txt` 实时看 |

### 创建

| 命令 | 记忆法 | 作用 | 示例 |
|------|--------|------|------|
| `touch` | 触碰创建 | 创建空文件 | `touch newfile.txt` |
| `mkdir` | **M**a**K**e **DIR** | 创建目录 | `mkdir -p a/b/c` 递归创建 |
| `echo` | 回声 | 输出文字 | `echo "hello" > file.txt` |

### 复制/移动/删除

| 命令 | 记忆法 | 作用 | 示例 |
|------|--------|------|------|
| `cp` | **C**o**P**y | 复制 | `cp file.txt backup.txt` |
| `mv` | **M**o**V**e | 移动/重命名 | `mv old.txt new.txt` |
| `rm` | **R**e**M**ove | 删除 | `rm file.txt` |
| `rm -r` | **R**ecursive | 删除目录 | `rm -r folder/` |
| `rm -rf` | **F**orce 强制 | 强制删除(危险!) | `rm -rf folder/` |

---

## 三、文件编辑 (nano)

> nano 比 vim 简单，推荐新手用

```bash
nano filename.txt
```

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + O` | 保存 (**O**utput) |
| `Ctrl + X` | 退出 (e**X**it) |
| `Ctrl + K` | 剪切一行 |
| `Ctrl + U` | 粘贴 |
| `Ctrl + W` | 搜索 (**W**here is) |
| `Ctrl + G` | 帮助 |

---

## 四、权限和用户

| 命令 | 记忆法 | 作用 | 示例 |
|------|--------|------|------|
| `sudo` | **S**uper **U**ser **DO** | 管理员执行 | `sudo apt update` |
| `chmod` | **CH**ange **MOD**e | 改权限 | `chmod +x script.sh` |
| `chown` | **CH**ange **OWN**er | 改所有者 | `chown user:group file` |

### 权限数字速记

```
r=4 (读)  w=2 (写)  x=1 (执行)

755 = rwxr-xr-x (常用目录/脚本)
644 = rw-r--r-- (常用文件)
777 = rwxrwxrwx (全开，危险)
```

---

## 五、进程管理

| 命令 | 记忆法 | 作用 | 示例 |
|------|--------|------|------|
| `ps` | **P**rocess **S**tatus | 查看进程 | `ps aux` |
| `top` | 顶部监控 | 实时监控 | `top` |
| `htop` | 更好的 top | 彩色监控 | `htop` |
| `kill` | 杀死 | 结束进程 | `kill 1234` |
| `kill -9` | 强杀 | 强制结束 | `kill -9 1234` |
| `pkill` | 按名杀 | 按名称杀 | `pkill nginx` |

### 后台运行

```bash
# 后台运行
命令 &

# 不挂断运行（退出终端也继续）
nohup 命令 &

# 查看后台任务
jobs

# 把后台调到前台
fg
```

---

## 六、网络相关

| 命令 | 作用 | 示例 |
|------|------|------|
| `ping` | 测试连通 | `ping google.com` |
| `curl` | 请求URL | `curl https://api.example.com` |
| `wget` | 下载文件 | `wget https://example.com/file.zip` |
| `ss -tlnp` | 查看端口 | 谁在监听哪个端口 |
| `netstat -tlnp` | 同上(旧) | 查看端口监听 |
| `ip addr` | 查看IP | 本机IP地址 |

---

## 七、系统信息

| 命令 | 作用 |
|------|------|
| `df -h` | 磁盘使用 (**D**isk **F**ree) |
| `du -sh *` | 目录大小 (**D**isk **U**sage) |
| `free -h` | 内存使用 |
| `uptime` | 运行时间 |
| `uname -a` | 系统信息 |

---

## 八、服务管理 (systemd)

| 命令 | 作用 |
|------|------|
| `systemctl start 服务名` | 启动服务 |
| `systemctl stop 服务名` | 停止服务 |
| `systemctl restart 服务名` | 重启服务 |
| `systemctl status 服务名` | 查看状态 |
| `systemctl enable 服务名` | 开机自启 |
| `systemctl disable 服务名` | 禁止自启 |
| `journalctl -u 服务名 -f` | 查看服务日志 |

---

## 九、压缩解压

| 命令 | 作用 |
|------|------|
| `tar -czvf file.tar.gz folder/` | 压缩为 tar.gz |
| `tar -xzvf file.tar.gz` | 解压 tar.gz |
| `unzip file.zip` | 解压 zip |
| `zip -r file.zip folder/` | 压缩为 zip |

**记忆**: tar 参数
- `c` = **C**reate 创建
- `x` = e**X**tract 解压
- `z` = g**Z**ip 压缩
- `v` = **V**erbose 显示过程
- `f` = **F**ile 指定文件名

---

## 十、OpenClaw 专用命令

| 命令 | 作用 |
|------|------|
| `openclaw gateway status` | 查看状态 |
| `openclaw gateway restart` | 重启服务 |
| `openclaw gateway start` | 启动服务 |
| `openclaw gateway stop` | 停止服务 |
| `openclaw tui` | 打开终端界面测试 |
| `openclaw onboard` | 重新配置 |
| `openclaw configure --section 模块` | 配置特定模块 |
| `openclaw pairing approve telegram 代码` | 批准 Telegram 配对 |

### 常用排查流程

```bash
# 1. 看状态
openclaw gateway status

# 2. 看端口
ss -tlnp | grep 18789

# 3. 重启
openclaw gateway restart

# 4. 看日志
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# 5. 测试连接
openclaw tui
```

---

## 十一、实用组合技

```bash
# 查找文件
find /path -name "*.txt"

# 查找内容
grep "关键词" file.txt
grep -r "关键词" folder/    # 递归搜索

# 管道组合
cat file.txt | grep "error" | head -20

# 实时看日志并过滤
tail -f log.txt | grep "error"

# 批量替换文件内容
sed -i 's/旧内容/新内容/g' file.txt
```

---

## 记忆口诀 🧠

```
文件操作：ls看 cd走 cp复制 mv移动 rm删
编辑文件：nano简单 vim强大
权限管理：chmod改权 chown改主 sudo提权
进程管理：ps看 top监 kill杀
服务管理：systemctl 启停重查 start/stop/restart/status
```

---

> 💡 **技巧**: 不确定命令用法时，加 `--help` 或用 `man 命令名` 查看帮助

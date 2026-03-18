---
title: scrcpy 快捷键速查表
published: 2026-03-18
description: scrcpy 投屏工具的完整快捷键参考，涵盖窗口控制、Android 系统按键模拟、剪贴板同步、鼠标手势等操作。
tags: [scrcpy, Android, 快捷键, CheatSheet]
lang: ''
toc: true
abbrlink: scrcpy-shortcuts
---

# scrcpy 快捷键速查表

> 通过键盘和鼠标快捷键，在 scrcpy 窗口中执行各种操作。

---

## 修饰键说明

以下列表中，<kbd>MOD</kbd> 为快捷键修饰符，默认为（左）<kbd>Alt</kbd> 或（左）<kbd>Super</kbd>。

可通过 `--shortcut-mod` 参数修改，可选值为 `lctrl`、`rctrl`、`lalt`、`ralt`、`lsuper`、`rsuper`。示例：

```bash
# 使用右 Ctrl 作为修饰键
scrcpy --shortcut-mod=rctrl

# 使用左 Ctrl 或左 Super 作为修饰键
scrcpy --shortcut-mod=lctrl,lsuper
```

> <kbd>Super</kbd> 即 <kbd>Windows</kbd> 键或 Mac 上的 <kbd>Cmd</kbd> 键。

---

## 完整快捷键列表

| 操作 | 快捷键 |
|------|--------|
| 切换全屏模式 | <kbd>MOD</kbd>+<kbd>f</kbd> |
| 向左旋转画面 | <kbd>MOD</kbd>+<kbd>←</kbd> |
| 向右旋转画面 | <kbd>MOD</kbd>+<kbd>→</kbd> |
| 水平翻转画面 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd> 或 <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd> |
| 垂直翻转画面 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>↑</kbd> 或 <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>↓</kbd> |
| 暂停/重新暂停画面 | <kbd>MOD</kbd>+<kbd>z</kbd> |
| 恢复画面显示 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>z</kbd> |
| 重置视频捕获/编码 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>r</kbd> |
| 窗口缩放至 1:1（像素完美） | <kbd>MOD</kbd>+<kbd>g</kbd> |
| 窗口缩放以去除黑边 | <kbd>MOD</kbd>+<kbd>w</kbd> 或 双击左键¹ |
| 模拟 `HOME` 键 | <kbd>MOD</kbd>+<kbd>h</kbd> 或 鼠标中键 |
| 模拟 `BACK` 返回键 | <kbd>MOD</kbd>+<kbd>b</kbd> 或 <kbd>MOD</kbd>+<kbd>Backspace</kbd> 或 右键² |
| 模拟 `APP_SWITCH` 多任务键 | <kbd>MOD</kbd>+<kbd>s</kbd> 或 鼠标第4键³ |
| 模拟 `MENU` 菜单键（解锁屏幕）⁴ | <kbd>MOD</kbd>+<kbd>m</kbd> |
| 模拟音量加 | <kbd>MOD</kbd>+<kbd>↑</kbd> |
| 模拟音量减 | <kbd>MOD</kbd>+<kbd>↓</kbd> |
| 模拟 `POWER` 电源键 | <kbd>MOD</kbd>+<kbd>p</kbd> |
| 点亮屏幕 | 右键² |
| 关闭设备屏幕（保持投屏） | <kbd>MOD</kbd>+<kbd>o</kbd> |
| 开启设备屏幕 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>o</kbd> |
| 旋转设备屏幕 | <kbd>MOD</kbd>+<kbd>r</kbd> |
| 展开通知栏 | <kbd>MOD</kbd>+<kbd>n</kbd> 或 鼠标第5键³ |
| 展开设置快捷栏 | <kbd>MOD</kbd>+<kbd>n</kbd>+<kbd>n</kbd> 或 双击鼠标第5键³ |
| 收起通知/设置栏 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>n</kbd> |
| 复制到剪贴板⁵ | <kbd>MOD</kbd>+<kbd>c</kbd> |
| 剪切到剪贴板⁵ | <kbd>MOD</kbd>+<kbd>x</kbd> |
| 同步剪贴板并粘贴⁵ | <kbd>MOD</kbd>+<kbd>v</kbd> |
| 注入电脑剪贴板文本 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> |
| 打开键盘设置（仅 HID 键盘） | <kbd>MOD</kbd>+<kbd>k</kbd> |
| 开启/关闭 FPS 计数器 | <kbd>MOD</kbd>+<kbd>i</kbd> |
| 双指缩放/旋转 | <kbd>Ctrl</kbd>+拖动 |
| 垂直倾斜（双指滑动） | <kbd>Shift</kbd>+拖动 |
| 水平倾斜（双指滑动） | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+拖动 |
| 拖入 APK 文件 | 安装 APK 到设备 |
| 拖入非 APK 文件 | 推送文件到设备 |

---

## 注释说明

- ¹ 双击黑边可去除黑边
- ² 屏幕熄灭时右键点亮屏幕，屏幕亮起时右键触发返回键
- ³ 鼠标第 4、5 键（需鼠标支持）
- ⁴ React Native 开发中，`MENU` 键会触发开发菜单
- ⁵ 仅支持 Android 7 及以上版本

---

## 连按快捷键说明

含重复按键的快捷键需要先松开再按第二次。以"展开设置快捷栏"为例：

1. 按住 <kbd>MOD</kbd> 不放
2. 快速双击 <kbd>n</kbd>
3. 松开 <kbd>MOD</kbd>

---

## 注意事项

所有 <kbd>Ctrl</kbd>+_按键_ 的组合会直接转发给设备，由当前活跃的应用程序处理。

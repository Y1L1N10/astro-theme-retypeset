---
title: Swift 函数泛型详解
published: 2025-12-15
description: 深入理解 Swift 函数泛型的使用方法
tags: [Swift, iOS, 函数, 参数, 编程基础]
lang: ''
toc: true
---

# Swift 函数泛型

## 一、参数的双重命名

Swift 函数参数有两个名字：
- **外部参数名（Argument Label）**：调用时使用
- **内部参数名（Parameter Name）**：函数内部使用
```swift
func greet(to name: String) {
//         ^^  ^^^^
//      外部名  内部名
    print("Hello, \(name)")  // 内部用 name
}

greet(to: "张三")  // 调用时用 to
```

## 二、下划线 `_` 的作用

`_` 用于**省略外部参数名**，让调用更简洁。
```swift
// 没有下划线 - 需要参数标签
func swap(a: inout Int, b: inout Int) {
    let temp = a
    a = b
    b = temp
}
swap(a: &x, b: &y)  // 必须写 a: 和 b:

// 有下划线 - 省略参数标签
func swap(_ a: inout Int, _ b: inout Int) {
    let temp = a
    a = b
    b = temp
}
swap(&x, &y)  // 直接传值
```

## 三、三种参数形式
```swift
// 1. 外部名 ≠ 内部名
func greet(to name: String) { }
greet(to: "Alice")

// 2. 外部名 = 内部名（省略写法）
func greet(name: String) { }
greet(name: "Alice")

// 3. 省略外部名（用下划线）
func greet(_ name: String) { }
greet("Alice")
```

## 四、常见外部参数名

### 描述关系的介词
```swift
// of - "...的"
func price(of product: String) -> Double { }
price(of: "iPhone")

// for - "为了..."
func search(for keyword: String) { }
search(for: "Swift")

// in - "在...中"
func find(in array: [Int]) { }
find(in: [1, 2, 3])

// with - "用..."
func connect(with server: String) { }
connect(with: "api.example.com")

// to/from - "到.../从..."
func send(to user: String) { }
send(to: "admin")

func load(from path: String) { }
load(from: "/data/file.json")
```

## 五、使用场景指南

### ✅ 适合用 `_` 的场景
```swift
// 1. 参数含义明显
func square(_ n: Int) -> Int { return n * n }
square(5)

// 2. 数学运算
func add(_ a: Int, _ b: Int) -> Int { return a + b }
add(3, 5)

// 3. 简单操作
func print(_ message: String) { }
print("Hello")

// 4. 类型转换
func convert(_ value: Double) -> Int { return Int(value) }
convert(3.14)
```

### ❌ 不适合用 `_` 的场景
```swift
// 1. 多个相似类型参数
func transfer(from sender: String, to receiver: String, amount: Double) { }
transfer(from: "Alice", to: "Bob", amount: 100)  // ✅ 清晰

func transfer(_ sender: String, _ receiver: String, _ amount: Double) { }
transfer("Alice", "Bob", 100)  // ❌ 容易混淆

// 2. 参数含义不明显
func showAlert(title: String, message: String) { }
showAlert(title: "错误", message: "网络失败")  // ✅ 清晰

func showAlert(_ title: String, _ message: String) { }
showAlert("错误", "网络失败")  // ❌ 不够清晰

// 3. 需要说明关系
func filter(data: [Int], where condition: (Int) -> Bool) { }
filter(data: [1, 2, 3], where: { $0 > 2 })  // ✅ 语义明确
```

## 六、实际开发示例

### 数据管理类
```swift
class DataManager {
    // 获取用户（用 with 说明关系）
    func user(with id: String) -> User? {
        return nil
    }

    // 保存数据（用 to 说明目标）
    func save(to path: String, data: Data) {
        // 保存逻辑
    }

    // 查找元素（用 in 说明范围）
    func find(in collection: [String], matching keyword: String) -> [String] {
        return collection.filter { $0.contains(keyword) }
    }
}

// 使用
let manager = DataManager()
manager.user(with: "12345")
manager.save(to: "/data/file.txt", data: someData)
manager.find(in: ["apple", "banana"], matching: "app")
```

### 工具函数
```swift
// 简单验证（用下划线）
func isValidEmail(_ email: String) -> Bool {
    return email.contains("@")
}

isValidEmail("test@example.com")  // 简洁

// 复杂验证（用参数名）
func validate(email: String, checkFormat: Bool, checkDomain: Bool) -> Bool {
    // 验证逻辑
    return true
}

validate(email: "test@example.com", checkFormat: true, checkDomain: false)  // 清晰
```

## 七、Swift 标准库示例
```swift
// 用了下划线的函数
print("Hello")           // 不需要参数名
max(10, 20)              // 含义明显
abs(-5)                  // 简洁直观
String(123)              // 类型转换

// 需要参数名的函数
String(repeating: "*", count: 5)  // 需要说明
[1, 2, 3].firstIndex(of: 2)       // 需要说明关系
```

## 八、inout 参数补充

`inout` 允许函数修改参数值，调用时需要 `&` 前缀。
```swift
func increment(_ value: inout Int) {
    value += 1
}

var count = 10
increment(&count)  // 传递引用
print(count)       // 11
```

## 九、最佳实践总结

| 写法 | 调用方式 | 适用场景 |
|-----|---------|---------|
| `func f(_ a: T)` | `f(value)` | 单参数、含义明显 |
| `func f(a: T)` | `f(a: value)` | 一般情况 |
| `func f(label a: T)` | `f(label: value)` | 需要更清晰说明 |

### 选择标准

1. **单参数 + 含义明显** → 用 `_`
2. **多个相似参数** → 不用 `_`，用描述性参数名
3. **需要说明关系** → 用介词作为外部参数名（of, for, with, to, from, in）

### 核心原则

让代码读起来**像自然语言**：
```swift
// ✅ 好的例子
print("Hello")                              // 自然
max(10, 20)                                 // 清晰
showAlert(title: "提示", message: "完成")   // 易懂
transfer(from: "Alice", to: "Bob", amount: 100)  // 语义明确

// ❌ 不好的例子
print(message: "Hello")                     // 啰嗦
showAlert("提示", "完成")                   // 不清晰
transfer("Alice", "Bob", 100)               // 容易混淆
```

## 十、记忆技巧

- `_` = "我不需要标签，直接传值就行"
- 外部参数名 = "告诉调用者这是什么"
- 内部参数名 = "函数内部怎么用"

**一句话总结**：外部参数名是给**调用者**看的，内部参数名是给**实现者**用的，下划线让你**省略外部名**。

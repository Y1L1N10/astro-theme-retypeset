---
title: Swift 闭包详解
published: 2025-12-16
description: 深入理解 Swift 闭包的使用方法
tags: [Swift, iOS, 闭包, 编程基础]
lang: ''
toc: true
---

## 第一阶段：基础入门

### 1.1 什么是闭包？

闭包就是一段可以传递和使用的代码块，像一个"便携式函数"。

```swift
// 最简单的闭包
let simpleClosure = {
    print("这是一个闭包")
}

// 调用闭包
simpleClosure()  // 输出：这是一个闭包
```

### 1.2 带参数的闭包

```swift
// 接收一个参数
let greet = { (name: String) in
    print("你好, \(name)!")
}

greet("小明")  // 输出：你好, 小明!
```

### 1.3 带返回值的闭包

```swift
// 接收参数并返回结果
let add = { (a: Int, b: Int) -> Int in
    return a + b
}

let result = add(5, 3)
print(result)  // 输出：8
```

**基础语法总结：**
```swift
{ (参数: 类型) -> 返回类型 in
    // 代码
    return 结果
}
```

---

## 第二阶段：常用简化写法

### 2.1 类型推断

Swift 很聪明，可以自动推断类型：

```swift
let numbers = [1, 2, 3, 4, 5]

// 完整写法
let doubled1 = numbers.map({ (num: Int) -> Int in
    return num * 2
})

// 简化：省略类型
let doubled2 = numbers.map({ num in
    return num * 2
})

// 再简化：省略 return
let doubled3 = numbers.map({ num in num * 2 })

// 最简化：使用 $0, $1 表示第1、第2个参数
let doubled4 = numbers.map({ $0 * 2 })

// 超级简化：尾随闭包
let doubled5 = numbers.map { $0 * 2 }
```

### 2.2 尾随闭包语法

当闭包是函数的最后一个参数时，可以写在括号外面：

```swift
// 普通写法
numbers.filter({ $0 > 2 })

// 尾随闭包写法（更常用）
numbers.filter { $0 > 2 }

// 多行闭包
numbers.map { number in
    let result = number * 2
    print("处理: \(number) -> \(result)")
    return result
}
```

---

## 第三阶段：核心特性

### 3.1 值捕获（Capturing Values）

闭包可以"记住"它周围的变量：

```swift
func makeMultiplier(factor: Int) -> (Int) -> Int {
    // 闭包捕获了 factor
    return { number in
        return number * factor
    }
}

let multiplyByThree = makeMultiplier(factor: 3)
print(multiplyByThree(5))   // 15
print(multiplyByThree(10))  // 30

let multiplyByFive = makeMultiplier(factor: 5)
print(multiplyByFive(5))    // 25
```

**实际例子：计数器**

```swift
func makeCounter() -> () -> Int {
    var count = 0

    return {
        count += 1
        return count
    }
}

let counter = makeCounter()
print(counter())  // 1
print(counter())  // 2
print(counter())  // 3
```

### 3.2 闭包是引用类型

```swift
let counter1 = makeCounter()
let counter2 = counter1  // counter2 指向同一个闭包

print(counter1())  // 1
print(counter2())  // 2（共享同一个 count）
print(counter1())  // 3
```

---

## 第四阶段：高级用法

### 4.1 逃逸闭包（@escaping）

当闭包在函数返回后才执行，需要标记为 `@escaping`：

```swift
// 存储闭包的数组
var completionHandlers: [() -> Void] = []

// 逃逸闭包：闭包被存储，稍后执行
func addCompletionHandler(handler: @escaping () -> Void) {
    completionHandlers.append(handler)
}

// 非逃逸闭包：闭包立即执行
func doSomething(action: () -> Void) {
    action()
}

// 使用
addCompletionHandler {
    print("稍后执行")
}

doSomething {
    print("立即执行")
}
```

**网络请求示例：**

```swift
func fetchData(completion: @escaping (String) -> Void) {
    // 模拟异步操作
    DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
        let data = "服务器返回的数据"
        completion(data)
    }
}

// 调用
fetchData { data in
    print("收到数据: \(data)")
}
print("请求已发送，等待响应...")
```

### 4.2 自动闭包（@autoclosure）

自动将表达式包装成闭包，常用于延迟执行：

```swift
// 不使用自动闭包
func logIfTrue(condition: () -> Bool, message: String) {
    if condition() {
        print(message)
    }
}

logIfTrue(condition: { 2 > 1 }, message: "条件为真")

// 使用自动闭包（更简洁）
func logIfTrue(condition: @autoclosure () -> Bool, message: String) {
    if condition() {
        print(message)
    }
}

logIfTrue(condition: 2 > 1, message: "条件为真")
```

**实际应用：断言**

```swift
func assert(_ condition: @autoclosure () -> Bool,
            _ message: @autoclosure () -> String) {
    #if DEBUG
    if !condition() {
        print("断言失败: \(message())")
    }
    #endif
}

// 使用
let age = 15
assert(age >= 18, "年龄必须大于18岁")
```

### 4.3 循环引用问题

闭包捕获 `self` 时要小心循环引用：

```swift
class Person {
    var name: String
    var sayHello: (() -> Void)?

    init(name: String) {
        self.name = name
    }

    func setupClosure() {
        // ❌ 错误：会造成循环引用
        sayHello = {
            print("Hello, I'm \(self.name)")
        }

        // ✅ 正确：使用 weak self
        sayHello = { [weak self] in
            guard let self = self else { return }
            print("Hello, I'm \(self.name)")
        }

        // ✅ 或使用 unowned self（确定不会为 nil 时）
        sayHello = { [unowned self] in
            print("Hello, I'm \(self.name)")
        }
    }

    deinit {
        print("\(name) 被释放")
    }
}
```

**捕获列表规则：**
- `[weak self]` - self 可能为 nil，需要用可选绑定
- `[unowned self]` - self 不会为 nil，不需要解包
- `[weak variable1, unowned variable2]` - 可同时捕获多个

---

## 第五阶段：实际开发应用

### 5.1 数组操作（最常用）

```swift
let products = [
    ("iPhone", 999),
    ("iPad", 599),
    ("MacBook", 1299),
    ("AirPods", 199)
]

// map - 转换数据
let productNames = products.map { $0.0 }
// ["iPhone", "iPad", "MacBook", "AirPods"]

// filter - 筛选数据
let expensiveProducts = products.filter { $0.1 > 500 }
// [("iPhone", 999), ("iPad", 599), ("MacBook", 1299)]

// reduce - 计算总价
let totalPrice = products.reduce(0) { sum, product in
    sum + product.1
}
// 3096

// sorted - 排序
let sortedProducts = products.sorted { $0.1 < $1.1 }

// compactMap - 过滤 nil
let prices: [Int?] = [100, nil, 200, nil, 300]
let validPrices = prices.compactMap { $0 }
// [100, 200, 300]

// forEach - 遍历
products.forEach { name, price in
    print("\(name): $\(price)")
}
```

**链式调用：**

```swift
let result = products
    .filter { $0.1 > 200 }           // 价格大于200
    .sorted { $0.1 < $1.1 }           // 按价格排序
    .map { "\($0.0): $\($0.1)" }     // 格式化
    .joined(separator: ", ")          // 连接成字符串

print(result)
// iPad: 599, iPhone: 999, MacBook: 1299
```

### 5.2 UI 事件处理

```swift
import UIKit

class ViewController: UIViewController {
    let button = UIButton()

    override func viewDidLoad() {
        super.viewDidLoad()

        // 按钮点击
        button.addAction(UIAction { [weak self] _ in
            self?.handleButtonTap()
        }, for: .touchUpInside)

        // 手势识别
        let tapGesture = UITapGestureRecognizer { [weak self] gesture in
            self?.handleTap(gesture)
        }
        view.addGestureRecognizer(tapGesture)
    }

    func handleButtonTap() {
        print("按钮被点击")
    }

    func handleTap(_ gesture: UITapGestureRecognizer) {
        let location = gesture.location(in: view)
        print("点击位置: \(location)")
    }
}
```

### 5.3 网络请求

```swift
import Foundation

class NetworkManager {
    // 基础网络请求
    func fetchUser(id: Int, completion: @escaping (Result<User, Error>) -> Void) {
        let url = URL(string: "https://api.example.com/users/\(id)")!

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: -1)))
                return
            }

            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    // 使用
    func loadUserData() {
        fetchUser(id: 123) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let user):
                    print("获取用户成功: \(user.name)")
                    self?.updateUI(with: user)
                case .failure(let error):
                    print("获取用户失败: \(error)")
                    self?.showError(error)
                }
            }
        }
    }

    func updateUI(with user: User) {}
    func showError(_ error: Error) {}
}

struct User: Codable {
    let id: Int
    let name: String
}
```

### 5.4 动画

```swift
import UIKit

class AnimationViewController: UIViewController {
    let box = UIView()

    func animateBox() {
        // 简单动画
        UIView.animate(withDuration: 0.5) {
            self.box.frame.origin.x += 100
        }

        // 带完成回调的动画
        UIView.animate(withDuration: 0.5, animations: {
            self.box.alpha = 0.5
            self.box.transform = CGAffineTransform(scaleX: 1.5, y: 1.5)
        }) { finished in
            if finished {
                print("动画完成")
            }
        }

        // 弹簧动画
        UIView.animate(
            withDuration: 0.7,
            delay: 0,
            usingSpringWithDamping: 0.6,
            initialSpringVelocity: 0.5,
            options: .curveEaseInOut,
            animations: {
                self.box.center.y += 200
            },
            completion: { _ in
                print("弹跳完成")
            }
        )
    }
}
```

### 5.5 SwiftUI 中的闭包

```swift
import SwiftUI

struct ContentView: View {
    @State private var count = 0
    @State private var items = ["苹果", "香蕉", "橙子"]

    var body: some View {
        VStack {
            // Button 的 action 闭包
            Button("点击 +1") {
                count += 1
            }

            Text("计数: \(count)")

            // List 的 ForEach 闭包
            List(items, id: \.self) { item in
                Text(item)
            }

            // onAppear 生命周期闭包
            .onAppear {
                print("视图出现")
                loadData()
            }

            // onChange 监听闭包
            .onChange(of: count) { newValue in
                print("计数变为: \(newValue)")
            }
        }
    }

    func loadData() {
        // 加载数据
    }
}
```

### 5.6 自定义工具函数

```swift
// 延迟执行
func delay(seconds: Double, action: @escaping () -> Void) {
    DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
        action()
    }
}

// 使用
delay(seconds: 2.0) {
    print("2秒后执行")
}

// 重试机制
func retry<T>(
    times: Int,
    delay: TimeInterval = 1.0,
    operation: @escaping (@escaping (Result<T, Error>) -> Void) -> Void,
    completion: @escaping (Result<T, Error>) -> Void
) {
    operation { result in
        switch result {
        case .success:
            completion(result)
        case .failure(let error):
            if times > 1 {
                DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                    retry(times: times - 1, delay: delay, operation: operation, completion: completion)
                }
            } else {
                completion(.failure(error))
            }
        }
    }
}

// 节流函数
class Throttler {
    private var workItem: DispatchWorkItem?
    private let queue: DispatchQueue
    private let interval: TimeInterval

    init(interval: TimeInterval, queue: DispatchQueue = .main) {
        self.interval = interval
        self.queue = queue
    }

    func throttle(action: @escaping () -> Void) {
        workItem?.cancel()
        workItem = DispatchWorkItem(block: action)
        queue.asyncAfter(deadline: .now() + interval, execute: workItem!)
    }
}
```

---

## 实战项目示例

### 完整示例：Todo List

```swift
import SwiftUI

struct Todo: Identifiable {
    let id = UUID()
    var title: String
    var isCompleted: Bool
}

class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []

    // 添加任务
    func addTodo(title: String, completion: @escaping () -> Void) {
        let todo = Todo(title: title, isCompleted: false)
        todos.append(todo)

        // 模拟保存到服务器
        saveTodoToServer(todo) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    print("保存成功")
                    completion()
                case .failure(let error):
                    print("保存失败: \(error)")
                    self?.todos.removeLast()
                }
            }
        }
    }

    // 切换完成状态
    func toggleTodo(id: UUID) {
        if let index = todos.firstIndex(where: { $0.id == id }) {
            todos[index].isCompleted.toggle()
        }
    }

    // 删除任务
    func deleteTodo(at offsets: IndexSet) {
        todos.remove(atOffsets: offsets)
    }

    // 筛选任务
    func filteredTodos(showCompleted: Bool) -> [Todo] {
        todos.filter { todo in
            showCompleted ? todo.isCompleted : !todo.isCompleted
        }
    }

    private func saveTodoToServer(_ todo: Todo, completion: @escaping (Result<Void, Error>) -> Void) {
        // 模拟网络请求
        DispatchQueue.global().asyncAfter(deadline: .now() + 1) {
            completion(.success(()))
        }
    }
}

struct TodoListView: View {
    @StateObject private var viewModel = TodoViewModel()
    @State private var newTodoTitle = ""

    var body: some View {
        NavigationView {
            VStack {
                // 输入框
                HStack {
                    TextField("新任务", text: $newTodoTitle)
                        .textFieldStyle(RoundedBorderTextFieldStyle())

                    Button("添加") {
                        guard !newTodoTitle.isEmpty else { return }

                        viewModel.addTodo(title: newTodoTitle) {
                            newTodoTitle = ""
                        }
                    }
                }
                .padding()

                // 任务列表
                List {
                    ForEach(viewModel.todos) { todo in
                        HStack {
                            Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(todo.isCompleted ? .green : .gray)
                                .onTapGesture {
                                    viewModel.toggleTodo(id: todo.id)
                                }

                            Text(todo.title)
                                .strikethrough(todo.isCompleted)
                        }
                    }
                    .onDelete { offsets in
                        viewModel.deleteTodo(at: offsets)
                    }
                }
            }
            .navigationTitle("待办事项")
        }
    }
}
```

---

## 最佳实践总结

### ✅ 应该做的

1. **简洁优先** - 能简化就简化，使用尾随闭包
2. **避免循环引用** - 捕获 `self` 时使用 `[weak self]` 或 `[unowned self]`
3. **明确逃逸性** - 异步操作用 `@escaping`
4. **善用高阶函数** - map、filter、reduce 让代码更清晰
5. **合理命名** - 闭包参数要有意义的名字

### ❌ 不应该做的

1. **过度嵌套** - 避免闭包套闭包超过3层
2. **忽略内存管理** - 不注意循环引用会导致内存泄漏
3. **滥用简写** - 太多 `$0`、`$1` 会降低可读性
4. **长闭包内联** - 超过5行应该提取成函数

### 调试技巧

```swift
// 打印闭包执行
let action = {
    print("闭包开始执行")
    // 你的代码
    print("闭包执行完毕")
}

// 检查闭包是否被释放
class ClosureHolder {
    var closure: (() -> Void)?

    deinit {
        print("ClosureHolder 被释放")
    }
}
```

---

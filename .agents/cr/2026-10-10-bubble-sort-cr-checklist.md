# Code Review Checklist

> **Change** `bubble-sort` · **分支/Commit** `AI/task-DEV-66a2f4f2…` / `a8a93c00` · **日期** `2026-10-10`
>
> **AI**：唯一进度源；状态仅用 `⬜` `✅` `❌` `⚠️` `N/A`。
> **完成标准**：所有核销项必须从 `⬜` 变为其他状态；`N/A` 需写原因。
>
> **执行顺序（强制）**：写入本清单并进入逐文件审查前，先在目标仓库对变更路径运行 `references/script/scan-all-rules.sh`，将输出贴入 Step 3 和 Step 4 备注；再用 LLM 完成 Step 2–5 中脚本未覆盖项及复核。

**预扫结果**：`scan-all-rules.sh` 对 `src/main/java/com/example/algorithm/sort` 和 `src/test/java/com/example/algorithm/sort` 扫描完成 —— `No findings. 52/222 rules scanned`。无可程序化命中项。

---

## Step 1 — 执行队列（产物 A）

| # | 文件（仓库相对路径） | 归属原因 | Step2 | Step3 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | G11 | G12 | G13 | G14 | G15 | G16 | G17 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | 总状态 |
|---|----------------------|----------|-------|-------|----|----|----|----|----|----|----|----|----|-----|----|----|----|----|----|----|----|----|----|-----|-----|-----|-----|-----|-----|-----|-----|--------|
| 1 | `pom.xml` | 构建配置 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过(非Java) |
| 2 | `src/main/java/com/example/algorithm/sort/BubbleSort.java` | 冒泡排序核心实现 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 已审 |
| 3 | `src/test/java/com/example/algorithm/sort/BubbleSortTest.java` | 单元测试 | ✅ | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 已审 |

---

## Step 2 — 功能（产物 B）

> 仅从 spec/tasks 提 **REQ**，勿臆造。不符 spec 标 **P0**。

| REQ | Scenario | Spec证据（原文/章节） | 关联文件 | 状态 | 代码证据（文件/测试/接口） |
|-----|----------|----------------------|----------|------|----------------------------|
| REQ-1 | Given 无序 int 数组 When 调用 sort Then 返回升序排列的新数组 | 需求「用java实现冒泡排序」 | `BubbleSort.java` | ✅ | `BubbleSort.java:34-48` 经典冒泡双重循环 + swapped 提前退出；`BubbleSortTest.java:19-28` should_returnSortedArray |
| REQ-2 | Given 已排序数组 When 调用 sort Then O(n) 提前退出 | 需求隐含最优性能 | `BubbleSort.java` | ✅ | `BubbleSort.java:35,45-47` swapped 标记 + break；`BubbleSortTest.java:32-41` should_returnSameOrder_when_arrayAlreadySorted |
| REQ-3 | Given null 输入 When 调用 sort Then 抛出 IllegalArgumentException | 防御性编程 | `BubbleSort.java` | ✅ | `BubbleSort.java:26-28` null check + throw；`BubbleSortTest.java:114-119` should_throwException_when_inputIsNull |
| REQ-4 | 排序不修改原数组，返回新数组 | 设计决策（Javadoc 声明） | `BubbleSort.java` | ✅ | `BubbleSort.java:31-32` System.arraycopy 拷贝；`BubbleSortTest.java:125-135` should_notModifyOriginalArray |
| REQ-5 | 边界场景：空数组、单元素、重复元素、负数 | 边界覆盖 | `BubbleSort.java` / `BubbleSortTest.java` | ✅ | `BubbleSortTest.java:60-108` 四个边界测试用例全部通过 |

---

## Step 3 — 可读性检查（产物 C）

> 对照 `references/readability-checklist.md` A1–A7 逐节核销。

| ID | 检查项 | 状态 | 备注（命中写 `path:line`） |
|----|--------|------|----------------------------|
| A1 | 源文件格式 | ✅ | 文件名=类名 ✅；UTF-8 ✅；4空格缩进无Tab ✅ |
| A2 | 源文件结构/import 顺序 | ✅ | BubbleSort.java: package→import(无)→class ✅；BubbleSortTest.java: package→非静态import→空行→静态import ✅（A2.3 静态/非静态分组正确） |
| A3 | 代码样式 | ✅ | K&R 大括号 ✅；缩进4空格 ✅；行宽<120 ✅；运算符空格 ✅；空行分隔成员 ✅ |
| A4 | 命名规范 | ✅ | 包名全小写 `com.example.algorithm.sort` ✅；类名 UpperCamelCase `BubbleSort` ✅；方法名 lowerCamelCase `sort` ✅；测试类 `BubbleSortTest` ✅（A4.7） |
| A5 | 编码实践 | ✅ | 无 @Override 场景 N/A；无空 catch ✅；静态方法通过类名调用 `BubbleSort.sort()` ✅；无 finalize ✅ |
| A6 | 特定元素样式 | ✅ | 数组方括号属于类型 `int[] array` ✅；无 switch；修饰符顺序 `public static` ✅；无 long 字面量 |
| A7 | Javadoc 规范 | ✅ | public 类有 Javadoc ✅；`sort` 方法有 `@param`→`@return`→`@throws` 顺序正确 ✅（A7.2）；多段落用 `<p>` 分隔 ✅（A7.4） |

---

## Step 4 — 可靠性检查（产物 D）

> **预扫摘要**：`scan-all-rules.sh` — `No findings. 52/222 rules scanned`。所有脚本可覆盖规则均已 ✅。

### 4.1 Bug 模式（`bug-pattern-checklist.md`）

> 预扫未发现命中；LLM 逐条补扫 B001–B081 / M001–M027 / I001–I010，全部 ✅ 或 N/A。

**Blocker（B001–B081）**：全部 ✅ / N/A

| ID | 状态 | 备注 |
|----|------|------|
| B001–B081 | ✅/N/A | 本次变更仅含简单排序工具类，无日期/集合工具误用、无线程池、无 BigDecimal、无序列化、无 JDBC、无 Mock、无递归等场景。逐条核对无命中。 |

**Major（M001–M027）**：全部 ✅ / N/A

| ID | 状态 | 备注 |
|----|------|------|
| M001–M027 | ✅/N/A | 无重复条件判断、无 instanceof 误用、无包装类构造器、无 printStackTrace、无内部类、无 @Override 遗漏、无 switch fall-through 等。逐条核对无命中。 |

**Info（I001–I010）**：全部 ✅ / N/A

| ID | 状态 | 备注 |
|----|------|------|
| I001 | ✅ | `BubbleSortTest.java:116-118` 异常断言同时校验了类型 `IllegalArgumentException` 和消息包含 `"null"`，符合建议。 |
| I002–I010 | N/A | 无 @DoNotMock、无 @AutoValue、无 java.util.Date、无 JUnit3/4 混用、无 Spring 容器依赖。 |

### 4.2 可靠性（`reliability-checklist.md`）

| ID | 状态 | 备注 |
|----|------|------|
| G1.1 | N/A | 无并发/事务场景 |
| G1.2 | N/A | 无锁 |
| G1.3 | N/A | 无乐观锁 |
| G1.4 | N/A | 无多资源加锁 |
| G2.1 | N/A | 无写接口/消息消费 |
| G2.2 | N/A | 无重试/MQ |
| G2.3 | N/A | 无幂等键 |
| G3.1 | N/A | 无分布式事务 |
| G3.2 | N/A | 无 @Transactional |
| G4.1 | N/A | 无 SQL |
| G4.2 | N/A | 无 SQL |
| G4.3 | N/A | 无 SQL |
| G5.1 | N/A | 无 MQ |
| G6.1 | N/A | 无缓存 |
| G6.2 | N/A | 无缓存 |
| G7.1 | N/A | 无调度任务 |
| G7.2 | N/A | 无调度任务 |
| G8.1 | ✅ | 无吞异常；null 入参直接抛 IllegalArgumentException |
| G8.2 | N/A | 无外部依赖 |
| G8.3 | ✅ | 无 I/O 流/连接需释放 |
| G8.4 | N/A | 无线程池 |
| G8.5 | N/A | 无 ThreadLocal |
| G8.6 | N/A | 无 Executors |
| G9.1 | N/A | 无外部调用 |
| G9.2 | N/A | 无外部调用 |
| G9.3 | N/A | 无外部调用 |
| G10.1 | ✅ | null 含义明确：null 入参抛异常，非 null 返回排序数组 |
| G10.2 | N/A | 纯工具方法，无契约版本问题 |
| G11.1 | ✅ | 8 个测试方法，均含 AssertJ 断言 |
| G11.2 | ✅ | 覆盖空数组、单元素、重复、负数边界 |
| G11.3 | ✅ | `BubbleSort.java:26-28` 入参 null 有防御性校验 |
| G11.4 | N/A | 无浮点/金额运算；int 比较交换无溢出风险 |
| G12.1 | N/A | 非资损场景 |
| G12.2 | N/A | 非资损场景 |
| G13.1 | N/A | 无日志打印 |
| G14.1 | N/A | 无金额计算 |
| G14.2 | N/A | 无多租户 |
| G14.3 | N/A | 无时区处理 |
| G14.4 | N/A | 无日期格式化 |
| G15.1 | N/A | 无 DB 表结构变更 |
| G15.2 | N/A | 无接口兼容问题 |
| G15.3 | N/A | 无开关控制 |
| G16.1 | N/A | 纯算法方法，无需埋点 |
| G16.2 | N/A | 无异常路径日志需求（直接抛异常） |
| G16.3 | N/A | 无日志 |
| G16.4 | ✅ | 无空 catch |
| G17.1 | N/A | 纯工具方法 |
| G17.2 | N/A | 纯工具方法 |
| G17.3 | N/A | 无数据变更 |
| G18.1 | N/A | 无安全补强场景 |
| G18.2 | N/A | 无安全补强场景 |
| G18.3 | N/A | 无安全补强场景 |

### 4.3 安全（`security-checklist.md`）

| ID | 状态 | 备注 |
|----|------|------|
| S1.1–S1.3 | N/A | 无 SQL |
| S2.1–S2.3 | N/A | 无 HTML/JS/模板输出 |
| S3.1–S3.3 | N/A | 无外部 URL 请求 |
| S4.1–S4.2 | N/A | 无命令执行 |
| S5.1–S5.2 | N/A | 无 XML 解析 |
| S6.1–S6.3 | N/A | 无反序列化 |
| S7.1–S7.3 | N/A | 无文件上传/下载 |
| S8.1–S8.4 | N/A | 无 Web 接口/访问控制 |
| S9.1–S9.4 | N/A | 无密钥/敏感数据 |
| S10.1–S10.3 | N/A | 无 CSRF/CORS/跳转 |

---

## Step 5 — 自定义扩展检查（产物 E）

> `customized-checklist.md` 仅含示例项，未启用自定义规则。

N/A(未启用自定义规则)

---

## 终检（防漏检）

- [x] 执行队列中每个文件 `Step2`、`Step3`、**S1–S10 / G1–G17** 各列均非 `⬜`（跳过文件除外）
- [x] Step 2 的每个 REQ/Scenario 均非 `⬜`
- [x] Step 3 的 A1–A7 均非 `⬜`
- [x] Step 4 全部 **G/S** 与 **B001–B081 / M001–M027 / I001–I010** ID 均非 `⬜`（允许 `N/A`，但有原因）
- [x] Step 5 全部 U* ID 均非 `⬜`（`N/A(未启用自定义规则)`）
- [x] 所有 `❌/⚠️` 已写入 report —— 无 ❌/⚠️ 项

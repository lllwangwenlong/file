# Daily Todo — 日常待办事项 设计文档

- 日期：2026-09-20
- 阶段：需求澄清（brainstorming）产物
- 决策来源：用户确认「沿用既有实现并复核」「含只读列表」

## 1. 目标与范围

帮助内部用户记录日常待办事项。最小闭环为「仅创建」：

- 核心功能：新增待办事项（事项名称 + 描述）
- 辅助展示：创建后可查看待办列表（**仅只读**，不含编辑、删除、标记完成）
- 明确不做：持久化存储（数据库）、编辑/删除/完成标记、分页/搜索、用户体系

## 2. 架构

沿用既有实现，不做架构调整：

- 前端：Vue 2.5 单页应用（`vue/02day-vue/my-project`），Vuex 3.0 集中管理状态，axios 0.18 调用后端
- 后端：Express 4.16（`vue/03day-vue/server`），已配置 cors；内存数组存储，无数据库
- 页面结构：TodoView（页面容器）→ TodoForm（创建表单）+ TodoList（只读列表）

## 3. 数据契约

Todo 项结构：

```json
{
  "id": 1,
  "name": "事项名称",
  "description": "事项描述",
  "createdAt": "2026-09-20T08:00:00.000Z"
}
```

接口（BASE_URL：`http://localhost:3000/todos`）：

| 方法 | 路径 | 入参 | 成功返回 | 失败返回 |
| ---- | ---- | ---- | ---- | ---- |
| GET | /todos | — | `{ code: 200, data: Todo[] }` | — |
| POST | /todos | `{ name, description }` | `{ code: 201, data: Todo }` | 400 `{ code: 400, message: "待办事项名称不能为空" }` |

校验规则：`name` 必填（trim 后非空）；`description` 可为空字符串。

## 4. 组件与数据流

- `api/todos.js`：`fetchTodos()` / `createTodo({ name, description })`，封装 axios 调用
- `store/modules/todos.js`：state `todos`；actions `fetchTodos`（拉取后 SET_TODOS）、`createTodo`（提交后 ADD_TODO 追加本地列表，无需重新拉取）
- `TodoForm.vue`：名称 + 描述表单，提交时向 TodoView 发出 submit 事件
- `TodoView.vue`：容器组件，处理 create/fetch 调用与错误提示；mounted 时拉取列表
- `TodoList.vue`：只读展示名称、描述、创建时间（YYYY-MM-DD HH:mm）与总数；空列表显示占位文案

## 5. 错误处理

- 创建失败：前端 alert 提示（优先展示后端 message）
- 列表拉取失败（如后端未启动）：静默降级为空列表，不阻断页面
- 后端名称为空：返回 400 + 中文错误消息

## 6. 已知特性（维持现状，本轮不改动）

- 前端 API 地址硬编码为 `http://localhost:3000/todos`（内部使用，本地运行）
- 后端数据保存在内存，进程重启后清空（最小闭环接受）

## 7. 既有实现复核结论

2026-09-20 对照本设计复核以下文件，均与需求契约一致，无需改动：

- `vue/03day-vue/server/routes/todos.js`（GET/POST + 校验 + 201/400 返回）
- `vue/02day-vue/my-project/src/api/todos.js`
- `vue/02day-vue/my-project/src/store/modules/todos.js`
- `vue/02day-vue/my-project/src/components/TodoView.vue` / `TodoForm.vue` / `TodoList.vue`

## 8. 测试策略

- 后端：启动 server 后用 curl 验证 POST（成功 201、空名称 400）与 GET（返回已创建项）
- 前端：启动 dev server，手动验证表单创建后列表即时出现新条目、空名称提交被前端拦截、后端未启动时列表静默降级

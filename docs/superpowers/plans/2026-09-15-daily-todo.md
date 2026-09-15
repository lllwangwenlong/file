# Daily Todo — 日常待办事项 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为内部用户构建日常待办事项记录功能，最小闭环仅支持创建事项（名称 + 描述）。

**Architecture:** 前端 Vue 2 单页应用通过 axios 调用 Express REST API；后端内存数组存储；Vuex 集中管理状态。组件按职责拆分：TodoView（页面容器）→ TodoForm（创建表单）+ TodoList（列表展示）。

**Tech Stack:** Vue 2.5 + Vuex 3.0 + Vue Router 3.0 + axios 0.18（前端）；Express 4.16 + cors（后端）

## Global Constraints

- 最小闭环：仅「创建」功能，不含编辑/删除/标记完成
- Todo 项数据结构：`{ id: number, name: string, description: string, createdAt: string }`
- 后端存储：内存数组，无需数据库
- CORS 已配置（`vue/03day-vue/server` 已有 `cors` 依赖）
- 目标用户：内部用户
- 前端路由模式：history

---

### Task 1: 后端 Todo REST API

**Files:**
- Create: `vue/03day-vue/server/routes/todos.js`
- Modify: `vue/03day-vue/server/app.js:22-24`

**Interfaces:**
- Produces: `POST /todos` → `{ code: 200, data: { id, name, description, createdAt } }`；`GET /todos` → `{ code: 200, data: Todo[] }`

- [ ] **Step 1: 创建 Todo 路由文件**

```javascript
// vue/03day-vue/server/routes/todos.js
var express = require('express');
var router = express.Router();

// 内存存储
var todos = [];
var nextId = 1;

// GET /todos — 获取所有待办事项
router.get('/', function(req, res, next) {
  res.json({
    code: 200,
    data: todos
  });
});

// POST /todos — 创建待办事项
// Body: { name: string, description: string }
router.post('/', function(req, res, next) {
  var name = (req.body.name || '').trim();
  var description = (req.body.description || '').trim();

  if (!name) {
    return res.status(400).json({
      code: 400,
      message: '待办事项名称不能为空'
    });
  }

  var todo = {
    id: nextId++,
    name: name,
    description: description,
    createdAt: new Date().toISOString()
  };

  todos.push(todo);

  res.status(201).json({
    code: 201,
    data: todo
  });
});

module.exports = router;
```

- [ ] **Step 2: 在 app.js 中注册路由**

```javascript
// 在 var usersRouter = require('./routes/users'); 之后添加：
var todosRouter = require('./routes/todos');

// 在 app.use('/users', usersRouter); 之后添加：
app.use('/todos', todosRouter);
```

完整的修改后 `app.js` 关键行：

```javascript
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');       // ← 新增

// ...

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);                     // ← 新增
```

- [ ] **Step 3: 启动后端验证 API**

```bash
cd vue/03day-vue/server && npm start &
sleep 2
# 测试 POST
curl -s -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"name":"完成报告","description":"Q3 季度报告撰写"}' | python -m json.tool
# 期望: {"code":201,"data":{"id":1,"name":"完成报告","description":"Q3 季度报告撰写","createdAt":"..."}}

# 测试 GET
curl -s http://localhost:3000/todos | python -m json.tool
# 期望: {"code":200,"data":[{...}]}

# 测试空名称校验
curl -s -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"name":"","description":"test"}' | python -m json.tool
# 期望: {"code":400,"message":"待办事项名称不能为空"}
```

Expected: POST 201 + GET 200 + 空名称 400

- [ ] **Step 5: Commit**

```bash
git add vue/03day-vue/server/routes/todos.js vue/03day-vue/server/app.js
git commit -m "feat: add todo REST API (POST/GET) with in-memory storage"
```

---

### Task 2: 前端 API 封装

**Files:**
- Create: `vue/02day-vue/my-project/src/api/todos.js`

**Interfaces:**
- Consumes: `POST /todos`, `GET /todos`（Task 1）
- Produces: `createTodo({ name, description }) → Promise<Todo>`；`fetchTodos() → Promise<Todo[]>`

- [ ] **Step 1: 创建 API 模块**

```javascript
// vue/02day-vue/my-project/src/api/todos.js
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/todos'

export function fetchTodos() {
  return axios.get(BASE_URL).then(res => res.data.data)
}

export function createTodo({ name, description }) {
  return axios.post(BASE_URL, { name, description }).then(res => res.data.data)
}
```

- [ ] **Step 2: Commit**

```bash
git add vue/02day-vue/my-project/src/api/todos.js
git commit -m "feat: add todo API client module"
```

---

### Task 3: 前端 Vuex Store (todos 模块)

**Files:**
- Create: `vue/02day-vue/my-project/src/store/modules/todos.js`
- Modify: `vue/02day-vue/my-project/src/store/index.js`

**Interfaces:**
- Consumes: `createTodo`, `fetchTodos`（Task 2）
- Produces: `state.todos: Todo[]`；`actions.createTodo({ name, description })`；`actions.fetchTodos()`

- [ ] **Step 1: 创建 todos Vuex 模块**

```javascript
// vue/02day-vue/my-project/src/store/modules/todos.js
import { fetchTodos, createTodo } from '@/api/todos'

const state = {
  todos: []
}

const mutations = {
  SET_TODOS(state, todos) {
    state.todos = todos
  },
  ADD_TODO(state, todo) {
    state.todos.push(todo)
  }
}

const actions = {
  async fetchTodos({ commit }) {
    const todos = await fetchTodos()
    commit('SET_TODOS', todos)
  },
  async createTodo({ commit }, { name, description }) {
    const todo = await createTodo({ name, description })
    commit('ADD_TODO', todo)
    return todo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

- [ ] **Step 2: 注册模块到 store/index.js**

在 `store/index.js` 中，在 `import Vuex from 'vuex'` 之后添加：

```javascript
import todos from './modules/todos'
```

在 `new Vuex.Store({})` 的顶层添加 `modules` 字段。修改后的完整 store：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import todos from './modules/todos'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    todos
  },
  state: {
    count: 0,
    price: 30
  },
  mutations: {
    'ADD_COUNT' (state) {
      state.count++
    },
    'REDUCE_COUNT' (state) {
      state.count--
    },
    'CHANGE_COUNT' (state, payload) {
      state.count = payload;
    }
  },
  getters: {
    totalPrice(state) {
      return state.count * state.price
    }
  },
  actions: {
    handleAsyncActions(store, payload) {
      setTimeout(() => {
        store.commit('CHANGE_COUNT', payload)
      }, 1000)
    }
  }
})

export default store
```

- [ ] **Step 3: Commit**

```bash
git add vue/02day-vue/my-project/src/store/modules/todos.js vue/02day-vue/my-project/src/store/index.js
git commit -m "feat: add todos Vuex module with createTodo action"
```

---

### Task 4: 前端组件

**Files:**
- Create: `vue/02day-vue/my-project/src/components/TodoForm.vue`
- Create: `vue/02day-vue/my-project/src/components/TodoList.vue`
- Create: `vue/02day-vue/my-project/src/components/TodoView.vue`

**Interfaces:**
- Consumes: Vuex `todos` module actions/getters（Task 3）
- Produces: 可复用的 TodoForm（发射 `submit` 事件）、TodoList（接收 `todos` prop）、TodoView（组装页面 + 调用 Vuex）

- [ ] **Step 1: 创建 TodoForm.vue**

```vue
<!-- vue/02day-vue/my-project/src/components/TodoForm.vue -->
<template>
  <div class="todo-form">
    <h2>新增待办事项</h2>
    <div class="form-group">
      <label>事项名称 <span class="required">*</span></label>
      <input
        type="text"
        v-model="name"
        placeholder="请输入事项名称"
        @keyup.enter="handleSubmit"
      />
    </div>
    <div class="form-group">
      <label>事项描述</label>
      <textarea
        v-model="description"
        placeholder="请输入事项描述（选填）"
        rows="3"
      ></textarea>
    </div>
    <div class="form-actions">
      <button @click="handleSubmit" :disabled="!name.trim()">添加</button>
    </div>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
  </div>
</template>

<script>
export default {
  name: 'TodoForm',
  data() {
    return {
      name: '',
      description: '',
      errorMsg: ''
    }
  },
  methods: {
    handleSubmit() {
      const trimmedName = this.name.trim()
      if (!trimmedName) {
        this.errorMsg = '事项名称不能为空'
        return
      }
      this.errorMsg = ''
      this.$emit('submit', {
        name: trimmedName,
        description: this.description.trim()
      })
      this.name = ''
      this.description = ''
    }
  }
}
</script>

<style scoped>
.todo-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.todo-form h2 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}
.form-group {
  margin-bottom: 14px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}
.required { color: #e74c3c; }
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #409eff;
}
.form-actions button {
  padding: 10px 32px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
.form-actions button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.form-actions button:not(:disabled):hover {
  background: #337ecc;
}
.error-msg {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 8px;
}
</style>
```

- [ ] **Step 2: 创建 TodoList.vue**

```vue
<!-- vue/02day-vue/my-project/src/components/TodoList.vue -->
<template>
  <div class="todo-list">
    <h2>待办事项列表 <span class="count">（共 {{ todos.length }} 项）</span></h2>
    <div v-if="todos.length === 0" class="empty">
      暂无待办事项，请在上方添加。
    </div>
    <ul v-else>
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <div class="todo-name">{{ todo.name }}</div>
        <div v-if="todo.description" class="todo-desc">{{ todo.description }}</div>
        <div class="todo-time">{{ formatTime(todo.createdAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  props: {
    todos: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatTime(isoStr) {
      if (!isoStr) return ''
      const d = new Date(isoStr)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
  }
}
</script>

<style scoped>
.todo-list {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.todo-list h2 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}
.count {
  font-size: 14px;
  color: #999;
  font-weight: normal;
}
.empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.todo-item {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.todo-item:last-child {
  border-bottom: none;
}
.todo-name {
  font-size: 15px;
  color: #333;
  font-weight: 600;
  margin-bottom: 4px;
}
.todo-desc {
  font-size: 13px;
  color: #777;
  margin-bottom: 6px;
  line-height: 1.5;
}
.todo-time {
  font-size: 12px;
  color: #bbb;
}
</style>
```

- [ ] **Step 3: 创建 TodoView.vue（页面容器）**

```vue
<!-- vue/02day-vue/my-project/src/components/TodoView.vue -->
<template>
  <div class="todo-view">
    <TodoForm @submit="handleCreate" />
    <TodoList :todos="todos" />
    <p v-if="loading" class="loading-msg">加载中...</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TodoForm from './TodoForm.vue'
import TodoList from './TodoList.vue'

export default {
  name: 'TodoView',
  components: { TodoForm, TodoList },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('todos', ['todos'])
  },
  methods: {
    ...mapActions('todos', ['fetchTodos', 'createTodo']),
    async handleCreate({ name, description }) {
      try {
        this.loading = true
        await this.createTodo({ name, description })
      } catch (e) {
        alert('创建失败：' + (e.response?.data?.message || e.message))
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchTodos().catch(() => {
      // 后端未启动时静默降级
    })
  }
}
</script>

<style scoped>
.todo-view {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
}
.loading-msg {
  text-align: center;
  color: #999;
  padding: 16px;
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add vue/02day-vue/my-project/src/components/TodoForm.vue \
        vue/02day-vue/my-project/src/components/TodoList.vue \
        vue/02day-vue/my-project/src/components/TodoView.vue
git commit -m "feat: add TodoForm, TodoList, TodoView components"
```

---

### Task 5: 路由注册与集成

**Files:**
- Modify: `vue/02day-vue/my-project/src/router/index.js:10-76`

**Interfaces:**
- Consumes: `TodoView` 组件（Task 4）
- Produces: `/todos` 路由

- [ ] **Step 1: 添加 /todos 路由**

在 `routes` 数组末尾（`}` 和 `]` 之间）添加 Todo 路由：

```javascript
// 在 shop 路由之后添加：
{
  path: '/todos',
  name: 'todos',
  component: () => import('../components/TodoView'),
  meta: {
    title: '待办事项'
  }
}
```

修改后 `routes` 数组片段：

```javascript
routes: [
  {
    path: '/nesting',
    component: () => import('../views/index'),
    redirect: '/nesting/home',
    children: [
      // ... 现有子路由 ...
      {
        path: 'shop',
        name: 'shop',
        component: () => import('../components/shop'),
        meta: {
          title: '购物'
        }
      },
    ]
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('../components/TodoView'),
    meta: {
      title: '待办事项'
    }
  }
]
```

- [ ] **Step 2: 启动后端并验证前端路由**

```bash
# 终端 1: 启动后端
cd vue/03day-vue/server && npm start

# 终端 2: 启动前端
cd vue/02day-vue/my-project && npm run dev
```

打开浏览器访问 `http://localhost:8080/todos`，验证：
- 页面显示「新增待办事项」表单
- 输入名称「测试事项」+ 描述「测试描述」，点击「添加」
- 列表中出现新条目
- 刷新页面后数据依然存在（后端内存保持）

- [ ] **Step 3: Commit**

```bash
git add vue/02day-vue/my-project/src/router/index.js
git commit -m "feat: register /todos route"
```

---

## 自检 (Self-Review)

### 1. Spec 覆盖
- ✅ 帮助用户记录日常待办事项 → TodoForm + TodoList + REST API
- ✅ 核心功能：新增待办事项 → POST /todos + createTodo action
- ✅ 任务信息：事项名称 + 描述 → `{ name, description }` 数据结构
- ✅ 目标用户：内部用户 → 无鉴权、内存存储
- ✅ 最小闭环：仅创建 → 不含编辑/删除/标记完成

### 2. 占位符扫描
- ✅ 无 TBD / TODO / 待实现
- ✅ 无「添加适当的错误处理」等模糊语句
- ✅ 所有代码步骤均含完整实现代码
- ✅ 无跨 Task 的类型/方法名不一致

### 3. 类型一致性
- ✅ Todo 数据结构在 Task 1 定义，Task 2-4 一致使用
- ✅ `createTodo({ name, description })` 签名从 API → Store → Component 一致
- ✅ `fetchTodos()` → `GET /todos` 返回 `data: Todo[]`
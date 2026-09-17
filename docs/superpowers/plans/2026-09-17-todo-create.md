# Todo Create Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimum closed-loop todo feature that lets internal users create daily todo items (name + description) and see them listed.

**Architecture:** A Vue 2 (webpack) single-page frontend talks to an Express backend over REST. The frontend uses Vuex (namespaced `todos` module) for state, an axios-based API layer for HTTP, and vue-router for the `/todos` route. The backend stores todos in memory (an array) and exposes `GET /todos` and `POST /todos`. Creation is the core loop; listing exists only so the user can confirm what they recorded.

**Tech Stack:** Node.js (Express ~4.16, EJS views), Vue 2.5, Vuex 3, vue-router 3, axios 0.18, webpack 3 dev-server (frontend on :8080, backend on :3000). Testing: jest + supertest (backend), jest + @vue/test-utils + jest-serializer-vue (frontend).

## Global Constraints

- Backend lives under `vue/03day-vue/server/` and listens on port `3000` (set in `bin/www` via `process.env.PORT || '3000'`).
- Frontend lives under `vue/02day-vue/my-project/` and its webpack dev-server runs on port `8080`.
- The frontend API layer hardcodes `BASE_URL = 'http://localhost:3000/todos'` (matches backend port).
- Vuex modules are `namespaced: true` and are registered in `vue/02day-vue/my-project/src/store/index.js`.
- Routes are registered in `vue/02day-vue/my-project/src/router/index.js` with a `meta.title` and the global `beforeEach` sets `document.title`.
- The backend already enables `app.use(express.json())` and `app.use(express.urlencoded({ extended: false }))` in `app.js`, so `req.body` is parsed for JSON and form bodies.
- The backend `index.js` route already wires CORS for origin `http://localhost:8080`; the todos router itself does not need CORS handling.
- Response envelope on the backend: success returns `{ code: <number>, data: <todo|array> }`; validation error returns `{ code: 400, message: string }` with HTTP 400.
- A todo object shape is exactly: `{ id: number, name: string, description: string, createdAt: string (ISO) }`.
- Follow the existing CommonJS style in the backend (`var`, `require`) and ES module style in the frontend (`import`/`export`).

---

### Task 1: Backend — install test dependencies and add a test script

**Files:**
- Modify: `vue/03day-vue/server/package.json`

**Interfaces:**
- Consumes: nothing
- Produces: a `test` npm script and the `jest` + `supertest` dev dependencies that all subsequent backend test steps rely on.

- [ ] **Step 1: Install jest and supertest as dev dependencies**

Run from `vue/03day-vue/server/`:

```bash
cd vue/03day-vue/server && npm install --save-dev jest supertest
```

Expected: `jest` and `supertest` appear under `devDependencies` in `package.json`, and `node_modules/jest` exists.

- [ ] **Step 2: Add a test script to package.json**

Edit `vue/03day-vue/server/package.json` so the `scripts` block contains a `test` entry:

```json
{
  "name": "server",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "dev": "node-dev ./bin/www",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.9",
    "ejs": "~2.5.7",
    "express": "~4.16.0",
    "http-errors": "~1.6.2",
    "jsonp": "^0.2.1",
    "morgan": "~1.9.0",
    "node-dev": "^3.1.3"
  },
  "devDependencies": {
    "cors": "^2.8.4",
    "http-proxy-middleware": "^0.19.0",
    "jest": "^29.0.0",
    "supertest": "^6.0.0"
  }
}
```

- [ ] **Step 3: Verify jest is wired**

Run:

```bash
cd vue/03day-vue/server && npx jest --version
```

Expected: prints a jest version (e.g. `29.x.x`), no error.

- [ ] **Step 4: Commit**

```bash
git add vue/03day-vue/server/package.json vue/03day-vue/server/package-lock.json
git commit -m "chore(server): add jest and supertest dev dependencies"
```

---

### Task 2: Backend — POST /todos creates a todo (TDD)

**Files:**
- Create: `vue/03day-vue/server/routes/todos.js`
- Create: `vue/03day-vue/server/__tests__/todos.test.js`
- Modify: `vue/03day-vue/server/app.js` (register the router)

**Interfaces:**
- Consumes: the Express app from `app.js`.
- Produces: `POST /todos` accepting `{ name: string, description: string }`, returning HTTP 201 with `{ code: 201, data: { id, name, description, createdAt } }`. Also produces `GET /todos` returning `{ code: 200, data: [...] }` so tests can assert state. The router is exported as `module.exports = router` and is mounted at `/todos`.

- [ ] **Step 1: Write the failing test**

Create `vue/03day-vue/server/__tests__/todos.test.js`:

```javascript
var request = require('supertest');
var app = require('../app');

describe('POST /todos', function () {
  it('creates a todo and returns 201 with the created item', function (done) {
    request(app)
      .post('/todos')
      .send({ name: '写文档', description: '完成待办事项的说明文档' })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(function (res) {
        if (res.body.code !== 201) throw new Error('code should be 201');
        if (!res.body.data.id) throw new Error('data.id missing');
        if (res.body.data.name !== '写文档') throw new Error('name mismatch');
        if (res.body.data.description !== '完成待办事项的说明文档') throw new Error('description mismatch');
        if (!res.body.data.createdAt) throw new Error('createdAt missing');
      })
      .end(done);
  });

  it('returns 400 when name is empty', function (done) {
    request(app)
      .post('/todos')
      .send({ name: '   ', description: '' })
      .set('Accept', 'application/json')
      .expect(400)
      .expect(function (res) {
        if (res.body.code !== 400) throw new Error('code should be 400');
        if (!res.body.message) throw new Error('message missing');
      })
      .end(done);
  });
});

describe('GET /todos', function () {
  it('returns all created todos', function (done) {
    request(app)
      .post('/todos')
      .send({ name: '买菜', description: '' })
      .set('Accept', 'application/json')
      .expect(201)
      .end(function () {
        request(app)
          .get('/todos')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(function (res) {
            if (res.body.code !== 200) throw new Error('code should be 200');
            if (!Array.isArray(res.body.data)) throw new Error('data should be an array');
            if (res.body.data.length === 0) throw new Error('data should not be empty');
          })
          .end(done);
      });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd vue/03day-vue/server && npx jest __tests__/todos.test.js
```

Expected: FAIL — `Cannot find module '../routes/todos'` (router not created yet) or 404 from Express because the route is not registered.

- [ ] **Step 3: Write the router implementation**

Create `vue/03day-vue/server/routes/todos.js`:

```javascript
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

- [ ] **Step 4: Register the router in app.js**

Modify `vue/03day-vue/server/app.js`. After the `var usersRouter = require('./routes/users');` line (line 8), add the require for the todos router, and after `app.use('/users', usersRouter);` add the mount. The updated file:

```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing the error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
```

(Note: this file currently has `app.listen(3005)` at the end in `vue/02day-vue/server/app.js`, but the `vue/03day-vue/server/app.js` already matches the form above — it only does `module.exports = app;` and the actual listen happens in `bin/www` on port 3000. Do NOT add `app.listen` to this file.)

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
cd vue/03day-vue/server && npx jest __tests__/todos.test.js
```

Expected: PASS — all 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add vue/03day-vue/server/routes/todos.js vue/03day-vue/server/__tests__/todos.test.js vue/03day-vue/server/app.js
git commit -m "feat(server): add POST/GET /todos endpoints with tests"
```

---

### Task 3: Frontend — install test dependencies and add a test script

**Files:**
- Modify: `vue/02day-vue/my-project/package.json`

**Interfaces:**
- Consumes: nothing
- Produces: `jest`, `@vue/test-utils`, `vue-template-compiler` (already present), `jest-serializer-vue`, `babel-jest`, and a `test` script plus a `jest` config block that all frontend test steps rely on.

- [ ] **Step 1: Install frontend test dev dependencies**

Run from `vue/02day-vue/my-project/`:

```bash
cd vue/02day-vue/my-project && npm install --save-dev jest @vue/test-utils@1 vue-template-compiler@2.5.2 jest-serializer-vue babel-jest@27 babel-core@6
```

Expected: packages appear under `devDependencies` in `package.json`.

- [ ] **Step 2: Add test script and jest config to package.json**

Modify the `scripts` and top-level keys of `vue/02day-vue/my-project/package.json`. Add `"test": "jest --runInBand"` to scripts and a `"jest"` config block. The final `package.json` top portion:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "",
  "private": true,
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node build/build.js",
    "test": "jest --runInBand"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "vue"],
    "transform": {
      "^.+\\.js$": "babel-jest",
      ".*\\.(vue)$": "vue-jest"
    },
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "snapshotSerializers": ["jest-serializer-vue"],
    "testMatch": ["<rootDir>/src/**/__tests__/**/*.spec.js"]
  },
  "dependencies": {
    "axios": "^0.18.0",
    "nprogress": "^0.2.0",
    "vue": "^2.5.2",
    "vue-router": "^3.0.1",
    "vuex": "^3.0.1"
  },
  "devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-core": "^6.22.1",
    "babel-jest": "^27.0.0",
    "babel-loader": "^7.1.1",
    "jest": "^27.0.0",
    "jest-serializer-vue": "^2.0.1",
    "vue-jest": "^3.0.0",
    "vue-template-compiler": "^2.5.2"
  }
}
```

(Keep all other existing devDependencies — babel-plugin-*, css-loader, webpack, etc. — unchanged. Only the `scripts.test`, `jest`, and the four new `devDependencies` entries are additions.)

- [ ] **Step 3: Ensure babel preset is available for jest**

The project already has `.babelrc`. Confirm it contains `preset-env` and `preset-stage-2`. Read `vue/02day-vue/my-project/.babelrc`. It should already be:

```json
{
  "presets": [
    ["env", { "modules": false }],
    "stage-2"
  ],
  "plugins": ["transform-runtime"],
  "env": {
    "test": {
      "presets": [
        ["env", { "targets": { "node": "current" } }],
        "stage-2"
      ]
    }
  }
}
```

If the `env.test` block is missing, add it so jest transpiles with CommonJS modules for Node. If it already exists, do not change it.

- [ ] **Step 4: Verify jest is wired**

Run:

```bash
cd vue/02day-vue/my-project && npx jest --version
```

Expected: prints a jest version, no error.

- [ ] **Step 5: Commit**

```bash
git add vue/02day-vue/my-project/package.json vue/02day-vue/my-project/package-lock.json vue/02day-vue/my-project/.babelrc
git commit -m "chore(frontend): add jest and @vue/test-utils dev dependencies"
```

---

### Task 4: Frontend — API layer (TDD)

**Files:**
- Create: `vue/02day-vue/my-project/src/api/todos.js`
- Create: `vue/02day-vue/my-project/src/api/__tests__/todos.spec.js`

**Interfaces:**
- Consumes: `axios`.
- Produces: `fetchTodos()` → `Promise<Todo[]>` and `createTodo({ name, description })` → `Promise<Todo>`, where `Todo = { id, name, description, createdAt }`. Both read `res.data.data` from the backend envelope. `BASE_URL = 'http://localhost:3000/todos'`.

- [ ] **Step 1: Write the failing test**

Create `vue/02day-vue/my-project/src/api/__tests__/todos.spec.js`:

```javascript
import jest from 'jest'
import { fetchTodos, createTodo } from '../todos'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { data: [{ id: 1, name: 'a', description: 'b', createdAt: '2026-09-17T00:00:00.000Z' }] } })),
  post: jest.fn(() => Promise.resolve({ data: { data: { id: 2, name: 'x', description: 'y', createdAt: '2026-09-17T00:00:00.000Z' } } }))
}))

describe('api/todos', () => {
  it('fetchTodos returns the data array', async () => {
    const result = await fetchTodos()
    expect(result).toEqual([{ id: 1, name: 'a', description: 'b', createdAt: '2026-09-17T00:00:00.000Z' }])
  })

  it('createTodo posts name and description and returns the created todo', async () => {
    const result = await createTodo({ name: 'x', description: 'y' })
    expect(result).toEqual({ id: 2, name: 'x', description: 'y', createdAt: '2026-09-17T00:00:00.000Z' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/api/__tests__/todos.spec.js
```

Expected: FAIL — `Cannot find module '../todos'` (module does not exist yet).

- [ ] **Step 3: Write the API layer**

Create `vue/02day-vue/my-project/src/api/todos.js`:

```javascript
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/todos'

export function fetchTodos() {
  return axios.get(BASE_URL).then(res => res.data.data)
}

export function createTodo({ name, description }) {
  return axios.post(BASE_URL, { name, description }).then(res => res.data.data)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/api/__tests__/todos.spec.js
```

Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add vue/02day-vue/my-project/src/api/todos.js vue/02day-vue/my-project/src/api/__tests__/todos.spec.js
git commit -m "feat(frontend): add todos API layer with tests"
```

---

### Task 5: Frontend — Vuex store module (TDD)

**Files:**
- Create: `vue/02day-vue/my-project/src/store/modules/todos.js`
- Modify: `vue/02day-vue/my-project/src/store/index.js` (register the module)
- Create: `vue/02day-vue/my-project/src/store/modules/__tests__/todos.spec.js`

**Interfaces:**
- Consumes: `fetchTodos` and `createTodo` from `@/api/todos`.
- Produces: a namespaced Vuex module `todos` with: `state.todos: Todo[]`; mutations `SET_TODOS(state, todos)` and `ADD_TODO(state, todo)`; actions `fetchTodos({ commit })` and `createTodo({ commit }, { name, description })` (returns the created todo). Registered in `store/index.js` under the `todos` key.

- [ ] **Step 1: Write the failing test**

Create `vue/02day-vue/my-project/src/store/modules/__tests__/todos.spec.js`:

```javascript
import todos from '../todos'

describe('store/modules/todos', () => {
  it('is namespaced', () => {
    expect(todos.namespaced).toBe(true)
  })

  it('SET_TODOS replaces state.todos', () => {
    const state = { todos: [] }
    todos.mutations.SET_TODOS(state, [{ id: 1, name: 'a', description: '', createdAt: 't' }])
    expect(state.todos).toEqual([{ id: 1, name: 'a', description: '', createdAt: 't' }])
  })

  it('ADD_TODO appends to state.todos', () => {
    const state = { todos: [{ id: 1, name: 'a', description: '', createdAt: 't' }] }
    todos.mutations.ADD_TODO(state, { id: 2, name: 'b', description: '', createdAt: 't2' })
    expect(state.todos).toHaveLength(2)
    expect(state.todos[1]).toEqual({ id: 2, name: 'b', description: '', createdAt: 't2' })
  })

  it('fetchTodos action commits SET_TODOS', async () => {
    const commit = jest.fn()
    const mockTodos = [{ id: 1, name: 'a', description: '', createdAt: 't' }]
    jest.mock('@/api/todos', () => ({
      fetchTodos: jest.fn(() => Promise.resolve(mockTodos)),
      createTodo: jest.fn()
    }))
    // Because of hoisting, re-require the module after mock
    jest.resetModules()
    jest.doMock('@/api/todos', () => ({
      fetchTodos: jest.fn(() => Promise.resolve(mockTodos)),
      createTodo: jest.fn()
    }))
    const todosMod = require('../todos').default
    await todosMod.actions.fetchTodos({ commit })
    expect(commit).toHaveBeenCalledWith('SET_TODOS', mockTodos)
  })

  it('createTodo action commits ADD_TODO and returns the todo', async () => {
    const commit = jest.fn()
    const created = { id: 5, name: 'x', description: 'y', createdAt: 't' }
    jest.resetModules()
    jest.doMock('@/api/todos', () => ({
      fetchTodos: jest.fn(),
      createTodo: jest.fn(() => Promise.resolve(created))
    }))
    const todosMod = require('../todos').default
    const result = await todosMod.actions.createTodo({ commit }, { name: 'x', description: 'y' })
    expect(commit).toHaveBeenCalledWith('ADD_TODO', created)
    expect(result).toEqual(created)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/store/modules/__tests__/todos.spec.js
```

Expected: FAIL — `Cannot find module '../todos'` (module does not exist yet).

- [ ] **Step 3: Write the store module**

Create `vue/02day-vue/my-project/src/store/modules/todos.js`:

```javascript
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

- [ ] **Step 4: Register the module in the store**

Modify `vue/02day-vue/my-project/src/store/index.js`. Add the import and register under `modules`. The updated file:

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
    handleAsyncActions(store,payload) {
      setTimeout(() => {
        store.commit('CHANGE_COUNT',payload)
      },1000)
    }
  }
})

export default store
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/store/modules/__tests__/todos.spec.js
```

Expected: PASS — all tests green.

- [ ] **Step 6: Commit**

```bash
git add vue/02day-vue/my-project/src/store/modules/todos.js vue/02day-vue/my-project/src/store/modules/__tests__/todos.spec.js vue/02day-vue/my-project/src/store/index.js
git commit -m "feat(frontend): add todos vuex module with tests"
```

---

### Task 6: Frontend — TodoForm component (TDD)

**Files:**
- Create: `vue/02day-vue/my-project/src/components/TodoForm.vue`
- Create: `vue/02day-vue/my-project/src/components/__tests__/TodoForm.spec.js`

**Interfaces:**
- Consumes: nothing (presentational component).
- Produces: a `TodoForm` component with `data() { return { name, description, errorMsg } }` that emits `submit` with `{ name, description }` (both trimmed) when the add button is clicked or Enter is pressed in the name input, then clears the fields. The button is disabled when `name.trim()` is falsy. Validates that name is non-empty and sets `errorMsg` otherwise.

- [ ] **Step 1: Write the failing test**

Create `vue/02day-vue/my-project/src/components/__tests__/TodoForm.spec.js`:

```javascript
import { shallowMount } from '@vue/test-utils'
import TodoForm from '../TodoForm.vue'

describe('TodoForm.vue', () => {
  it('emits submit with trimmed name and description on button click', () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '  写周报  ', description: '  周五前提交  ' })
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({ name: '写周报', description: '周五前提交' })
  })

  it('clears name and description after submit', () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '写周报', description: '周五前提交' })
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.name).toBe('')
    expect(wrapper.vm.description).toBe('')
  })

  it('does not emit submit and shows error when name is empty', () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '   ', description: '' })
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted().submit).toBeFalsy()
    expect(wrapper.vm.errorMsg).toBe('事项名称不能为空')
  })

  it('disables the button when name is empty', () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '' })
    expect(wrapper.find('button').attributes().disabled).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/components/__tests__/TodoForm.spec.js
```

Expected: FAIL — `Cannot find module '../TodoForm.vue'` or a resolve error (component does not exist yet).

- [ ] **Step 3: Write the component**

Create `vue/02day-vue/my-project/src/components/TodoForm.vue`:

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

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/components/__tests__/TodoForm.spec.js
```

Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add vue/02day-vue/my-project/src/components/TodoForm.vue vue/02day-vue/my-project/src/components/__tests__/TodoForm.spec.js
git commit -m "feat(frontend): add TodoForm component with tests"
```

---

### Task 7: Frontend — TodoList component (TDD)

**Files:**
- Create: `vue/02day-vue/my-project/src/components/TodoList.vue`
- Create: `vue/02day-vue/my-project/src/components/__tests__/TodoList.spec.js`

**Interfaces:**
- Consumes: a `todos: Array` prop.
- Produces: a `TodoList` component that renders one `.todo-item` per todo (keyed by `todo.id`), shows `todo.name`, shows `todo.description` only when present, shows a formatted `todo.createdAt`, and shows an empty-state message when the array is empty. Exposes `formatTime(isoStr)` returning `YYYY-MM-DD HH:mm`.

- [ ] **Step 1: Write the failing test**

Create `vue/02day-vue/my-project/src/components/__tests__/TodoList.spec.js`:

```javascript
import { shallowMount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'

describe('TodoList.vue', () => {
  it('renders one item per todo keyed by id', () => {
    const todos = [
      { id: 1, name: '吃饭', description: '', createdAt: '2026-09-17T10:00:00.000Z' },
      { id: 2, name: '睡觉', description: '早点睡', createdAt: '2026-09-17T23:00:00.000Z' }
    ]
    const wrapper = shallowMount(TodoList, { propsData: { todos } })
    expect(wrapper.findAll('.todo-item')).toHaveLength(2)
  })

  it('shows empty state when todos is empty', () => {
    const wrapper = shallowMount(TodoList, { propsData: { todos: [] } })
    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('hides description when not provided', () => {
    const todos = [{ id: 1, name: '吃饭', description: '', createdAt: '2026-09-17T10:00:00.000Z' }]
    const wrapper = shallowMount(TodoList, { propsData: { todos } })
    expect(wrapper.find('.todo-desc').exists()).toBe(false)
  })

  it('formatTime returns YYYY-MM-DD HH:mm', () => {
    const wrapper = shallowMount(TodoList, { propsData: { todos: [] } })
    const result = wrapper.vm.formatTime('2026-09-17T10:05:00.000Z')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/components/__tests__/TodoList.spec.js
```

Expected: FAIL — `Cannot find module '../TodoList.vue'` (component does not exist yet).

- [ ] **Step 3: Write the component**

Create `vue/02day-vue/my-project/src/components/TodoList.vue`:

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

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/components/__tests__/TodoList.spec.js
```

Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add vue/02day-vue/my-project/src/components/TodoList.vue vue/02day-vue/my-project/src/components/__tests__/TodoList.spec.js
git commit -m "feat(frontend): add TodoList component with tests"
```

---

### Task 8: Frontend — TodoView container and route (TDD)

**Files:**
- Create: `vue/02day-vue/my-project/src/components/TodoView.vue`
- Create: `vue/02day-vue/my-project/src/components/__tests__/TodoView.spec.js`
- Modify: `vue/02day-vue/my-project/src/router/index.js` (add `/todos` route)

**Interfaces:**
- Consumes: `TodoForm` (emits `submit` with `{ name, description }`), `TodoList` (takes `todos` prop), and the `todos` Vuex module (`mapState('todos', ['todos'])`, `mapActions('todos', ['fetchTodos', 'createTodo'])`).
- Produces: a `TodoView` container that renders `<TodoForm @submit="handleCreate" />` and `<TodoList :todos="todos" />`, calls `fetchTodos` on `mounted()` (silently catches failure), and `handleCreate` dispatches `createTodo` with loading state and alerts on error. The route `/todos` (name `todos`, `meta.title: '待办事项'`) renders this component.

- [ ] **Step 1: Write the failing test**

Create `vue/02day-vue/my-project/src/components/__tests__/TodoView.spec.js`:

```javascript
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoView from '../TodoView.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore(todos) {
  return new Vuex.Store({
    modules: {
      todos: {
        namespaced: true,
        state: { todos },
        actions: {
          fetchTodos: jest.fn(() => Promise.resolve()),
          createTodo: jest.fn(() => Promise.resolve())
        }
      }
    }
  })
}

describe('TodoView.vue', () => {
  it('renders TodoForm and TodoList', () => {
    const store = createStore([])
    const wrapper = shallowMount(TodoView, { store, localVue })
    expect(wrapper.find({ name: 'TodoForm' }).exists()).toBe(true)
    expect(wrapper.find({ name: 'TodoList' }).exists()).toBe(true)
  })

  it('dispatches createTodo on form submit', async () => {
    const store = createStore([])
    const wrapper = shallowMount(TodoView, { store, localVue })
    await wrapper.vm.handleCreate({ name: '写周报', description: '周五前' })
    expect(store.dispatch).toHaveBeenCalledWith('todos/createTodo', { name: '写周报', description: '周五前' })
  })

  it('calls fetchTodos on mounted', () => {
    const store = createStore([])
    shallowMount(TodoView, { store, localVue })
    expect(store.dispatch).toHaveBeenCalledWith('todos/fetchTodos')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/components/__tests__/TodoView.spec.js
```

Expected: FAIL — `Cannot find module '../TodoView.vue'` (component does not exist yet).

- [ ] **Step 3: Write the component**

Create `vue/02day-vue/my-project/src/components/TodoView.vue`:

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

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd vue/02day-vue/my-project && npx jest src/components/__tests__/TodoView.spec.js
```

Expected: PASS — all 3 tests green.

- [ ] **Step 5: Add the /todos route**

Modify `vue/02day-vue/my-project/src/router/index.js`. Add a `/todos` route to the `routes` array. The route entry to add (after the `/nesting` route object's closing brace and before the closing `]` of `routes`):

```javascript
  {
    path: '/todos',
    name: 'todos',
    component: () => import('../components/TodoView'),
    meta: {
      title: '待办事项'
    }
  }
```

The full updated `routes` array should end like:

```javascript
  routes: [
    {
      path: '/nesting',
      component: () => import('../views/index'),
      redirect:'/nesting/home',
      children: [
        {
          path: 'home',
          name: 'home1',
          component: () => import('../components/home'),
          meta: {
            title: '首页'
          }
        },
        {
          path: 'about/:id',
          name: 'about1',
          component: () => import('../components/about'),
          meta: {
            title: '详情'
          }
        },
        {
          path: 'login',
          name: 'login1',
          component: () => import('../components/login'),
          meta: {
            title: '登录'
          }
        },
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

Leave the `beforeEach` and `afterEach` guards unchanged.

- [ ] **Step 6: Run the full frontend test suite**

Run:

```bash
cd vue/02day-vue/my-project && npx jest --runInBand
```

Expected: PASS — all frontend tests (api, store, TodoForm, TodoList, TodoView) green.

- [ ] **Step 7: Commit**

```bash
git add vue/02day-vue/my-project/src/components/TodoView.vue vue/02day-vue/my-project/src/components/__tests__/TodoView.spec.js vue/02day-vue/my-project/src/router/index.js
git commit -m "feat(frontend): add TodoView container and /todos route with tests"
```

---

### Task 9: End-to-end smoke — verify the create loop

**Files:**
- No new files. This is a manual smoke step.

**Interfaces:**
- Consumes: the backend (Task 2) and frontend (Tasks 4-8).
- Produces: confirmation that the minimum closed loop (create) works across the stack.

- [ ] **Step 1: Start the backend**

Run in one terminal:

```bash
cd vue/03day-vue/server && npm start
```

Expected: the server starts and listens on port 3000 (debug log `Listening on port 3000`).

- [ ] **Step 2: Smoke-test the backend with curl**

Run in another terminal:

```bash
curl -s -X POST http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"name":"写周报","description":"周五前提交"}'
```

Expected: HTTP 201 with a JSON body like:

```json
{"code":201,"data":{"id":1,"name":"写周报","description":"周五前提交","createdAt":"2026-09-17T...Z"}}
```

Then verify listing:

```bash
curl -s http://localhost:3000/todos
```

Expected: HTTP 200 with `{"code":200,"data":[{"id":1,"name":"写周报","description":"周五前提交","createdAt":"..."}]}`.

- [ ] **Step 3: Start the frontend dev server**

Run:

```bash
cd vue/02day-vue/my-project && npm run dev
```

Expected: webpack dev-server starts on port 8080.

- [ ] **Step 4: Verify the create loop in the browser**

Open `http://localhost:8080/todos`. Enter a name and description, click "添加". Expected: the new item appears in the list below with name, description, and a formatted timestamp.

- [ ] **Step 5: Run the full test suites one final time**

Run both:

```bash
cd vue/03day-vue/server && npx jest --runInBand
cd vue/02day-vue/my-project && npx jest --runInBand
```

Expected: all backend and frontend tests green.

- [ ] **Step 6: Commit (if any test/config drift was fixed during smoke)**

If no files changed during smoke, skip. Otherwise:

```bash
git add -A
git commit -m "chore: fix smoke-test drift"
```

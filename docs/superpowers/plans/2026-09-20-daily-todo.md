# Daily Todo 实施计划 — 新增待办事项（最小闭环）

- 日期：2026-09-20
- 生成技能：/writing-plans
- 设计依据：`docs/superpowers/specs/2026-09-20-daily-todo-design.md`（需求澄清产物）
- 运行模式：全自动流水线，执行节点自主推进，**无人工确认点**

## 0. 执行须知（全局约束，硬性）

**推荐执行方式**：superpowers:subagent-driven-development 或 executing-plans（流水线自动选择，无需询问用户）。

- **Git 只读**：本流水线禁用一切 Git 写操作（commit/push/merge/reset/checkout 等）。因此本计划**不含任何 Commit 步骤**，每个任务以「验证」收尾；执行节点同样不得执行 git 写命令。
- **路径**：所有改动与产物均相对仓库根目录，禁止写到仓库外。
- **验证预算**：单任务验证 ≤ 5 分钟；Task 0 环境准备与 Task 5 依赖安装单独计时（各 ≤ 10 分钟）。触发任一降级条件（同模块失败 ≥ 2 次 / 报错文件不在本次变更范围 / 单次构建 > 120s 且失败 / 全量构建已执行 1 次）→ 立即停止构建，切换静态审查，并在执行总结开头标注 `[降级说明]`。
- **禁止阻塞**：不输出「请确认 / 是否继续 / 等待指示」类话术，不使用交互式提问。
- **工具黑名单**：不使用 grep / glob（用 rg / read 替代）。

## 1. Goal / 架构 / 技术栈

**Goal**：内部用户可记录日常待办事项 —— 最小闭环「新增待办事项」（事项名称必填 + 描述选填），创建后可**只读**查看列表。明确不做：持久化、编辑、删除、完成标记、分页/搜索、用户体系。

**架构（沿用设计文档，无架构调整）**：

- 前端：Vue 2.5 SPA（`vue/02day-vue/my-project`），Vuex 3 集中状态，axios 0.18；路由 `/todos` → TodoView（容器）→ TodoForm（创建表单）+ TodoList（只读列表）
- 后端：Express 4.16（`vue/03day-vue/server`，端口 3000），内存数组存储，`GET/POST /todos`

**数据契约（验收基准，来自设计文档 §3）**：

- Todo 项：`{ id: number, name: string, description: string, createdAt: ISO 字符串 }`
- `GET /todos` → `{ code: 200, data: Todo[] }`
- `POST /todos` `{ name, description }` → 201 `{ code: 201, data: Todo }`；`name` 为空（trim 后判定）→ 400 `{ code: 400, message: "待办事项名称不能为空" }`；`description` 可空

## 2. 现状复核（2026-09-20 plan 阶段实测）

> 设计文档 §7 曾结论「均与契约一致，无需改动」。plan 阶段逐文件复核**推翻该结论**：实现文件齐全、数据契约一致，但存在 **3 处阻断缺陷**（均有实测证据）。以仓库实测为准。

| # | 缺陷 | 位置 | 证据 | 影响 |
|---|------|------|------|------|
| D1 | 路由文件语法错误：第 76 行多余 `}`；且第 85 行 `])` 缺少 Router 配置对象的 `}`（第 8 行 `new Router({` 未闭合） | `vue/02day-vue/my-project/src/router/index.js:76,85` | 括号深度分析：`line 76: '}' mismatches '[' opened at line 10`；模拟修复后 `BALANCED` | 前端完全无法构建/启动 |
| D2 | 可选链 `?.` 不被 babel 6 工具链支持（babel-core 6 + preset-env 1 + stage-2，见 `.babelrc`） | `vue/02day-vue/my-project/src/components/TodoView.vue:33` | `rg '\?\?|\?\.' src` 全量扫描仅此 1 处 | 编译该组件即 parse error |
| D3 | 后端未挂载 cors 中间件（设计文档称「已配置 cors」，实测 `app.js` 无任何 cors 调用；`cors@2.8.4` 已安装但未使用） | `vue/03day-vue/server/app.js` | 通读全文无 cors；`server/node_modules/cors/package.json` 存在 | 前端 8080 跨源直连 3000，POST JSON 预检必失败，创建链路不可用 |

**环境现状**：node/npm 未安装（已检查 `/usr/bin`、`/usr/local/bin`、`/opt/node`、`~/.nvm` 均不存在）；Ubuntu 24.04，具备 apt-get；`server/node_modules` 依赖齐备（含 cors）；`my-project` 无 node_modules；dev-server 已启用 historyApiFallback（`build/webpack.dev.conf.js:26-30`），`/todos` 可直接访问。

**结论**：本计划 = **3 处最小修复 + 分层验收**。不重构、不扩 scope、不改数据契约。

## 3. Tasks

### Task 0：环境准备（node / npm / curl）

**Files**：无仓库文件改动（仅系统环境）

**Interfaces**：无

**Steps**：

- [ ] 1. 预检：`command -v node; command -v npm; command -v curl` → 三者齐备则跳过本任务
- [ ] 2. 安装：`apt-get update && apt-get install -y nodejs npm curl`（每次调用限时 600s；总限时 10 分钟）
- [ ] 3. 验证：`node --version && npm --version` → 期望 node v18.x（Ubuntu 24.04 软件源）、npm 9.x；版本号记入执行总结
- [ ] 4. **降级条款**：安装失败且无法恢复 → Task 1 验证、Task 4、Task 5 全部降级为静态审查，执行总结标注 `[降级说明]` 并列出未完成清单

### Task 1：修复 D1 —— router/index.js 语法错误（构建阻断）

**Files**：`vue/02day-vue/my-project/src/router/index.js`

**Interfaces**：无接口变化。仅恢复 `routes: [ { /nesting… }, { /todos… } ]` 与 `new Router({ … })` 的合法闭合结构。

**Steps**：

- [ ] 1. 修复前留证（需 node，依赖 Task 0；不可用则直接进入第 2 步）：

```sh
cp vue/02day-vue/my-project/src/router/index.js /tmp/router_check.mjs && node --check /tmp/router_check.mjs
```

期望：SyntaxError（佐证缺陷存在）。注意：命令刻意用 `.mjs` 后缀令 node 按 ESM 解析——`import/export` 合法，第 76 行的真实括号错误才能浮出；若复制为 `.js`（按 CJS 解析），第 1 行 `import` 会先报错并掩盖真实缺陷，属预期外路径

- [ ] 2. **编辑 1**：删除第 75 行孤立 `    }`（保留第 76 行 `  },` 作为 `/nesting` 路由的合法闭合，含逗号）

before（第 74–77 行）：

```
      ]
    }
  },
  {
```

after：

```
      ]
  },
  {
```

- [ ] 3. **编辑 2**：第 85 行 `])` → `]})`（补齐 Router 配置对象的 `}`）

before：

```
])
```

after：

```
]})
```

- [ ] 4. 修复后验证：重复第 1 步命令 → 期望静默通过（exit 0，无输出）
- [ ] 5. 静态旁证（不依赖 node）：括号深度分析恢复 BALANCED —— plan 阶段已预验证本修复组合：`FIXED variant -> BALANCED`（逗号层级由保留的 `},` 保证）

### Task 2：修复 D2 —— TodoView.vue 可选链语法（babel 6 解析阻断）

**Files**：`vue/02day-vue/my-project/src/components/TodoView.vue`

**Interfaces**：无接口变化；仅将可选链表达式降级为 ES2016 兼容写法，取值语义不变。

**Steps**：

- [ ] 1. 第 33 行替换：

before：

```js
        alert('创建失败：' + (e.response?.data?.message || e.message))
```

after（注意保留外层括号，`+` 优先级高于 `||`，漏括号会改变语义）：

```js
        alert('创建失败：' + ((e.response && e.response.data && e.response.data.message) || e.message))
```

- [ ] 2. 验证：`rg -n '\?\?|\?\.' vue/02day-vue/my-project/src` → 期望 0 命中（rg exit 1）
- [ ] 3. 语义自查：`e.response` / `e.response.data` 任一为空时回落 `e.message`，与可选链取值路径等价

### Task 3：修复 D3 —— 后端启用 CORS

**Files**：`vue/03day-vue/server/app.js`

**Interfaces**：新增中间件挂载，无路由/契约变化。`app.use(cors())` 位置：`app.use(logger('dev'))` 之后、`app.use(express.json())` 之前，保证对 `/todos` 的 OPTIONS 预检由 cors 中间件直接响应。

**Steps**：

- [ ] 1. require 区（第 6 行 `var logger = require('morgan');` 之后）新增：

```js
var cors = require('cors');
```

- [ ] 2. 第 17 行 `app.use(logger('dev'));` 之后新增：

```js
app.use(cors());
```

- [ ] 3. 语法验证：`node --check vue/03day-vue/server/app.js` → 静默通过（CJS 文件可直接 check）
- [ ] 4. 备注：cors 位于 devDependencies，本轮不改 package.json（最小改动；生产化时再移入 dependencies，超出本轮范围）。可运行性无风险：`server/node_modules` 已预装全部依赖（含 cors@2.8.4），无需重新安装

### Task 4：后端接口验收（最小闭环核心证据）

**Files**：无改动（运行时验证）

**Steps**（cwd：`vue/03day-vue/server`）：

- [ ] 1. 后台启动：`node ./bin/www`（后台任务；日志确认 `listening on port 3000`；有界等待 ≤ 30s）
- [ ] 2. 预检验证（curl；无 curl 则用文末 node fetch 等价命令）：

```sh
curl -si -X OPTIONS http://localhost:3000/todos \
  -H 'Origin: http://localhost:8080' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type' | head -12
```

期望：`HTTP/1.1 204 No Content`，响应头含 `Access-Control-Allow-Origin: *`

- [ ] 3. 创建成功：

```sh
curl -si -X POST http://localhost:3000/todos -H 'Content-Type: application/json' \
  -d '{"name":"写周报","description":"周五前完成"}'
```

期望：`HTTP/1.1 201 Created`，body `{"code":201,"data":{"id":1,"name":"写周报","description":"周五前完成","createdAt":"…"}}`

- [ ] 4. 空名称：`-d '{"name":"","description":"x"}'` → `400` + `{"code":400,"message":"待办事项名称不能为空"}`
- [ ] 5. 纯空白名称：`-d '{"name":"   "}'` → `400`（trim 生效）
- [ ] 6. 无 description：`-d '{"name":"只有名称"}'` → `201`，`description === ""`
- [ ] 7. 列表回读：`curl -s http://localhost:3000/todos` → `{"code":200,"data":[…]}` 且包含第 3 步创建项
- [ ] 8. 结束：停止后台 server 进程（清理验证进程，不留残留）

node fetch 等价命令（示例，第 3 步）：

```sh
node -e "fetch('http://localhost:3000/todos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'写周报',description:'周五前完成'})}).then(async r=>{console.log(r.status, JSON.stringify(await r.json()))})"
```

### Task 5：前端构建与 dev-server 冒烟（尽力而为 + 降级条款）

**Files**：无源码改动（验证；`package-lock.json` 可能被 npm 9 重写为 v3 格式 —— 预期副作用，允许保留）

**Steps**（cwd：`vue/02day-vue/my-project`）：

- [ ] 1. 安装依赖：`npm install --no-audit --no-fund`（限时 10 分钟，超时即触发降级）
- [ ] 2. 构建：`NODE_OPTIONS=--openssl-legacy-provider npm run build`（webpack 3 在 node ≥ 17 需 legacy provider 支持 md4）→ 期望 exit 0、无 error、`dist/index.html` 生成
- [ ] 3. dev-server 冒烟：后台 `NODE_OPTIONS=--openssl-legacy-provider npm run dev`；从日志解析实际地址（`Your application is running here: http://localhost:PORT`，portfinder 可能改端口）；有界轮询（≤ 60s）`curl -s http://localhost:PORT/todos` → 期望 200 且含 `<div id="app">`
- [ ] 4. **降级条款**（满足其一即停并标注 `[降级说明]`）：npm install 超时/失败；build 连续 2 次失败；报错不在 D1/D2 修复文件范围；单次构建 > 120s 且失败。降级后以 Task 1/2 静态验证 + Task 4 后端证据为交付依据，前端构建列为待办
- [ ] 5. 结束：停止 dev-server 进程
- [ ] 6. 浏览器手工验收项（无法自动化，留给使用者）：打开 `http://localhost:PORT/todos` → 表单创建后列表即时出现新条目；空名称提交被前端拦截；后端未启动时列表静默降级（刷新仍可用）

### Task 6：文档同步

**Files**：`docs/superpowers/specs/2026-09-20-daily-todo-design.md`

**Steps**：

- [ ] 1. §7「既有实现复核结论」末尾追加一段（其余章节不动）：

> 2026-09-20（plan 阶段）实测复核推翻上述「无需改动」结论，发现并修复 3 处阻断缺陷：① `src/router/index.js` 第 76 行多余 `}`、第 85 行缺少 Router 配置对象闭合（语法错误导致前端无法构建）；② `src/components/TodoView.vue:33` 可选链 `?.` 不被 babel 6 工具链支持（改为 `&&`/`||` 兼容写法）；③ `server/app.js` 未挂载 cors 中间件（跨源创建链路必失败，已启用）。修复明细见 `docs/superpowers/plans/2026-09-20-daily-todo.md`。

## 4. Final Verification（验收对照表）

| 验收项（需求/契约） | 证据来源 |
|---|---|
| POST 创建 201 + 返回完整 Todo 字段 | Task 4 步骤 3 |
| name 必填（含 trim）、400 中文文案 | Task 4 步骤 4/5 |
| description 可空 | Task 4 步骤 6 |
| GET 列表含新建项 `{code:200, data:Todo[]}` | Task 4 步骤 7 |
| 跨源可访问（浏览器创建链路前提） | Task 4 步骤 2（204 + ACAO） |
| 前端可构建可启动 | Task 5 步骤 2/3（或降级说明） |
| 路由 `/todos` 可达 | Task 5 步骤 3（200）+ router 修复后静态结构 |
| 文档与实现一致 | Task 6 |

**完成定义**：Task 1–4 全部通过 + Task 6 完成 → 最小闭环达成（即使 Task 5 走降级）；Task 5 成功为加分证据。

## 5. 计划自检（writing-plans Self-Review）

- 覆盖设计文档全部需求：创建（name/description/校验/201/400）、只读列表、错误处理、无 scope creep（不改硬编码 BASE_URL、不做持久化）
- 无占位符：无 TODO/TBD/待定内容；所有命令与期望输出均为确定值
- 类型一致性：修复写法不改变任何接口签名与数据契约字段

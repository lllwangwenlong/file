# Task 1: Create Todo component with add functionality

## Goal
Implement a todo creation page where users can input todo name and description, add to list, and see all created todos.

## Files to create
- NEW: `vue/02day-vue/my-project/src/components/Todo.vue`

## Files to modify
- `vue/02day-vue/my-project/src/router/index.js` — add /nesting/todo route (lazy-loaded, following existing pattern)
- `vue/02day-vue/my-project/src/views/index.vue` — add "待办" nav link in sidebar
- `vue/02day-vue/my-project/src/store/index.js` — add todo state and ADD_TODO mutation

## Acceptance criteria (exact values)
1. Input fields: todo name (事项名称) and description (描述)
2. "添加" button triggers creation
3. Created todos displayed in a list below the form
4. Each todo shows both name and description
5. Form fields clear after successful add
6. Empty name → no todo created (simple validation, use `v-if` or method guard)
7. Navigation: sidebar link "待办" routes to /nesting/todo

## Store contract
```js
state: {
  todos: []  // Array of { id, name, description }
}
mutations: {
  ADD_TODO(state, { name, description }) {
    state.todos.push({ id: Date.now(), name, description })
  }
}
```

## Router contract
- Path: `todo` (child of /nesting)
- Name: `todo`
- Component: lazy-loaded `() => import('../components/Todo')`
- Meta: `{ title: '待办' }`

## Nav link
- Label: `待办`
- Route: `{name: 'todo'}`
- Follow exact same `<li>` / `<router-link>` pattern as existing nav items
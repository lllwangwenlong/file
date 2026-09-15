# Plan: Todo Create Feature

## Global Constraints
- Vue 2 SPA project at `vue/02day-vue/my-project/`
- Use existing Vuex store for state management
- Follow existing project patterns (lazy-loaded routes, scoped styles)
- Vue component file naming: PascalCase `.vue`

## Tasks

### Task 1: Create Todo component with add functionality
- **Goal**: Implement a todo creation page where users can input todo name and description, add to list, and see all created todos.
- **Files to create/modify**:
  - NEW: `vue/02day-vue/my-project/src/components/Todo.vue` — the todo component
- **Files to modify**:
  - `vue/02day-vue/my-project/src/router/index.js` — add /nesting/todo route
  - `vue/02day-vue/my-project/src/views/index.vue` — add "待办" nav link
  - `vue/02day-vue/my-project/src/store/index.js` — add todo state/mutations
- **Acceptance criteria**:
  - User can input a todo name (事项名称) and description (描述)
  - Clicking "添加" creates a new todo item
  - Created todos are displayed in a list below the form
  - Each todo shows its name and description
  - Form fields clear after successful add
  - Empty name should not create a todo (simple validation)
  - Navigation works from sidebar
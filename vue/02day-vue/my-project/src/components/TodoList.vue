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
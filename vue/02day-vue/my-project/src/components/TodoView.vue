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
        alert('创建失败：' + ((e.response && e.response.data && e.response.data.message) || e.message))
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
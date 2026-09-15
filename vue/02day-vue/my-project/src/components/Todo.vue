<template>
    <div>
      <h1>待办事项</h1>
      <div>
        <label>事项名称：</label>
        <input type="text" v-model="todoName" placeholder="请输入事项名称">
      </div>
      <div>
        <label>描述：</label>
        <input type="text" v-model="todoDesc" placeholder="请输入描述">
      </div>
      <button @click="addTodo">添加</button>
      <ul v-if="todos.length">
        <li v-for="item in todos" :key="item.id">
          <span>{{ item.name }}</span> - <span>{{ item.description }}</span>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "todo",
        data () {
            return {
                todoName: '',
                todoDesc: ''
            }
        },
        computed: {
            todos () {
                return this.$store.state.todos
            }
        },
        methods: {
            addTodo () {
                if (!this.todoName) return
                this.$store.commit('ADD_TODO', {
                    name: this.todoName,
                    description: this.todoDesc
                })
                this.todoName = ''
                this.todoDesc = ''
            }
        }
    }
</script>

<style scoped>

</style>
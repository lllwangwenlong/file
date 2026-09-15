## New File: vue/02day-vue/my-project/src/components/Todo.vue

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

---

## Modified: vue/02day-vue/my-project/src/router/index.js (+8 lines)

@@ -64,20 +64,28 @@
         {
           path: 'shop',
           name: 'shop',
           component: () => import('../components/shop'),
           meta: {
             title: '购物'
           }
         },
+        {
+          path: 'todo',
+          name: 'todo',
+          component: () => import('../components/Todo'),
+          meta: {
+            title: '待办'
+          }
+        },
       ]
     }
   ]
 })

---

## Modified: vue/02day-vue/my-project/src/store/index.js (+6/-1)

@@ -1,29 +1,33 @@
   state: {
     count: 0,
-    price: 30
+    price: 30,
+    todos: []
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
+    },
+    'ADD_TODO' (state, { name, description }) {
+      state.todos.push({ id: Date.now(), name, description })
     }
   },

---

## Modified: vue/02day-vue/my-project/src/views/index.vue (+1 line)

@@ -8,6 +8,7 @@
           <li><router-link :to="{name: 'about1',params:{id:'998'}}">详情</router-link></li>
           <li><router-link :to="{name: 'login1'}">登陆</router-link></li>
           <li><router-link :to="{name: 'shop'}">购物</router-link></li>
+          <li><router-link :to="{name: 'todo'}">待办</router-link></li>
         </ul>
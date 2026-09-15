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
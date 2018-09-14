<template>
  <div class="container">
    <button @click="reduce">-</button>
    <strong>{{count}}</strong>
    <button @click="add">+</button>
    <button @click="handleBus">兄弟组件传值</button>
  </div>
</template>

<script>
    export default {
        data () {
          return{
            msg: '来自兄弟组件comB的值'
          }
        },
        props: {
          count:{
            type: Number
          }
        },
        methods: {
          reduce () {
            this.$emit('reduce')
          },
          add () {
            this.$emit('add')
          },
          handleBus () {
            this.$bus.$emit('toData', this.msg)
          }
        }
    }
</script>

<style scoped>
.container {
  margin-left: 20px;
}

.container button{
  width: 50px;
  height: 50px;
  border-radius: 6px;
}
</style>

<template>
  <div class="container">
    <button @click="reduce">-</button>
    <strong>{{count}}</strong>
    <button @click="add">+</button>

  </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        methods: {
          reduce () {
            this.$store.commit('REDUCE_COUNT')
          },
          add () {
            this.$store.commit('ADD_COUNT')
          }
        },
        computed: mapState(['count'])
    }
</script>

<style scoped>
.container {
  margin-left: 20px;
}

.container button{
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  border-radius: 6px;
}
</style>

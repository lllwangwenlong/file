<template>
    <div style="display: flex">
      <comA :count="count" :price="price" ></comA>
      <comB :count="count" @add="add" @reduce="reduce"></comB>
      <h2 class="price">单价:{{price}}</h2>
      <comA1></comA1>
      <comB1></comB1>
      <h2 class="price">单价:{{this.$store.state.price}}</h2>
      <input type="text" v-model="count1">
      <button @click="changeCount">输入你想要的值</button>
      <button @click="handleAsync">异步操作</button>
    </div>
</template>

<script>
    import comA from './comA'
    import comB from './comB'
    import comA1 from './comA1'
    import comB1 from './comB1'
    import {mapMutations} from 'vuex'
    export default {
      data () {
        return{
          count: 0,
          count1:'',
          price: 20
        }
      },
      components: {
        comA,
        comB,
        comA1,
        comB1
      },
      methods: {
        reduce () {
          this.count--
        },
        add () {
          this.count++
        },
        changeCount () {
          this.$store.commit('CHANGE_COUNT',this.count1)
          this.count1 = ''
        },
        ...mapMutations(['CHANGE_COUNT']),
        handleAsync () {
          // setTimeout(() => {
          //   this.CHANGE_COUNT(this.count1)
          // },1000)
          this.$store.dispatch('handleAsyncActions',this.count1)
        }
      }
    }
</script>

<style scoped>
.price {
  margin-left: 10px;
  text-align: center;
  padding-top: 10px;
}
</style>

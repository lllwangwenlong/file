<template>
  <div>
    <h1>
      小计:{{totalPrice}}
    </h1>
    <h2>
      {{msg}}
    </h2>
  </div>
</template>

<script>
    export default {
        data () {
          return {
            msg: ''
          }
        },
        props:{
          count:{
            type: Number
          },
          price:{
            type: Number
          }
        },
        created () {
          this.$bus.$on('toData', (msg)=>{
            this.msg = msg
        })
        },
        computed: {
          totalPrice () {
            return this.count*this.price
          }

        }
    }
</script>

<style scoped>

</style>

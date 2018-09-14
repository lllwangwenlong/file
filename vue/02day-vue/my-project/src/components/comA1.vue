<template>
  <div>
    <h1>
      小计:{{this.$store.getters.totalPrice}}
    </h1>
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        // computed: mapState(['count', 'price'])
    }
</script>

<style scoped>

</style>

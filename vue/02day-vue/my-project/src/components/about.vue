<template>
    <div>
      <h1>我是详情页面</h1>
      <h1>
        我是动态路由参数{{$route.params.id}}
      </h1>
    </div>
</template>

<script>
    export default {
        name: "about",
    }
</script>

<style scoped>

</style>

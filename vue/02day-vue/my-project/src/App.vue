<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <div>
      <ul>
        <li>
          <router-link :to= "{name: 'home'}">首页</router-link>
        </li>
        <li>
          <router-link :to= "{name: 'about',params: {id: '998'}}">详情页</router-link>
        </li>
        <li>
          <router-link :to= "{name: 'login'}">登录页面</router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>

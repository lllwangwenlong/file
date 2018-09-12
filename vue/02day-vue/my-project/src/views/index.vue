<template>
    <div class="container">
      <div class="header">
        <h1>头部</h1>
      </div>
      <div class="nav">
        <ul>
          <li><router-link :to="{name: 'home1'}">首页</router-link></li>
          <li><router-link :to="{name: 'about1',params:{id:'998'}}">详情</router-link></li>
          <li><router-link :to="{name: 'login1'}">登陆</router-link></li>
        </ul>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
  .header {
    text-align: center;
    padding-left: 200px;
    background-color: #0ff;
  }

  .nav {
    position: fixed;
    z-index: 998;
    top: 0;
    left: 0;
    bottom: 0;
    width: 200px;
    background-color: #1A2B3D;
  }

  .nav li{
    width: 200px;
    height: 50px;line-height: 50px;
    text-align: center;
  }

  .nav a{
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    font-weight: 700;
  }

  .content {
    padding-left: 200px;
    background-color: #f00;
  }
</style>

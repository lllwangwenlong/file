<template>
    <div>
      <h1>我是首页面</h1>
      <router-link :to="{name: 'login1', query: {userInfo: 'name is wang'}}">跳转到登录</router-link>
      <button @click="handlegetData">发送数据</button>
      <button @click="getJsonp">获取jsonp数据</button>
      <button @click="getJsonp1">插件获取jsonp数据</button>
      <button @click="getNoSimple">获取非简单数据</button>
      <button @click="getVuecli">使用Vue脚手架获取数据</button>
    </div>
</template>

<script>
    import axios from "axios"
    import jsonp from  "jsonp"
    export default {
        name: "home",
        methods: {
          handlegetData() {
            axios.get('http://localhost:3000/getMsg',{withCredentials: true}).then(res => {
              console.log(res)
            }).catch(err => {
              console.log('err', err)
            })
          },
          getJsonp() {
            let script = document.createElement('script')
            let body = document.body
            script.src = 'http://localhost:3000/getJsonp?callback=getData'
            body.appendChild(script)
          },
          getJsonp1() { //没有实现jsonp插件跨域的效果
            jsonp('http://localhost:3000/getJsonp',{},function (res) {
              console.log(res)
            })
          },
          getNoSimple() {
            axios.post('http://localhost:3000/noSimple',{username: 'wang'},{withCredentials: true}).then(res => {
              console.log(res)
            })
          },
          getVuecli () {
            axios.get('/api/getMsg').then(res => {
              console.log(res)
            })
          }
        }
    }
</script>

<style scoped>

</style>

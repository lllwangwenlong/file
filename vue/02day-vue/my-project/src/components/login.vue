<template>
    <div>
      <h1>登录页面</h1>
      昵称:<input type="text" v-model="username">
      <br>
      密码:<input type="text" v-model="password">
      <button @click="handleSubmit">
        点击登录
      </button>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
          return {
            username: '',
            password: ''
          }
        },
        created() {
          console.log(this.$route)
          console.log(this.$route.query)
        },
        methods: {
          handleSubmit() {
            axios.post('http://localhost:3001/login',{username:this.username,password:this.password}).then(res => {
              if(res.data.code == 200){
                alert('登陆成功')
                this.$router.push('/nesting/home')
              }else{
                alert('登陆失败')
              }
            })
          }
        }
    }
</script>

<style scoped>

</style>

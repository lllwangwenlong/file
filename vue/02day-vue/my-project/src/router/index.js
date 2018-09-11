import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/home')
    },
    {
      path: '/about/:id',
      name: 'about',
      component: () => import('../components/about')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/login')
    }
  ]
})

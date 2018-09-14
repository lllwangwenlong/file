import Vue from 'vue'
import Router from 'vue-router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

let router =  new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('../components/home'),
    //   meta: {
    //     title: '首页'
    //   }
    // },
    // {
    //   path: '/about/:id',
    //   name: 'about',
    //   component: () => import('../components/about'),
    //   meta: {
    //     title: '详情'
    //   }
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../components/login'),
    //   meta: {
    //     title: '登录'
    //   }
    // },
    {
      path: '/nesting',
      component: () => import('../views/index'),
      redirect:'/nesting/home',
      children: [
        {
          path: 'home',
          name: 'home1',
          component: () => import('../components/home'),
          meta: {
            title: '首页'
          }
        },
        //  /nesting/about/998
        {
          path: 'about/:id',
          name: 'about1',
          component: () => import('../components/about'),
          meta: {
            title: '详情'
          }
        },
        //  /nesting/login
        {
          path: 'login',
          name: 'login1',
          component: () => import('../components/login'),
          meta: {
            title: '登录'
          }
        },
        {
          path: 'shop',
          name: 'shop',
          component: () => import('../components/shop'),
          meta: {
            title: '购物'
          }
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  Nprogress.start()
  if(to.meta&&to.meta.title){
    document.title = to.meta.title
  }
  next()
})

router.afterEach((to, from) => {
  Nprogress.done()
})


export default router

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    // 路由重定向
    {
      path: '/',
      redirect: '/layout/home'
    },
    // 处理普通的路由
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    },
    // 处理back的路由
    {
      path: '/login/loginback',
      name: 'loginback',
      component: () => import('@/views/login')
    },
    // 搜索组件
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search')
    },
    // 文章组件
    {
      path: '/article/:aId',
      name: 'article',
      component: () => import('@/views/article')
    },
    // 搜索展示组件
    {
      path: '/searchShow/:key',
      name: 'searchShow',
      component: () => import('@/views/searchShow')
    },
    // 布局组件
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/views/layout'),
      children: [
        {
          path: '/layout/home',
          name: 'home',
          component: () => import('@/views/home')
        }
      ]
    }
  ]
})

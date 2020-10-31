import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

//路由导航首位的控制(判断用户是否已经登录过了，根据token是否存在的值)
router.beforeEach((to, from, next) => {
  //to：将要访问的路径，from：原路径，next：放行的函数
  //next('/login') 强制跳转的路径
  if (to.path === '/login') return next()
  //获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router

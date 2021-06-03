import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
/** Home(Login) Import */
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import ResetPassword from './views/ResetPassword.vue'
import ForgotPassword from './views/ForgotPassword.vue'


import AdminIndex from './views/Admin/Index.vue'
import AdminUser from './views/Admin/User.vue'
import AdminCompany from './views/Admin/Company.vue'
import Order from './views/Order.vue'
import Vendor from './views/Vendor.vue'

/** Common Imports End Here */
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: false, title: 'Home' },
      component: Home
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { requiresAuth: false, title: 'Forgot Password' },
      component: ForgotPassword
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      meta: { requiresAuth: false, title: 'Reset Password' },
      component: ResetPassword
    },
    {
      path: '/orders',
      name: 'orders',
      meta: { requiresAuth: true, title: 'Orders' },
      component: Order
    },
    {
      path: '/my-account',
      name: 'account',
      meta: { requiresAuth: true, title: 'My Account' },
      component: Account
    },
    {
      path: '/admin',
      component: AdminIndex,
      children: [
        {
          path: 'users',
          name: 'users',
          meta: { requiresAuth: true, title: 'Users', access: ['admin'] },
          component: AdminUser
        },
        {
          path: 'companies',
          name: 'companies',
          meta: { requiresAuth: true, title: 'Companies', access: ['admin'] },
          component: AdminCompany
        },
      ]
    },
    {
      path: "/unauthorized",
      name: 'unauthorized',
      meta: { requiresAuth: false, title: 'Unauthorized (401)' },
      component: () => import('./views/Unauthorized.vue')
    },
    {
      path: '/vendors',
      name: 'vendors',
      meta: { requiresAuth: true, title: 'Vendors' },
      component: Vendor
    },
    {
      path: "/*",
      name: 'pagenotfound',
      meta: { requiresAuth: false, title: 'Page Not Found (404)' },
      component: () => import('./views/PageNotFound.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.meta.access != undefined && !to.meta.access.includes(store.getters.userType)) {
      next('/unauthorized')
    }
    if (store.getters.isLoggedIn) {
      store.dispatch('checkSession').then(() => {
        document.title = process.env.VUE_APP_TITLE + ' - ' + to.meta.title
        next()
      }).catch(() => {
        next('/')
      })
      document.title = process.env.VUE_APP_TITLE + ' - ' + to.meta.title
      next()
      return
    }
    next('/')
  } else {
    document.title = (process.env.VUE_APP_TITLE + ' - ' + to.meta.title)
    next()
  }
})

export default router

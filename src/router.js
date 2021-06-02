import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
/** Home(Login) Import */
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import ResetPassword from './views/ResetPassword.vue'
import ForgotPassword from './views/ForgotPassword.vue'

import User from './views/User.vue'
import Order from './views/Order.vue'

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
      path: '/my-account',
      name: 'account',
      meta: { requiresAuth: true, title: 'My Account' },
      component: Account
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
      path: '/users',
      name: 'users',
      meta: { requiresAuth: true, title: 'Users' },
      component: User
    },
    {
      path: "/*",
      name: 'pagenotfound',
      meta: { requiresAuth: false, title: 'Page Not Found (404)' },
      component: () => import('./views/PageNotFound.vue')
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
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

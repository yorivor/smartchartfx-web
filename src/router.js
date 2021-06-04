import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
/** Home(Login) Import */
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import ResetPassword from './views/ResetPassword.vue'
import ForgotPassword from './views/ForgotPassword.vue'

/** Admin Import */
import AdminIndex from './views/Admin/Index.vue'
import AdminUser from './views/Admin/User.vue'
import AdminCompany from './views/Admin/Company.vue'
<<<<<<< HEAD
import Order from './views/Order.vue'
import AdminVendor from './views/Admin/Vendor.vue'
=======
import AdminPurchaseOrder from './views/Admin/PurchaseOrder.vue'

/** Prepeaer, Reviewer, Approver Import */
import PrepearerPurchaseOrder from './views/PurchaseOrder/Prepearer.vue'
import ReviewerPurchaseOrder from './views/PurchaseOrder/Reviewer.vue'
import ApproverPurchaseOrder from './views/PurchaseOrder/Approver.vue'
>>>>>>> 067d9781e0e2726ca89d6c12c6e1b18bed9a55f6

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
      path: '/prepearer/purchase-orders',
      name: 'prepearer-purchase-orders',
      meta: { requiresAuth: true, title: 'Purchase Orders', access: ['prepearer'] },
      component: PrepearerPurchaseOrder
    },
    {
      path: '/reviewer/purchase-orders',
      name: 'reviewer-purchase-orders',
      meta: { requiresAuth: true, title: 'Purchase Orders', access: ['reviewer'] },
      component: ReviewerPurchaseOrder
    },
    {
      path: '/approver/purchase-orders',
      name: 'approver-purchase-orders',
      meta: { requiresAuth: true, title: 'Purchase Orders', access: ['approver'] },
      component: ApproverPurchaseOrder
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
          name: 'admin-users',
          meta: { requiresAuth: true, title: 'Users', access: ['admin'] },
          component: AdminUser
        },
        {
          path: 'companies',
          name: 'admin-companies',
          meta: { requiresAuth: true, title: 'Companies', access: ['admin'] },
          component: AdminCompany
        },
        {
          path: 'vendors',
          name: 'vendors',
          meta: { requiresAuth: true, title: 'Vendors', access: ['admin'] },
          component: AdminVendor
        },
        {
          path: 'purchase-orders',
          name: 'admin-purchase-orders',
          meta: { requiresAuth: true, title: 'Purchase Order', access: ['admin'] },
          component: AdminPurchaseOrder
        }
      ]
    },
    {
      path: "/unauthorized",
      name: 'unauthorized',
      meta: { requiresAuth: false, title: 'Unauthorized (401)' },
      component: () => import('./views/Unauthorized.vue')
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

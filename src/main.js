import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'

import "@/assets/main.scss";

import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
Vue.prototype.$api = process.env.VUE_APP_API_BASE_URL;


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

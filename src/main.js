import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'

import VueHtmlToPaper from 'vue-html-to-paper';
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    "/printer.css"
  ]
}

Vue.use(VueHtmlToPaper, options);

import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
Vue.prototype.$api = process.env.VUE_APP_API_BASE_URL;
Vue.prototype.$scrollToTop = () => window.scrollTo(0, 0);

const token = localStorage.getItem('token')
if (token != '') {
  Vue.prototype.$http.defaults.headers.common['Access-Control-Allow-Origin'] = true
  Vue.prototype.$http.defaults.headers.common['X-51TALK-SESSION-ID'] = token
  Vue.prototype.$http.defaults.headers.common['Accept'] = 'application/json'
} else {
  delete Vue.prototype.$http.defaults.headers.common['X-51TALK-SESSION-ID']
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    displayname: localStorage.getItem('displayname') || '',
    usertype: localStorage.getItem('usertype') || '',
    isDarkTheme: localStorage.getItem('isDarkTheme') || 'no',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, datum) {
      state.status = 'success'
      state.token = datum.token
      state.displayname = datum.fullname
      state.usertype = datum.type.code
    },
    auth_error(state) {
      state.status = 'error'
      state.token = ''
      state.displayname = ''
    },
    logout(state) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('displayname')
      localStorage.removeItem('usertype')
      state.token = ''
      state.username = ''
      state.displayname = ''
      state.usertype = ''
    },
    set_token(state, id) {
      state.token = id.toString()
    },
    unset_token(state) {
      localStorage.removeItem('token')
      state.token = ''
    },
    set_light_theme(state) {
      state.isDarkTheme = 'no';
    },
    set_dark_theme(state) {
      state.isDarkTheme = 'yes';
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: process.env.VUE_APP_API_BASE_URL + '/login',
          data: user,
          method: 'POST'
        }).then((resp) => {
          const token = resp.data.response.token
          localStorage.setItem('token', token)
          localStorage.setItem('displayname', resp.data.response.fullname)
          localStorage.setItem('usertype', resp.data.response.type.code)
          axios.defaults.headers.common['X-51TALK-SESSION-ID'] = token
          commit('auth_success', resp.data.response)
          resolve(resp)
        }).catch(err => {
          commit('auth_error')
          reject(err)
        })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        delete axios.defaults.headers.common['X-51TALK-SESSION-ID']
        resolve()
      })
    },
    checkSession({ commit, getters, state }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_BASE_URL + '/token-check',
          method: 'GET'
        }).then(() => {
          resolve()
        }).catch(err => {
          commit('logout')
          delete axios.defaults.headers.common['X-51TALK-SESSION-ID']
          reject(err)
        })
      })
    },
    setToken({ commit }, token) {
      return new Promise((resolve, reject) => {
        localStorage.setItem('token', token)
        commit('set_token', token)
        resolve()
      })
    },
    unsetToken({ commit }) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem('token')
        commit('logout')
        resolve()
      })
    },
    setToDarkTheme({ commit }) {
      return new Promise((resolve, reject) => {
        console.log('settodark')
        localStorage.setItem('isDarkTheme', 'yes')
        commit('set_dark_theme')
        resolve()
      })
    },
    setToLightTheme({ commit }) {
      return new Promise((resolve, reject) => {
        localStorage.setItem('isDarkTheme', 'no')
        commit('set_light_theme')
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => state.token != '',
    authStatus: state => state.status,
    displayname: state => state.displayname,
    userType: state => state.usertype,
    isDarkTheme: state => state.isDarkTheme == 'yes',
    isAdmin: state => state.usertype == 'admin',
    isData: state => state.usertype == 'data',
    isPreparer: state => state.usertype == 'preparer',
    isReviewer: state => state.usertype == 'reviewer',
    isApprover: state => state.usertype == 'approver',
  }
})

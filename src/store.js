import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { STATUS_CODES } from 'http'

// import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    displayname: localStorage.getItem('displayname') || '',
    usertype: localStorage.getItem('usertype') || '',
    hdfispassed: localStorage.getItem('hdfispassed') || '',
    hdfmessage: localStorage.getItem('hdfmessage') || '',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, datum) {
      state.status = 'success'
      state.token = datum.token
      state.displayname = datum.fullname
      state.usertype = datum.usertype
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
    set_result(state, result) {
      localStorage.setItem('hdfispassed', result.isPassed)
      localStorage.setItem('hdfmessage', result.message)
      state.hdfispassed = result.isPassed
      state.hdfmessage = result.message
    },
    unset_result(state) {
      localStorage.removeItem('hdfispassed')
      localStorage.removeItem('hdfmessage')
      state.hdfispassed = ''
      state.hdfmessage = ''
    }
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
    setResult({ commit }, result) {
      return new Promise((resolve) => {
        commit('set_result', result)
        resolve()
      })
    },
    unsetResult({ commit }) {
      return new Promise((resolve) => {
        commit('unset_result')
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => state.token != '',
    authStatus: state => state.status,
    displayname: state => state.displayname,
    isAdmin: state => state.usertype == 'admin',
    hdfispassed: state => state.hdfispassed,
    hdfmessage: state => state.hdfmessage,
  }
})

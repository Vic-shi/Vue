import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/styles/main.css'
import $ from 'jquery'
import axios from 'axios'
import qs from 'qs'
// import apiConfig from '../config/api.config'
axios.defaults.baseURL = ''
axios.defaults.transformRequest = [function(data) { 
  return qs.stringify(data)
}]
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.interceptors.request.use(
//   config => {
//     if (store.state.token) {   // 判断是否存在token，如果存在的话，则每个http header都加上token
//       config.headers.Authorization = `token ${store.state.token}`
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )
Vue.prototype.$axios = axios
Vue.prototype.HOST = '/api'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
// import '@/permission' // permission control
global.userName = 'admin'
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

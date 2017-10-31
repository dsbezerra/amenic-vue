import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'

import store from './store'
import routes from './routes/routes'

import 'material-design-icons/iconfont/material-icons.css'

// Setup plugins
Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueRouter)

// Configure routes
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkExactActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
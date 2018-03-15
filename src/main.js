// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vuex from 'vuex'
import Router from 'vue-router'
import Meta from 'vue-meta'
import store from './store'
import router from './router'
import filters from './service/filters'
import 'normalize.css'
import '@/assets/styles/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'

Vue.use(vuex)
Vue.use(Router)
Vue.use(ElementUI)
Vue.use(Meta)
Vue.use(filters)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

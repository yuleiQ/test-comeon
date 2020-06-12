import Vue from 'vue'
import App from './App.vue'
import $bus from './utils/bus.js'
import router from './router'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$bus = $bus;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

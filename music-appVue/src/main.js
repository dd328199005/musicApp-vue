import 'babel-polyfill'
import Vue from 'vue'
import App from 'src/App'
import fastclick from 'fastclick'
import router from './router'
import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'
import store from './store'
fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/img/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})

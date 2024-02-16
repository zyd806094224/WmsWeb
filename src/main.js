import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import axios from "axios";
Vue.prototype.$axios=axios

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  el:'#app',
  render: h => h(App),
}).$mount('#app')

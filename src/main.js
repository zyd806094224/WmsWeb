import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import axios from "axios";
import VueRouter from "vue-router";
import router from "./router/index.js";
import store from "./store/index.js";

Vue.prototype.$axios = axios
Vue.prototype.$httpUrl = 'http://localhost:8088'

Vue.config.productionTip = false

// Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.use(ElementUI, {size: 'small'});

new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App),
}).$mount('#app')

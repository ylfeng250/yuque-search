import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.use(ElementUI)
Vue.prototype.$axios = axios.create({
    baseURL: 'https://www.yuque.com/api/v2/',
    timeout: 1500,
    headers: {
        'Content-Type': 'application/json',
    }
})
new Vue({
    el: '#popup',
    render: h => h(App)
})
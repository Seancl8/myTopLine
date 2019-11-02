import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入vant
import vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import store from './store'
// 导入自己封装的插件
import AxiosPlugs from '@/utils/request.js'
import loginPlugs from '@/utils/loginplugs'
import dayjs from 'dayjs'
// 导入 dayjs 的相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入 dayjs 的中文包
import 'dayjs/locale/zh-cn'
// // 让 dayjs 使用插件
dayjs.extend(relativeTime)
// // 使用中文包
dayjs.locale('zh-cn')
Vue.use(Lazyload)
// 定义一个全部的过滤器来处理时间
Vue.filter('relativetime', function (value) {
  // 得 value 与当前时间的相对时间
  return dayjs().from(dayjs(value))
})
Vue.use(vant)

// 在vue中使用插件
Vue.use(AxiosPlugs)
Vue.use(loginPlugs)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

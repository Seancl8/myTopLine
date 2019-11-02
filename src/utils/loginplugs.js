// 进行登录验证的插件
import Vue from 'vue'
import store from '../store'
import { Toast } from 'vant'
import router from '@/router'
Vue.use(Toast)

var loginPlugs = {}
// 添加一个install方法
loginPlugs.install = function (Vue) {
  Vue.prototype.$login = function () {
    let user = store.state.user
    if (!user) {
      Toast.fail('请登录后再操作')
      setTimeout(() => {
        router.push('/login/loginback')
      }, 500)
      return false
    }
    return true
  }
}

// 导出插件对象
export default loginPlugs

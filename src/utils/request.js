// utils文件管理所有的工具
// 封装所有的axios相关的逻辑

// 1.导入axios
import axios from 'axios'
// 导入store
import store from '@/store/index'
// 导入 JSON-bigint
import JSONBig from 'json-bigint'

// 创建一个axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  transformResponse: [function (data) {
    // console.log(11111111111111111111111111111111111111111111111)
    try {
      return JSONBig.parse(data)
    } catch (err) {
      console.log(err)
      return data
    }
  }]
})

// 创建另一个axios实例 用于请求更新的token
const refreshInstance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})

// 设置请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 获取user信息
    let user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // config 所有的请求信息
    return config
  },
  function (error) {
    // 错误处理
    return Promise.reject(error)
  }
)
// 设置响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 服务器响应回来的数据
    return response.data.data
  },
  async function (error) {
    // 获取user的信息
    let user = store.state.user
    // 判断如果返回的状态为401
    if (error.response.status === 401) {
      // 新建一个axios实例去发送axios请求
      let res = await refreshInstance({
        url: '/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      user.token = res.data.data.token
      store.commit('setUser', user)
      // token已经更新 重新发送请求
      return instance(error.config)
    }
    // 错误处理
    return Promise.reject(error)
  }
)

// 创建一个插件对象
const Myplugs = {}
// 添加一个install方法
Myplugs.install = function (Vue) {
  // 将axios实例挂载到vue的元素中
  Vue.prototype.$http = instance
}

// 导出
export default Myplugs

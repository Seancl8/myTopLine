import Vue from 'vue'
import Vuex from 'vuex'
// 导入保存到本地和修改的方法
import { SetUserLocal, getUserLocal } from '@/utils/userlocal'

Vue.use(Vuex)

// 创建并且导出一个仓库对象
export default new Vuex.Store({
  state: {
    // 获取到保存在本地的数据
    user: getUserLocal()
  },
  mutations: {
    // 修改仓库数据同时更新到本地
    setUser: function (state, obj) {
      state.user = obj
      // 更新到本地
      SetUserLocal(obj)
    }
  }
})

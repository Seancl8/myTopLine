// 管理所有与用户相关的网络请求
// 封装的思想: 由于在login页面中直接发送到服务器,
// 解决方案: 将login请求服务器的代码单独封装到一个文件中

// 用来进行用户的登录
// axios: 发起网络请求的对象
// 解构对象
function userLogin (axios, { url, method, data }) {
  // 发送网络请求
  return axios({
    url: url,
    method: method,
    data: data
  })
  // return 返回了一个promise对象
}

// 加入黑名单
function apiAddBlackList (axios, autid) {
  return axios({
    url: '/user/blacklists',
    method: 'POST',
    data: {
      target: autid
    }
  })
}

// 点击关注的api
function apiFollow (axios, authorId) {
  return axios({
    url: `/user/followings`,
    method: 'POST',
    data: {
      target: authorId
    }
  })
}

// 取消关注的api
function apiUnFollow (axios, authorId) {
  return axios({
    url: `/user/followings/${authorId}`,
    method: 'DELETE'
  })
}

// 将来调用userLogin时,得到的是promise对象,所以可以直接通过UserLogin.then()
// 露给外界: 按需导出
export {
  userLogin,
  apiAddBlackList,
  apiFollow,
  apiUnFollow
}

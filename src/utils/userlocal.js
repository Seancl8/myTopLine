// 封装对localstorage中user的操作

// 定义要操作的key
const USER_KEY = 'user'
// 保存到 本地的方法
function SetUserLocal (value) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(value))
}
// 删除
function delUserLocal () {
  window.localStorage.removeItem(USER_KEY)
}
// 查询
function getUserLocal () {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}
// 将方法暴露出给外界
export {
  SetUserLocal,
  delUserLocal,
  getUserLocal
}

// 封装获取频道的函数
function apiGetChannel (axios, { url, method }) {
  return axios({
    url: url,
    method: method
  })
}

// 得到所有频道的函数
function apiGetAllChannel (axios, { url, method }) {
  return axios({
    url: url,
    method: method
  })
}

// 添加频道的函数
function apiAddChannels (axios, { url, method, data }) {
  return axios({
    url,
    method,
    data
  })
}

// 删除频道的函数
function apiDelChannel (axios, { url, method, data }) {
  return axios({
    url,
    method,
    data
  })
}

// 导出
export {
  apiGetChannel,
  apiGetAllChannel,
  apiDelChannel,
  apiAddChannels
}

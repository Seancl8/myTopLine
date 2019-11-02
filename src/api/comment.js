// 处理与评论相关的网络请求
// 获取所有的评论
function apiGetAllComments (axios, { source, offset, limit }) {
  return axios({
    url: '/comments',
    method: 'GET',
    params: {
      type: 'a',
      source,
      offset,
      limit
    }
  })
}

// 获取评论的回复
function apiGetReplyComments (axios, { source, offset, limit }) {
  return axios({
    url: '/comments',
    method: 'GET',
    params: {
      type: 'c',
      source,
      offset,
      limit
    }
  })
}

export {
  apiGetAllComments,
  apiGetReplyComments
}

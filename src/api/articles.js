// 封装获得频道下的文章内容
function apiGetArticles (axios, { url, method, query }) {
  return axios({
    url: url,
    method: method,
    params: query
  })
}

// 封装对文章不喜欢的函数
function apiDislikeArticles (axios, { url, method }) {
  return axios({
    url,
    method
  })
}

// 举报文章
function apiReportArticle (axios, { target, type }) {
  return axios({
    url: '/article/reports',
    method: 'POST',
    data: {
      target,
      type,
      remark: ''
    }
  })
}

// 根据id获取文章详情
function apiReadArticle (axios, aId) {
  return axios({
    url: `/articles/${aId}`,
    method: 'GET'
  })
}

// 对文章进行评论
function makeArticleComments (axios, { target, content }) {
  return axios({
    url: '/comments',
    method: 'POST',
    data: {
      target,
      content
    }
  })
}

// 对评论进行回复
function apiReplyComments (axios, { target, content, artid }) {
  return axios({
    url: '/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id: artid
    }
  })
}

// 按需导出
export {
  apiGetArticles,
  apiDislikeArticles,
  apiReportArticle,
  apiReadArticle,
  makeArticleComments,
  apiReplyComments
}

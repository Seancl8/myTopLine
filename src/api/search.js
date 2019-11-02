// 封装联想的api
function apiThinkSearch (axios, q) {
  return axios({
    url: `/suggestion?q=${q}`,
    method: 'GET'
  })
}

// 封装搜索关键词的api
function apiSearchData (axios, { page, perPage, q }) {
  return axios({
    url: `/search`,
    method: 'GET',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}

// 暴露api
export { apiThinkSearch, apiSearchData }

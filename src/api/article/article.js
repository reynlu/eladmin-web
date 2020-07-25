import request from '@/utils/request'

export function getArticleTags(params) {
  console.log(params)
  return request({
    url: '/api/article/tags/get-tag-list',
    method: 'get',
    data: params
  })
}

export function addArticleTag(params) {
  console.log(params)
  return request({
    url: '/api/article/tags/add',
    method: 'post',
    data: params
  })
}

export function updateArticleTag(params) {
  console.log(params)
  return request({
    url: '/api/article/tags/update',
    method: 'put',
    data: params
  })
}

export function deleteArticleTags(params) {
  console.log(params)
  return request({
    url: '/api/article/tags/delete',
    method: 'delete',
    data: params
  })
}

export function getArticle(params) {
  console.log(params)
  return request({
    url: '/api/article/feed/get-article-list',
    method: 'get',
    data: params
  })
}

export function getArticleById(id) {
  return request({
    url: '/api/article/feed/' + id,
    method: 'get'
  })
}

export function addArticle(params) {
  console.log(params)
  return request({
    url: '/api/article/feed/add',
    method: 'post',
    data: params
  })
}

export function updateArticle(params) {
  console.log(params)
  return request({
    url: '/api/article/feed/update',
    method: 'put',
    data: params
  })
}

export function deleteArticle(params) {
  console.log(params)
  return request({
    url: '/api/article/feed/delete',
    method: 'delete',
    data: params
  })
}

export function getCategory(params) {
  console.log(params)
  return request({
    url: '/api/article/category/get-category-list',
    method: 'get',
    data: params
  })
}

export function addCategory(params) {
  console.log(params)
  return request({
    url: '/api/article/category/add',
    method: 'post',
    data: params
  })
}

export function updateCategory(params) {
  console.log(params)
  return request({
    url: '/api/article/category/update',
    method: 'put',
    data: params
  })
}

export function deleteCategory(params) {
  console.log(params)
  return request({
    url: '/api/article/category/delete',
    method: 'delete',
    data: params
  })
}

export default {
  getArticleTags,
  addArticleTag,
  updateArticleTag,
  deleteArticleTags,
  getArticle,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory
}

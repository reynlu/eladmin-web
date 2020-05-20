import request from '@/utils/request'

export function getQuestionList(params) {
  return request({
    url: 'api/exam/question/get-question-list',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/exam/question/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/exam/question/deleteAll',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/exam/question/update',
    method: 'put',
    data
  })
}

export function upload(data) {
  return request({
    url: 'api/exam/question/upload',
    method: 'post',
    headers: { 'Content-Type': 'application/json', 'request-ajax': true },
    data
  })
}

export default { add, edit, del, upload }

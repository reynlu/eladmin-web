import request from '@/utils/request'

export function getExaminerList(params) {
  return request({
    url: 'api/exam/get-examiner-list',
    method: 'get',
    params
  })
}

export function addExaminer(params) {
  console.log(params)
  return request({
    url: 'api/exam/add-examiner',
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  })
}

export function getExaminer(id) {
  return request({
    url: 'api/exam/get-examiner/' + id,
    method: 'get'
  })
}

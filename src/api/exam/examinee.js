import request from '@/utils/request'

export function getExamineeList(params) {
  return request({
    url: 'api/exam/examinee/get-examinee-list',
    method: 'get',
    params
  })
}

export function addExaminee(params) {
  console.log(params)
  return request({
    url: 'api/exam/examinee/add-examinee',
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  })
}

export function getExaminee(id) {
  return request({
    url: 'api/exam/examinee/get-examinee/' + id,
    method: 'get'
  })
}

export function importExaminee() {
  return request({
    url: 'api/exam/examinee/import-examinee/',
    method: 'get'
  })
}

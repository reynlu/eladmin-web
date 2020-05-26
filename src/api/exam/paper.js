import request from '@/utils/request'

export function get(data) {
  return request({
    url: 'api/exam/paper/get-all-paper',
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/exam/paper/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/exam/paper/delete-all',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/exam/paper/update',
    method: 'put',
    data
  })
}

export function downloadJsonFile(data) {
  return request({
    url: 'api/exam/paper/download-json-file',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export default {
  get,
  add,
  edit,
  del,
  downloadJsonFile
}

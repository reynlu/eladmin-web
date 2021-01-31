import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ebag/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ebag/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ebag/update',
    method: 'put',
    data
  })
}

export default { add, edit, del }

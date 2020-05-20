import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/physicianInformation',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/physicianInformation/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/physicianInformation',
    method: 'put',
    data
  })
}

export function getPhysicianInformations(params) {
  return request({
    url: 'api/physician/get-physician-list',
    method: 'get',
    params
  })
}

export default { add, edit, del, getPhysicianInformations }

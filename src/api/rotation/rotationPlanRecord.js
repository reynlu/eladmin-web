import request from '@/utils/request'

export function rotationGroup(params) {
  return request({
    url: 'api/rotation-record/get-plan-group',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/rotationPlanRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/rotationPlanRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/rotationPlanRecord',
    method: 'put',
    data
  })
}

export default { add, edit, del }

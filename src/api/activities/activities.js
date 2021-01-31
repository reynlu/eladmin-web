import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/teaching-activities/add-teaching-activity',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/teaching-activities/delete-teaching-activities',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/teaching-activities/update-teaching-activities',
    method: 'put',
    data
  })
}

export function getTeachingActivities(params) {
  return request({
    url: 'api/teaching-activities/get-teaching-list',
    method: 'put',
    data: params
  })
}

export default { add, edit, del, getTeachingActivities }

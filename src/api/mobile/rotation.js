import request from '@/utils/request'

export function getRotationRecords(params) {
  console.log(params)
  return request({
    url: '/api/rotation-record/get-rotation-list',
    method: 'get',
    params
  })
}

export function getCurrentRotation(params) {
  console.log(params)
  return request({
    url: '/api/rotation-record/get-current-record',
    method: 'get',
    params
  })
}

export function updateRotation(params) {
  return request({
    url: '/api/rotation-record/update-rotation',
    method: 'put',
    data: params
  })
}

export function updateScheduleRotation(params) {
  return request({
    url: '/api/resident-schedule-record',
    method: 'post',
    data: params
  })
}

export function getSchedules(params) {
  return request({
    url: '/api/resident-schedule-record',
    method: 'get',
    params
  })
}

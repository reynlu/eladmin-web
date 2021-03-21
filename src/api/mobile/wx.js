import request from '@/utils/wx-request'

export function assignSchedule(params) {
  return request({
    url: 'wx-api/schedule-user?appId=3010011',
    method: 'post',
    data: params
  })
}

export function applyEvent(params) {
  return request({
    url: 'wx-api/apply-event?appId=3010040',
    method: 'post',
    data: params
  })
}

export function applyForLeave(params) {
  return request({
    url: 'wx-api/apply-for-leave?appId=3010040',
    method: 'post',
    data: params
  })
}

export function getApplyTemplete(params) {
  return request({
    url: 'wx-api/get-apply-template?appId=3010040',
    method: 'post',
    data: params
  })
}

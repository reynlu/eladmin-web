import request from '@/utils/wx-request'

export function assignSchedule(params) {
  return request({
    url: 'wx-api/schedule-user?appId=3010011',
    method: 'post',
    data: params
  })
}

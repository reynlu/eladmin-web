import request from '@/utils/request'

export function getRotationRecords(params) {
  console.log(params)
  return request({
    url: '/api/rotation-record/get-rotation-list',
    method: 'get',
    data: params
  })
}

import request from '@/utils/request'

export function getPhysician(params) {
  console.log(params)
  return request({
    url: '/api/physician/get-physician-by-id',
    method: 'get',
    params
  })
}

export function getPhysicians(params) {
  console.log(params)
  return request({
    url: '/api/physician/get-physicians',
    method: 'get',
    params
  })
}

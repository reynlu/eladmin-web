import request from '@/utils/request'

export function getAllDepatments(params) {
  console.log(params)
  return request({
    url: 'api/department/get-all-departments',
    method: 'get',
    params
  })
}

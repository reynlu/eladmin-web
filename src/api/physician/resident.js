import request from '@/utils/request'

export function getAllResident(params) {
  return request({
    url: 'api/resident/get-all-resident',
    method: 'get',
    params
  })
}

export default { getAllResident }

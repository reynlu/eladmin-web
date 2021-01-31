import request from '@/utils/request'

export function getDiagnosisRecords(params) {
  console.log(params)
  return request({
    url: '/api/resident-diagnosis-record/list',
    method: 'get',
    data: params
  })
}

export function addDiagnosisRecords(params) {
  console.log(params)
  return request({
    url: '/api/resident-diagnosis-record',
    method: 'post',
    data: params
  })
}

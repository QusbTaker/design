import request from '@/utils/request'

// 查询无人机飞行次数
export function getFlightStatisticsGroupByTime(query) {
  return request({
    url: '/uav/dataBoard/perception/getFlightStatisticsGroupByTime',
    method: 'get',
    params: query
  })
}

// 根据条件统计不同类型的救援设备数量 
export function getUavFunctionTypeNumber(query) {
  return request({
    url: '/system/uav/getUavFunctionTypeNumber',
    method: 'get',
    params: query
  })
}
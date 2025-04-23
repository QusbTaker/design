import request from '@/utils/request'

// 查询救援方案列表
export function listrescuePlan(query) {
  return request({
    url: '/uav/rescuePlan/list',
    method: 'get',
    params: query
  })
}

// 查询救援方案详细
export function getrescuePlan(postId) {
  return request({
    url: '/uav/rescuePlan/' + postId,
    method: 'get'
  })
}

// 新增救援方案
export function addrescuePlan(data) {
  return request({
    url: '/uav/rescuePlan',
    method: 'post',
    data: data
  })
}

// 修改救援方案
export function updaterescuePlan(data) {
  return request({
    url: '/uav/rescuePlan',
    method: 'put',
    data: data
  })
}

// 删除救援方案
export function delrescuePlan(postId) {
  return request({
    url: '/uav/rescuePlan/' + postId,
    method: 'delete'
  })
}

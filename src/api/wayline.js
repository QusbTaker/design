/*
 * @Author: 刘小满
 * @Date: 2024-10-21 09:15:12
 * @Descripttion: 
 */
import request from '@/utils/request'

// 查询航线管理列表
export function listWayLine(query) {
  return request({
    url: '/uav/manage/wayline/list',
    method: 'get',
    params: query
  })
}

// 查询航线管理详细
export function getWayLine(id) {
  return request({
    url: '/uav/manage/wayline/' + id,
    method: 'get'
  })
}

// 新增航线管理
export function addWayLine(data) {
  return request({
    url: '/uav/manage/wayline',
    method: 'post',
    data: data
  })
}

// 修改航线管理
export function updateWayLine(data) {
  return request({
    url: '/uav/manage/wayline',
    method: 'put',
    data: data
  })
}

// 删除航线管理
export function delWayLine(id) {
  return request({
    url: '/uav/manage/wayline/' + id,
    method: 'delete'
  })
}

// 生成临时航线文件
export function creaTetemporaryWaylineFile(data) {
  return request({
    url: '/uav/manage/wayline/creaTetemporaryWaylineFile',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询无人机管理列表
export function listUav(query) {
  return request({
    url: '/system/uav/list',
    method: 'get',
    params: query
  })
}

// 获取无人机管理详细信息
export function getUav(uavId) {
  return request({
    url: '/system/uav/' + parseStrEmpty(uavId),
    method: 'get'
  })
}

// 新增无人机管理
export function addUav(data) {
  return request({
    url: '/system/uav',
    method: 'post',
    data: data
  })
}

// 修改无人机管理
export function updateUav(data) {
  return request({
    url: '/system/uav',
    method: 'put',
    data: data
  })
}

// 删除无人机管理
export function delUav(uavId) {
  return request({
    url: '/system/uav/' + uavId,
    method: 'delete'
  })
}

/**
 *  查询无人机厂商列表
 * @returns 
 */
export function listUavModelManufacturer() {
  return request({
    url: '/system/uav/model/manufacturer/list',
    method: 'get',
  })
}

/**
 *  查询无人机型号列表
 * @param {*} uavManufacturer 厂商名称
 * @returns 
 */
export function listUavModel(data) {
  return request({
    url: '/system/uav/model/list',
    method: 'get',
    data
  })
}

/**
 * 用户绑定无人机-编辑
 * @param {*} userId  
 * @param {*} uavIds 
 * @returns 
 */
export function userBoundEdit(data) {
  return request({
    url: `/system/uav/userBound/edit/${data.userId}/${data.uavIds}`,
    method: 'get',
  })
}

/**
 * 获取无人机名字最新序号
 * @param {*} deptId  
 * @returns 
 */
export function uavGenerateNumber(deptId) {
  return request({
    url: `/system/uav/generateNumber/${deptId}`,
    method: 'get',
  })
}

/**
 * 用户绑定无人机-查看
 * @param { number }  userId  
 * @returns 
 */
export function userBoundFind(params) {
  return request({
    url: '/system/uav/userBound/find',
    method: 'get',
    params
  })
}

// 选择可执行任务的无人机列表
export function selectOptionalUavsList(query) {
  return request({
    url: '/uav/task/execute/selectOptionalUavs',
    method: 'get',
    params: query
  })
}
// 列表搜索筛选参数  无人机列表
export function userBoundSelect() {
  return request({
    url: `/system/uav/userBound/select`,
    method: 'get',
  })
}
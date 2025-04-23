import request from '@/utils/request'

// 查询消防任务列表
export function listTask(query) {
  return request({
    url: '/uav/task/list',
    method: 'get',
    params: query
  })
}

// 查询消防任务详细
export function getTask(taskId) {
  return request({
    url: '/uav/task/' + taskId,
    method: 'get'
  })
}

// 新增消防任务
export function addTask(data) {
  return request({
    url: '/uav/task',
    method: 'post',
    data: data
  })
}

// 修改消防任务
export function updateTask(data) {
  return request({
    url: '/uav/task',
    method: 'put',
    data: data
  })
}

// 删除消防任务
export function delTask(postId) {
  return request({
    url: '/uav/task/' + postId,
    method: 'delete'
  })
}


// 新增任务下发记录
export function addDistribution(data) {
  return request({
    url: '/uav/distribution',
    method: 'post',
    data: data
  })
}
// 查询待飞行消息下发记录列表
export function listDistribution(query) {
  return request({
    url: '/uav/distribution/list',
    method: 'get',
    params: query
  })
}
// 查询待飞行消息下发记录列表 根据设备分组
export function taskUavList(taskId) {
  return request({
    url: `/uav/distribution/taskUavList/${taskId}`,
    method: 'get',
  })
}

// 查询执待飞行消息下发详细
export function getDistribution(id) {
  return request({
    url: `/uav/distribution/${id}`,
    method: 'get'
  })
}

// 查询执行任务管理列表
export function listExecuteTask(query) {
  return request({
    url: '/uav/task/execute/list',
    method: 'get',
    params: query
  })
}

// 查询执行任务管理详细
export function getExecuteTask(id) {
  return request({
    url: '/uav/task/execute/' + id,
    method: 'get'
  })
}

// 新增执行任务管理
export function addExecuteTask(data) {
  return request({
    url: '/uav/task/execute',
    method: 'post',
    data: data
  })
}

// 修改执行任务管理
export function updateExecuteTask(data) {
  return request({
    url: '/uav/task/execute',
    method: 'put',
    data: data
  })
}

// 删除执行任务管理
export function delExecuteTask(id) {
  return request({
    url: '/uav/task/execute/' + id,
    method: 'delete'
  })
}

// 无人机执行任务的轨迹  只返坐标  高德
export function executeTaskTrack(taskExecuteId) {
  return request({
    url: '/uav/task/execute/track/coordinate/' + taskExecuteId,
    method: 'get',
  })
}
// 无人机执行任务的轨迹 返回坐标+航点信息   
export function executeTaskTrackInfo(taskExecuteId) {
  return request({
    url: '/uav/task/execute/track/info/' + taskExecuteId,
    method: 'get',
  })
}
// 无人机执行任务的轨迹 返回坐标+航点信息   
export function executeTaskOsdTrackInfo(taskExecuteId) {
  return request({
    url: '/uav/task/execute/osd/coordinate/' + taskExecuteId,
    method: 'get',
  })
}
// 执行任务操作记录
export function executeOperationInfo(taskExecuteId) {
  return request({
    url: '/uav/task/execute/operation/influx/' + taskExecuteId,
    method: 'get',
  })
}

// 无人机飞行  自检查询
export function uavMqttCheck(id) {
  return request({
    url: `/uav/task/execute/uavMqttCheck/${id}`,
    method: 'get',
  })
}
// 开始飞行
export function takeFlight(id) {
  return request({
    url: `/uav/task/execute/takeFlight/${id}`,
    method: 'get',
  })
}

// 结束飞行
export function endTaskExecute(params) {
  return request({
    url: `/uav/task/execute/endTaskExecute/${params.sn}/${params.taskExecuteId}`,
    method: 'get',
  })
}

export function getOperationListInflux(taskExecuteId) {
  return request({
    url: `/uav/task/execute/operation/influx/${taskExecuteId}`,
    method: 'get',
  })
}
export function getOperationListMysql(params) {
  return request({
    url: `/uav/task/execute/operation/mysql`,
    method: 'post',
    data: params
  })
}
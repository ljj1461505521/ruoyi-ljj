import request from '@/utils/request'
import server from "@/config/server";

// 月台信息 - 分页查询
export function paging(data) {
  return request({
    url: server.src + '/console/dock/paging',
    method: 'post',
    data: data
  })
}

//月台信息 -查询设备
export function mode_list() {
  return request({
    url: server.src + "/console/hik/encode_device/mode_code_list",
    method: 'get',
  })
}

// 月台信息 - 添加
export function add(data) {
  return request({
    url: server.src + '/console/dock/add',
    method: 'post',
    data: data
  })
}

// 月台信息 - 详情
export function info(data) {
  return request({
    url: server.src + '/console/dock/info',
    method: 'post',
    data: data
  })
}

// 月台信息 - 修改
export function update(data) {
  return request({
    url: server.src + '/console/dock/update',
    method: 'post',
    data: data
  })
}

// 月台信息 - 设置(修改)状态
export function update_status(data) {
  return request({
    url: server.src + '/console/dock/update_status',
    method: 'post',
    data: data
  })
}

// 月台信息 - 删除
export function deleteItem(data) {
  return request({
    url: server.src + '/console/dock/delete',
    method: 'delete',
    data: data
  })
}

// 月台调度信息 - 分页查询
export function dock_dispatch_paging(data) {
  return request({
    url: server.src + '/console/dock_dispatch/paging',
    method: 'post',
    data: data
  })
}

// 月台调度管理 - 手动调度
export function dock_dispatch_dispatch(data) {
  return request({
    url: server.src + '/console/dock_dispatch/dispatch',
    method: 'post',
    data: data
  })
}

//查询LED设备
export function mode_code_list() {
    return request({
      url: server.src + '/console/hik/encode_device/mode_code_list',
      method: 'get',
    })
  }
  //查询监控设备
export function camera_list(data) {
    return request({
      url: server.src + '/console/hik/encode_device/camera_list',
      method: 'post',
      data:data
    })
  }
  //查询关联月台设备
  export function platform_list() {
    return request({
      url: server.src+'/console/hik/encode_device/platform_list',
      method: 'get',
    })
  }
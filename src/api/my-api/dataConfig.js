import request from '@/utils/request'
import server from "@/config/server";

// 假日日期管理 - 添加
export function add(data) {
  return request({
    url:  server.src + '/console/date_calendar/holiday/add',
    method: 'post',
    data: data
  })
}

// 假日日期管理 - 删除
export function deleteItem(data) {
  return request({
    url:  server.src + '/console/date_calendar/holiday/delete',
    method: 'delete',
    data: data
  })
}

// 假日日期管理 - 详情
export function info(data) {
  return request({
    url:  server.src + '/console/date_calendar/holiday/info',
    method: 'post',
    data: data
  })
}

// 假日日期管理 - 分页查询
export function paging(data) {
  return request({
    url:  server.src + '/console/date_calendar/holiday/paging',
    method: 'post',
    data: data
  })
}

// 假日日期管理 - 修改
export function update(data) {
  return request({
    url:  server.src + '/console/date_calendar/holiday/update',
    method: 'put',
    data: data
  })
}
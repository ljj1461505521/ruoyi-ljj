import request from '@/utils/request'
import server from "@/config/server";

// 月台性质-列表
export function list(data) {
  return request({
    url:  server.src + '/console/dock_type/list',
    method: 'post',
    data: data
  })
}

// 月台性质-添加
export function add(data) {
  return request({
    url:  server.src + '/console/dock_type/add',
    method: 'post',
    data: data
  })
}

// 月台性质-删除
export function deleteItem(data) {
  return request({
    url:  server.src + '/console/dock_type/delete',
    method: 'delete',
    data: data
  })
}

// 月台性质-修改
export function update(data) {
  return request({
    url:  server.src + '/console/dock_type/update',
    method: 'post',
    data: data
  })
}
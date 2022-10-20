import request from '@/utils/request'
import server from "@/config/server";

// 帮助文档 - 添加
export function add(data) {
  return request({
    url:  server.src + '/console/help_doc/add',
    method: 'post',
    data: data
  })
}

// 帮助文档 - 删除
export function deleteItem(data) {
  return request({
    url:  server.src + '/console/help_doc/delete',
    method: 'delete',
    data: data
  })
}

// 帮助文档 - 详情
export function info(data) {
  return request({
    url:  server.src + '/console/help_doc/info',
    method: 'post',
    data: data
  })
}

// 帮助文档 - 分页
export function paging(data) {
  return request({
    url:  server.src + '/console/help_doc/paging',
    method: 'post',
    data: data
  })
}

// 帮助文档 - 修改
export function update(data) {
  return request({
    url:  server.src + '/console/help_doc/update',
    method: 'post',
    data: data
  })
}
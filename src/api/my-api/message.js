import request from '@/utils/request'
import server from "@/config/server";

// 消息通知 - 分页查询
export function paging(data) {
  return request({
    url: server.src + '/console/notice/paging',
    method: 'post',
    data: data
  })
}

// 消息通知 - 详情
export function messageInfo(data) {
  return request({
    url: server.src + '/console/notice/info',
    method: 'post',
    data: data
  })
}

// 消息通知 - 删除
export function deleteItem(data) {
  return request({
    url: server.src + '/console/notice/delete',
    method: 'delete',
    data: data
  })
}
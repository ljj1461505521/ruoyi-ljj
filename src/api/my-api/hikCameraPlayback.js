import request from '@/utils/request'
import server from "@/config/server";

// 海康监控回放 - 分页查询
export function page(data) {
  return request({
    url:  server.src + '/console/hik/camera_playback/paging',
    method: 'post',
    data: data
  })
}

// 海康监控回放 - 详情
export function info(data) {
  return request({
    url:  server.src + '/console/hik/camera_playback/info',
    method: 'post',
    data: data
  })
}

// 海康监控回放 - 删除
export function deleteItem(data) {
  return request({
    url:  server.src + '/console/hik/camera_playback/delete',
    method: 'delete',
    data: data
  })
}

// 海康监控回放 - 调取回访
export function submit(data) {
  return request({
    url:  server.src + '/console/hik/camera_playback/submit',
    method: 'post',
    data: data
  })
}
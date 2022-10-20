import request from '@/utils/request'
import server from "@/config/server";

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url:  server.src + '/monitor/jobLog/list',
    method: 'get',
    params: query
  })
}

// 删除调度日志
export function delJobLog(jobLogId) {
  return request({
    url:  server.src + '/monitor/jobLog/' + jobLogId,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url:  server.src + '/monitor/jobLog/clean',
    method: 'delete'
  })
}

// 导出调度日志
export function exportJobLog(query) {
  return request({
    url:  server.src + '/monitor/jobLog/export',
    method: 'get',
    params: query
  })
}
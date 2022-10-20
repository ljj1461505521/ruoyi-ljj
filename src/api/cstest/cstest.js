import request from '@/utils/request'
import server from "@/config/server";

// 查询测试列表
export function listCstest(query) {
  return request({
    url:  server.src + '/cstest/cstest/list',
    method: 'get',
    params: query
  })
}

// 查询测试详细
export function getCstest(id) {
  return request({
    url:  server.src + '/cstest/cstest/' + id,
    method: 'get'
  })
}

// 新增测试
export function addCstest(data) {
  return request({
    url:  server.src + '/cstest/cstest',
    method: 'post',
    data: data
  })
}

// 修改测试
export function updateCstest(data) {
  return request({
    url:  server.src + '/cstest/cstest',
    method: 'put',
    data: data
  })
}

// 删除测试
export function delCstest(id) {
  return request({
    url:  server.src + '/cstest/cstest/' + id,
    method: 'delete'
  })
}

// 导出测试
export function exportCstest(query) {
  return request({
    url:  server.src + '/cstest/cstest/export',
    method: 'get',
    params: query
  })
}
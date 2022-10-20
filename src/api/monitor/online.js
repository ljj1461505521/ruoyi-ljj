import request from '@/utils/request'
import server from "@/config/server";

// 查询在线用户列表
export function list(query) {
  return request({
    url:  server.src + '/monitor/online/list',
    method: 'get',
    params: query
  })
}

// 强退用户
export function forceLogout(tokenId) {
  return request({
    url:  server.src + '/monitor/online/' + tokenId,
    method: 'delete'
  })
}

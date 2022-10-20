import request from '@/utils/request'
import server from "@/config/server";

// 查询服务器详细
export function getServer() {
  return request({
    url:  server.src + '/monitor/server',
    method: 'get'
  })
}
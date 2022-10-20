import request from '@/utils/request'
import server from "@/config/server";

// 获取路由
export const getRouters = () => {
  return request({
    url: server.src+ '/getRouters',
    method: 'get'
  })
}
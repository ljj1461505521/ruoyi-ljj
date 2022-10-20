import request from '@/utils/request'
import server from "@/config/server";

// 配送商司机特殊名单管理 - 访客管理分页查询
export function paging(data) {
  return request({
    url: server.src + '/console/delivery_driver/special_list/paging',
    method: 'post',
    data: data
  })
}

// 配送商司机特殊名单管理 - 访客管理详情
export function info(data) {
  return request({
    url: server.src + '/console/delivery_driver/special_list/visitor/info',
    method: 'post',
    data: data
  })
}

// 配送商司机特殊名单管理 - 设置白名单
export function set_whitelist(data) {
  return request({
    url: server.src + '/console/delivery_driver/special_list/set_whitelist',
    method: 'post',
    data: data
  })
}

// 配送商司机特殊名单管理 - 设置黑名单
export function set_blacklist(data) {
  return request({
    url: server.src + '/console/delivery_driver/special_list/set_blacklist',
    method: 'post',
    data: data
  })
}

// 配送商司机特殊名单管理 - 移出白名单
export function remove_whitelist(data) {
  return request({
    url: server.src + '/console/delivery_driver/special_list/remove_whitelist',
    method: 'post',
    data: data
  })
}

// 配送商司机特殊名单管理 - 移出黑名单
export function remove_blacklist(data) {
  return request({
    url: server.src + '/console/delivery_driver/special_list/remove_blacklist',
    method: 'post',
    data: data
  })
}

// 配送商司机特殊名单管理 - 添加黑白名单信息
export function addWhiteBlackList(data) {
  return request({
    url: server.src + "/console/delivery_driver/special_list/add",
    method: 'post',
    data: data,
  })
}

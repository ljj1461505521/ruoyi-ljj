import request from '@/utils/request'
import server from "@/config/server";

// 配送商信息 - 查询用户列表
export function paging(data) {
  return request({
    url:  server.src + '/console/delivery_company/paging',
    method: 'post',
    data: data
  })
}

// 配送商信息 - 详情
export function info(data) {
  return request({
    url:  server.src + '/console/delivery_company/info',
    method: 'post',
    data: data
  })
}

// 配送商信息 - 暂存
export function storage(data) {
  return request({
    url:  server.src + '/console/delivery_company/storage',
    method: 'post',
    data: data
  })
}

// 配送商信息 - 提交
export function submit(data) {
  return request({
    url:  server.src + '/console/delivery_company/submit',
    method: 'post',
    data: data
  })
}

// 配送商信息 - 变更申请
export function change_apply(data) {
  return request({
    url:  server.src + '/console/delivery_company/change_apply',
    method: 'post',
    data: data
  })
}

// 配送商信息 - 删除
export function deleteInfo(data) {
  return request({
    url:  server.src + '/console/delivery_company/delete',
    method: 'delete',
    data: data
  })
}

// 配送商信息变更审核 - 审核
export function changeCheck(data) {
  return request({
    url:  server.src + '/console/delivery_company/change/check',
    method: 'post',
    data: data
  })
}

// 配送商信息变更审核 - 详情
export function changeInfo(data) {
  return request({
    url:  server.src + '/console/delivery_company/change/info',
    method: 'post',
    data: data
  })
}

// 配送商信息变更审核 - 分页
export function changePaging(data) {
  return request({
    url:  server.src + '/console/delivery_company/change/paging',
    method: 'post',
    data: data
  })
}
 
// 配送商信息登记审核 - 审核
export function registerCheck(data) {
  return request({
    url:  server.src + '/console/delivery_company/register/check',
    method: 'post',
    data: data
  })
}

// 配送商信息登记审核 - 详情
export function registerInfo(data) {
  return request({
    url:  server.src + '/console/delivery_company/register/info',
    method: 'post',
    data: data
  })
}

// 配送商信息登记审核 - 分页
export function registerPaging(data) {
  return request({
    url:  server.src + '/console/delivery_company/register/paging',
    method: 'post',
    data: data
  })
}
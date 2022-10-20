import request from '@/utils/request'
import server from "@/config/server";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: server.src + '/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: server.src + '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: server.src + '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: server.src + '/captchaImage',
    method: 'get'
  })
}
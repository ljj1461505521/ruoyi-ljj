import request from '@/utils/request'
import server from "@/config/server";


// 配送单预约设置 - 时段详情列表
export function configCancel(data) {
  return request({
    url: server.src + '/console/delivery_note/config/period_list_all',
    method: 'get',
    data: data
  })
}
// 配送单预约设置 - 字典详情列表
export function dictionaries() {
  return request({
    url: server.src + '/console/delivery_note/config/dict_all',
    method: 'get',
  })
}

// 配送单预约设置 - 设置保存
export function configUpdate(data) {
  return request({
    url: server.src + '/console/delivery_note/config/save',
    method: 'put',
    data: data
  })
}
// 配送单预约设置 - 月台性质详情
export function dock_type_list(data) {
  return request({
    url: server.src + '/console/delivery_note/config/period_dock_type_list',
    method: 'post',
    data: data
  })
}
// 配送预约单管理 - 取消
export function cancel(data) {
  return request({
    url: server.src + '/console/delivery_note/cancel',
    method: 'post',
    data: data
  })
}

// 配送预约单管理 - 修改变更
export function change(data) {
  return request({
    url: server.src + '/console/delivery_note/change',
    method: 'post',
    data: data
  })
}

// 配送预约单管理 - 审核
export function check(data) {
  return request({
    url: server.src + '/console/delivery_note/check',
    method: 'post',
    data: data
  })
}

// 配送预约单管理 - 详情
export function info(data) {
  return request({
    url: server.src + '/console/delivery_note/info',
    method: 'post',
    data: data
  })
}

// 配送预约单管理 - 分页查询
export function paging(data) {
  return request({
    url: server.src + '/console/delivery_note/paging',
    method: 'post',
    data: data
  })
}
// 配送预约单记录查询 - 导出
export function exportDeliveryNote(data) {
  return request({
    url: server.src + '/console/delivery_note/exportDeliveryNote',
    method: 'post',
    data: data
  })
}

// 配送预约单签到管理 - 分页查询
export function signPaging(data) {
  return request({
    url: server.src + '/console/delivery_note/sign/paging',
    method: 'post',
    data: data
  })
}

// 配送预约单签到管理 - 详情
export function signInfo(data) {
  return request({
    url: server.src + '/console/delivery_note/sign/info',
    method: 'post',
    data: data
  })
}

// 配送预约单调度管理 - 分页查询
export function dispatchPaging(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch/paging',
    method: 'post',
    data: data
  })
}

// 配送预约单调度管理 - 详情
export function dispatchInfo(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch/info',
    method: 'post',
    data: data
  })
}

// 配送预约单调度设置 - 保存设置
export function dispatchUpdate(data) {
  return request({
    url: server.src + '/console/delivery_note/config/update_dispatch',
    method: 'put',
    data: data
  })
}

// 配送预约单调度管理 - 手动调度
export function dispatch(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch/dispatch',
    method: 'post',
    data: data
  })
}
// 配送预约单调度管理 -插队
export function insertTeam(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch/dispatch_infix/default',
    method: 'post',
    data: data
  })
}

// 配送预约单调度管理 -继续下一个作业
export function nextWork(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch/dispatch_infix/continue_work',
    method: 'post',
    data: data
  })
}

//配送预约调度管理 -取消调度
export function cancelDispatch(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch/cancel',
    method: 'post',
    data: data
  })
}

// 配送预约单放行管理 - 分页查询
export function releasePaging(data) {
  return request({
    url: server.src + '/console/delivery_note/release/paging',
    method: 'post',
    data: data
  })
}

// 配送预约单放行管理 - 详情
export function releaseInfo(data) {
  return request({
    url: server.src + '/console/delivery_note/release/info',
    method: 'post',
    data: data
  })
}
// 配送预约单放行设置 - 保存设置
export function releaseUpdate(data) {
  return request({
    url: server.src + '/console/delivery_note/config/update_release',
    method: 'put',
    data: data
  })
}

// 配送预约单放行管理 - 放行登记
export function releaseRegister(data) {
  return request({
    url: server.src + '/console/delivery_note/release/register',
    method: 'post',
    data: data
  })
}

// 配送预约单放行管理 - 手动放行
export function releaseRelease(data) {
  return request({
    url: server.src + '/console/delivery_note/release/release',
    method: 'post',
    data: data
  })
}
//照片
export function init_register(data) {
    return request({
      url: server.src + '/console/delivery_note/release/init_register',
      method: 'post',
      data: data
    })
  }

// 配送预约单调度记录管理 - 分页查询
export function recordPaging(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch_record/paging',
    method: 'post',
    data: data
  })
}

// 配送预约单调度记录管理 - 详情
export function recordInfo(data) {
  return request({
    url: server.src + '/console/delivery_note/dispatch_record/info',
    method: 'post',
    data: data
  })
}

// 手动签到
export function manualSign(data) {
  return request({
    url: server.src + '/console/delivery_note/manual_sign',
    method: 'post',
    data: data
  })
}


// 手动放行
export function manualRelease(data) {
  return request({
    url: server.src + '/console/delivery_note/release/manual_release',
    method: 'post',
    data: data
  })
}
import request from '@/utils/request'
import server from "@/config/server";
//  根据邮箱查询用户
export function query_user(data) {
    return request({
        url: server.src + '/common/email_code/query_user',
        method: 'get',
        params: data,
    })
}
//发送验证码
export function send_code(data) {
    return request({
        url: server.src + '/common/email_code/send_code',
        method: 'post',
        data: data,
    })
}

//校验验证码
export function check_code(data) {
    return request({
        url: server.src + "/common/email_code/check_code",
        method: "post",
        data: data
    })
}
//邮箱校验验证码并重置密码
export function resetPwdAndEmailCodeCheck(data) {
    return request({
        url: server.src + "/common/user/resetPwdAndEmailCodeCheck",
        method: "put",
        data: data
    })
}
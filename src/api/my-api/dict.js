import request from '@/utils/request'
import server from "@/config/server";

// 查询字典数据详细
export function dictCode(dictCode) {
  return request({
    url:  server.src + '/common/dict/'+dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function dictType(dictType) {
  return request({
    url:  server.src + '/common/dict/type/'+dictType,
    method: 'get'
  })
}
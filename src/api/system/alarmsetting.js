import request from '@/utils/request'
import server from "@/config/server";

export function updateAlarm(query) {
    return request({
        url: server.src + '/console/delivery_note/config/update_alarm_display',
        method: 'put',
        data: query
    })
}
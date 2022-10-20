import axios from "axios";
import { getToken } from "@/utils/auth";
import server from "@/config/server";
import qs from "qs";


const mimeMap = {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    zip: "application/zip"
};
const baseUrl = server.src;
export function downLoadZip(str, filename, data) {
    // return
    var url = baseUrl + str;
    console.log(data);
    axios({
        method: "post",
        url: url,
        responseType: "blob",
        data: data,
        headers: {
            'Authorization': "Bearer " + getToken()
        },
        // paramsSerializer: function (params) {
        //     return qs.stringify(params, { allowDots: true })
        // }
    }).then(res => {
        resolveBlob(res, filename);
    });
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, filename) {
    console.log(filename);
    const aLink = document.createElement("a");
    var blob = new Blob([res.data]);
    // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    var contentDisposition = decodeURI(res.headers["content-disposition"]);

    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute("download", filename); // 设置下载文件名称
    document.body.appendChild(aLink);
    aLink.click();
    document.body.appendChild(aLink);
}

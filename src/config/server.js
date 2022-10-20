/*export default {
  //正式
  /!*src:'http://www.szgajbjl.cn',
  imgSrc:'http://www.szgajbjl.cn/samples/accessory/listPicture?picture=',*!/


  //本地
  src:'http://localhost:9000',
 // imgSrc:'http://192.168.1.99:8081/samples/accessory/listPicture?picture=',
  target:'http://192.168.1.240:8087',//代理地址
}*/

// 广贞 ip
// let ip = "192.168.1.108"
// let src = `http://${ip}:18191`;
// let target = `http://${ip}:18191`
// let ws = `ws://${ip}:18191`;

//文进 ip
// let ip = "192.168.1.74"
// let src = `http://${ip}:18191`;
// let target = `http://${ip}:18191`
// let ws = `ws://${ip}:18191`;

// 大佬ip  http://meixin.gawoo.net:7011
// let ip = "meixin.gawoo.net"
// let src = `http://${ip}:7011`;
// let target = `http://${ip}:7011`;

// 测试服务器ip
// let ip = "192.168.1.231"
// let src = `http://${ip}:18191`;
// let target = `http://${ip}:18191`;
// let ws = `ws://${ip}:18191`;

// 测试环
// let src = "https://jmfvvm.mxitres.com:8001/api";
// let target = `https://jmfvvm.mxitres.com:8001/api`;
// let ws = `wss://jmfvvm.mxitres.com:8001`;

// 正式环境
// let src = "https://jmfvvm.mxitres.com/api";
// let target = `https://jmfvvm.mxitres.com/api`;
// let ws = `wss://jmfvvm.mxitres.com`;

module.exports = {
  src: process.env.VUE_APP_TARGET,
  ws: process.env.VUE_APP_WS,
  // imgSrc:'http://192.168.1.99:8081/samples/accessory/listPicture?picture=',
  target: process.env.VUE_APP_TARGET, //代理地址http://192.168.1.240:8087
}

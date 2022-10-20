<template>
  <div class="test"></div>
</template>

<script>
import server from "@/config/server";
import { getToken } from "@/utils/auth";
import store from "@/store";
import Stomp from "stompjs";
export default {
  name: "test",
  data() {
    return {
      websock: null,
      reconnectData: null,
      lockReconnect: false, //避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 10000, //10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null,
    };
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
        return;
      }
      console.log("启动中");
      let wsurl = `${server.ws}/socket_point?Authorization=${getToken()}`;
      this.websock = new WebSocket(wsurl);
      var stompClient = null;
      // const websock = new WebSocket(wsurl);
      console.log(Stomp);
      stompClient = Stomp.over(this.websock);
      stompClient.connect({}, function (frame) {
        // 消息通知 广播订阅 例：用于系统类消息通知推送
        stompClient.subscribe("/topic/notice", function (response) {
          console.log(response);
        });

        // 消息通知 一对一订阅 例：用于业务类消息精准推送
        // 后台用户取username
        // 司机端用户取  id
        stompClient.subscribe(
          "/queue/" + store.getters.name + "/notice",
          function (respnose) {
            if(respnose.body){
                this.$emit("getNotice", JSON.parse(JSON.parse(respnose.body).message));
            }
          }
        );
      });
      // this.websock.onopen = this.websocketonopen; //连接成功
      // this.websock.onmessage = this.websocketonmessage; //广播成功
      // this.websock.onerror = this.websocketonerror; //连接断开，失败
      // this.websock.onclose = this.websocketclose; //连接关闭
    }, //初始化weosocket
    websocketonopen() {
      console.log("连接成功");
      this.heatBeat();
    }, //连接成功
    websocketonerror() {
      console.log("连接失败");
      this.reconnect();
    }, //连接失败
    websocketclose() {
      console.log("断开连接");
      this.reconnect();
    }, //各种问题导致的 连接关闭
    websocketonmessage(data) {
      console.log(data);
      this.heatBeat(); //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
    }, //数据接收
    websocketsend(data) {
      console.log(data);
      this.websock.send(JSON.stringify(data));
    }, //数据发送
    reconnect() {
      if (this.lockReconnect) {
        //这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return;
      }
      this.lockReconnect = true;
      this.reconnectData && clearTimeout(this.reconnectData);
      this.reconnectData = setTimeout(() => {
        this.initWebSocket();
        this.lockReconnect = false;
      }, 5000);
    }, //socket重连
    heatBeat() {
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(() => {
        this.websocketsend({}); //根据后台要求发送
        this.serverTimeoutObj = setTimeout(() => {
          this.websock.close(); //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
        }, 5000);
      }, this.timeout);
    }, //心跳检测
  },
  destroyed() {
    this.lockReconnect = true;
    this.websock.close(); //离开路由之后断开websocket连接
    clearTimeout(this.reconnectData); //离开清除 timeout
    clearTimeout(this.timeoutObj); //离开清除 timeout
    clearTimeout(this.serverTimeoutObj); //离开清除 timeout
  },
};
</script>
<style lang='less'>
</style>
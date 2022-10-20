<template>
  <div class="test"></div>
</template>

<script>
// 安装并引入相关模块
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import server from "@/config/server";
import { getToken } from "@/utils/auth";
import store from "@/store";
export default {
  data() {
    return {
      dataList: []
    };
  },
  mounted: function() {
    this.initWebSocket();
  },
  beforeDestroy: function() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    initWebSocket() {
      this.connection();
      let self = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send("test");
        } catch (err) {
          console.log("断线了: " + err);
          self.connection();
        }
      }, 5000);
    },
    removeTab(targetName) {
      console.log(targetName);
    },
    connection() {
      const url = `${server.src}/socket_point?Authorization=${getToken()}`;
      let username = store.getters.name;
      // 建立连接对象
      this.socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息,按需求配置
      var headers = {
        login: "mylogin",
        passcode: "mypasscode",
        // additional header
        "client-id": "my-client-id"
      };
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          this.stompClient.subscribe("/topic/notice", msg => {
            // 订阅服务端提供的某个topic
            console.log(msg);
          });

          // 消息通知 一对一订阅 例：用于业务类消息精准推送
          // 后台用户取username
          // 司机端用户取  id
          this.stompClient.subscribe("/queue/" + username + "/notice", msg => {
            console.log(msg);
          });
        },
        err => {
          // 连接发生错误时的处理函数
          console.log(err);
        }
      );
    },
    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    }
  }
};
</script>
<style lang='less'>
</style>

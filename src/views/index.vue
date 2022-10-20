<template>
  <!-- <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div> -->
  <!-- <div>登入系统成功</div> -->
  <div class="all-content">
    <div class="content">
      <div class="title">常用导航</div>
      <div class="item">
        <div
          :class="['item-list']"
          @click="goNotice"
          v-if="roles.includes('消息中心')"
        >
          <i class="el-icon-message icon"></i>
          <div class="tit">消息中心</div>
        </div>
        <div
          :class="['item-list']"
          @click="goDeliverNode"
          v-if="roles.includes('预约管理')"
        >
          <i class="el-icon-s-order icon"></i>
          <div class="tit">预约管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goDispatch"
          v-if="roles.includes('调度管理')"
        >
          <i class="el-icon-s-operation icon"></i>
          <div class="tit">调度管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goRelease"
          v-if="roles.includes('放行管理')"
        >
          <svg-icon icon-class="cheliangxinxi" class="icon" />
          <div class="tit">放行管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goSpecialList"
          v-if="roles.includes('黑白名单管理')"
        >
          <i class="el-icon-s-custom icon"></i>
          <div class="tit">黑白名单管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goDockType"
          v-if="roles.includes('月台性质')"
        >
          <svg-icon icon-class="yuetaiguanli" class="icon" />
          <div class="tit">月台性质</div>
        </div>
        <div
          :class="['item-list']"
          @click="goDock"
          v-if="roles.includes('月台管理')"
        >
          <svg-icon icon-class="yuyueyuetai-yimidida-" class="icon" />
          <div class="tit">月台信息</div>
        </div>
        <div
          :class="['item-list']"
          @click="goRecord"
          v-if="roles.includes('预约记录查询')"
        >
          <i class="el-icon-s-data icon"></i>
          <div class="tit">预约记录查询</div>
        </div>
        <div
          :class="['item-list']"
          @click="goCarRecord"
          v-if="roles.includes('车辆月台出入记录')"
        >
          <i class="el-icon-document icon"></i>
          <div class="tit">车辆月台出入记录</div>
        </div>
        <div
          :class="['item-list']"
          @click="goCamera"
          v-if="roles.includes('监控查询')"
        >
          <i class="el-icon-video-camera icon"></i>
          <div class="tit">监控查询</div>
        </div>
        <div
          :class="['item-list']"
          @click="goUser"
          v-if="roles.includes('用户管理')"
        >
          <i class="el-icon-user-solid icon"></i>
          <div class="tit">用户管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goRoles"
          v-if="roles.includes('角色管理')"
        >
          <svg-icon icon-class="jueseguanli" class="icon" />
          <div class="tit">角色管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goMenu"
          v-if="roles.includes('菜单管理')"
        >
          <i class="el-icon-menu icon"></i>
          <div class="tit">菜单管理</div>
        </div>
        <div
          :class="['item-list']"
          @click="goOperlog"
          v-if="roles.includes('操作日志')"
        >
          <i class="el-icon-tickets icon"></i>
          <div class="tit">操作日志</div>
        </div>
        <div
          :class="['item-list']"
          @click="goLogin"
          v-if="roles.includes('登录日志')"
        >
          <i class="el-icon-tickets icon"></i>
          <div class="tit">登录日志</div>
        </div>
        <div
          :class="['item-list']"
          @click="goNoteRezConfig"
          v-if="roles.includes('预约设置')"
        >
          <i class="el-icon-s-tools icon"></i>
          <div class="tit">预约设置</div>
        </div>
        <div
          :class="['item-list']"
          @click="goDispatchSetting"
          v-if="roles.includes('调度设置')"
        >
          <i class="el-icon-coordinate icon"></i>
          <div class="tit">调度设置</div>
        </div>
        <div
          :class="['item-list']"
          @click="goReleaseSettings"
          v-if="roles.includes('放行设置')"
        >
          <svg-icon icon-class="release" class="icon" />
          <div class="tit">放行设置</div>
        </div>
        <div
          :class="['item-list']"
          @click="goAlarmSetting"
          v-if="roles.includes('报警设置')"
        >
          <i class="el-icon-bell icon rote"></i>
          <div class="tit">报警设置</div>
        </div>
        <div
          :class="['item-list']"
          @click="goDate"
          v-if="roles.includes('假日设置')"
        >
          <i class="el-icon-date icon"></i>
          <div class="tit">假日设置</div>
        </div>
        <div
          :class="['item-list']"
          @click="goHelpDocs"
          v-if="roles.includes('帮助说明')"
        >
          <i class="el-icon-s-opportunity icon"></i>
          <div class="tit">帮助说明</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import { getRouters } from "@/api/menu.js";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      // menu: [],
      roles: [],
      // flag: undefined,
      roles2: [],
    };
  },
  methods: {
    // changColor(num) {
    //   this.flag = num;
    // },
    // getMenu(data) {
    //   for (let i in data) {
    //     // console.log(data[i].meta.title);
    //     this.roles.push(data[i].meta.title);
    //     // console.log(this.roles);
    //     if (data[i].children) {
    //       this.getMenu(data[i].children);
    //     }
    //   }
    // },
    getMenu1(data) {
      for (let i in data) {
        if (!data[i].hidden) {
          if (data[i].meta.title == "预约管理" && !!data[i].children) {
            data[i].meta.title = "预约管理111";
          }
          this.roles.push(data[i].meta.title);
          if (data[i].children) {
            this.getMenu1(data[i].children);
          }
        }
      }
      console.log(this.kk);
    },

    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    goDeliverNode() {
      this.$router.push({
        path: "/deliveryNoteRezConfig/deliveryNote",
      });
    },
    goDispatch() {
      this.$router.push({
        path: "/deliveryNoteRezConfig/deliveryNoteDispatch",
      });
    },
    goRelease() {
      this.$router.push({
        path: "/deliveryNoteRezConfig/deliveryNoteRelease",
      });
    },
    goNotice() {
      this.$router.push({
        path: "/newNotice",
      });
    },
    goDate() {
      this.$router.push({
        path: "/systemSetting/dateCalendar",
      });
    },
    goCamera() {
      this.$router.push({
        path: "/reportQuery/hikCameraPlayback",
      });
    },
    goRoles() {
      this.$router.push({
        path: "/system/role",
      });
    },
    goDock() {
      this.$router.push({
        path: "/dockManagement/dock",
      });
    },
    goSpecialList() {
      this.$router.push({
        path: "/deliveryDriverSpecialList",
      });
    },
    goDockType() {
      this.$router.push({
        path: "/dockManagement/dockType",
      });
    },
    goRecord() {
      this.$router.push({
        path: "/reportQuery/query/appointmentRecord",
      });
    },
    goCarRecord() {
      this.$router.push({
        path: "/reportQuery/query/carRecord",
      });
    },
    goUser() {
      this.$router.push({
        path: "/system/user",
      });
    },
    goMenu() {
      this.$router.push({
        path: "/system/menu",
      });
    },
    goDict() {
      this.$router.push({
        path: "/system/dict",
      });
    },
    goOperlog() {
      this.$router.push({
        path: "/system/log/operlog",
      });
    },
    goLogin() {
      this.$router.push({
        path: "/system/log/logininfor",
      });
    },
    goNoteRezConfig() {
      this.$router.push({
        path: "/systemSetting/deliveryNoteRezConfig",
      });
    },
    goDispatchSetting() {
      this.$router.push({
        path: "/systemSetting/dispatchSetting",
      });
    },
    goReleaseSettings() {
      this.$router.push({
        path: "/systemSetting/releaseSettings",
      });
    },
    goAlarmSetting() {
      this.$router.push({
        path: "/systemSetting/alarmSetting",
      });
    },
    goHelpDocs() {
      this.$router.push({
        path: "/systemSetting/helpDocs",
      });
    },
  },
  created() {
    getRouters().then((res) => {
      console.log(res.data);
      // let menu = res.data;
      // this.getMenu(res.data);
      this.getMenu1(res.data);
    });
  },
};
</script>

<style lang="scss" scoped>
// @media screen and (max-device-width: 1366px) {
// }
@media screen and (min-width: 1920px) {
  .item {
    max-width: 1628px;
    .item-list {
      height: 160px !important;
      .tit {
        font-size: 18px !important;
      }
    }
  }
}
.item-list:hover {
  background-color: #0080ff !important;
  color: #fff;
  overflow: hidden;
  i {
    color: #fff !important;
  }
  svg {
    filter: drop-shadow(#ffffff 170px 0) !important;
    transform: translateX(-170px);
  }
}
.all-content {
  width: 100%;
  min-height: calc(100vh - 125px);
  background-color: #f2f2f2;
}
.content {
  // top: 0;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  width: 100%;

  .title {
    font-size: 30px;
    font-weight: 500;
    color: #000;
    margin-top: 45px;
  }
  // .clickColor {
  //   background-color: #0080ff;
  //   color: #fff;
  //   i {
  //     color: #fff !important;
  //   }
  // }
  .item {
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    // align-items: center;
    width: 90%;
    min-width: 1067px;
    // width: 100%;
    // height: 400px;
    margin-top: 40px;
    .item-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 12.2%;
      height: 125px;
      margin: 12px 1%;
      border: 1px solid #ccc;
      background-color: #fff;
      cursor: pointer;
      .icon {
        font-size: 44px;
        color: #ccc;
      }

      .rote {
        transform: rotate(45deg);
        margin-bottom: 10px;
      }
      .tit {
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

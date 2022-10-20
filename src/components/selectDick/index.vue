<template>
  <!-- 月台列表 -->
  <el-dialog
    width="620px"
    title="选择月台"
    :visible.sync="showPlatformList"
    @open="getPlatform"
    append-to-body
    @closed="onClose"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-row type="flex" justify="center">
      <el-input
        v-model="searchDock.dockName"
        placeholder="请输入月台名称"
        prefix-icon="el-icon-search"
        style="width:320px;margin-right:12px;"
      />
      <el-button type="primary" @click="getPlatform">搜索</el-button>
    </el-row>
    <el-table
      :data="platformList"
      border
      v-loading="loading"
      @current-change="clickChange"
      style="width: 100%;margin-top:12px;"
    >
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-radio v-model="tableRadio" :label="scope.row">
            <i></i>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="月台名称" width="380" align="center"></el-table-column>
      <el-table-column prop="status" label="月台状态" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end" style="margin-top:12px;">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentDockChange"
        :current-page="searchDock.pageNum"
        :page-size="searchDock.pageSize"
        :total="platformTotal"
      ></el-pagination>
    </el-row>
    <el-row type="flex" justify="end" style="margin-top:12px;">
      <el-button @click="onClose" plain>关闭</el-button>
      <el-button :disabled="!tableRadio.id" type="primary" @click="sureSelectDock">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { dock_dispatch_paging } from "@/api/my-api/platform.js";
export default {
  props: ["showPlatformList"],
  data() {
    return {
      platformList: [],
      platformTotal: 0,
      tableRadio: {},
      searchDock: {
        dockName: undefined,
        pageNum: 1,
        pageSize: 10
      },
      loading: false
    };
  },
  methods: {
    getPlatform() {
      this.loading = true;
      const { dockName, status, pageNum, pageSize } = this.searchDock;
      let params = {
        condition: {
          dockName,
          status
        },
        pageNum,
        pageSize
      };
      dock_dispatch_paging(params).then(res => {
        this.platformList = res.rows;
        this.platformTotal = parseInt(res.total);
        this.loading = false;
      });
    },
    // 月台单选
    clickChange(item) {
      this.tableRadio = item;
    },
    handleCurrentDockChange(val) {
      this.searchDock.pageNum = val;
      this.getPlatform();
    },
    sureSelectDock() {
      this.$emit("sureSelectDock", this.tableRadio.dockId);
    },
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>

<style>
</style>
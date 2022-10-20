<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="月台名称：" prop="dockName">
        <el-input
          v-model="searchForm.dockName"
          placeholder="请输入月台名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="监控日期：" prop="time">
        <el-date-picker
          v-model="searchForm.time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('searchForm')"
          icon="el-icon-search"
          >查询</el-button
        >
        <el-button @click="resetForm('searchForm')" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 22px">
      <el-button icon="el-icon-plus" type="primary" @click="getCamera = true"
        >调取</el-button
      >
      <el-button icon="el-icon-delete" type="danger" @click="deleteItem"
        >删除</el-button
      >
    </el-row>

    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="createTime" label="日期" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.beginTime) }} -
          {{ parseTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="dockName"
        label="月台"
        align="center"
      ></el-table-column>
      <el-table-column prop="devCameraName" label="文件名" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="showVideo(scope.row)">{{
            scope.row.devCameraName
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="操作账户"
        align="center"
      ></el-table-column>
      <el-table-column prop="submitTime" label="调取时间" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.submitTime, "{h}:{i}") }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end" style="margin-top: 12px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 50, 100, 500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>
    <!-- 调取监控 -->
    <el-dialog :title="'调取监控'" :visible.sync="getCamera" width="520px">
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <el-row type="flex" justify="center">
          <el-form-item label="日期：" prop="time" label-width="80px">
            <el-date-picker
              v-model="addValue.time"
              type="date"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center">
          <el-form-item label="月台：" prop="name" label-width="80px">
            <el-select
              v-model="addValue.name"
              placeholder="请选择月台"
              style="width: 220px"
            >
              <el-option
                v-for="(item, index) in dockName"
                :key="index"
                :value="item.id"
                :label="item.dockName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button plain @click="getCamera = false">关闭</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </el-row>
    </el-dialog>

    <!-- 查看监控 -->
    <el-dialog :title="'查看监控'" :visible.sync="showCamera" width="520px">
      <el-row :gutter="24">
        <el-col :span="24"
          >日期：{{ parseTime(cameraInfo.beginTime) }} -
          {{ parseTime(cameraInfo.endTime) }}</el-col
        >
        <el-col :span="24">月台：{{ cameraInfo.dockName }}</el-col>
        <el-col :span="24" style="margin-top: 12px">
          <label style="vertical-align: top; font-weight: inherit"
            >图片/视频:</label
          >
          <div class="video-box">
            <video-player
              v-if="showCamera"
              :idIndex="1"
              :url="cameraInfo.streamUrl"
            ></video-player>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  paging
} from "@/api/my-api/platform";
import { page, submit } from "@/api/my-api/hikCameraPlayback";
import videoPlayer from "@/components/videoPlayer";

export default {
  components: { videoPlayer },
  data () {
    return {
      searchForm: {
        dockName: undefined,
        time: undefined,
      },
      rules: {
        time: [{ required: true, message: "请输入日期", trigger: "blur" }],
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      getCamera: false,
      addValue: {
        name: undefined,
        cars: [{ name: "" }],
        drivers: [{ name: "" }],
      },
      showCamera: false,
      dockName: [],
      cameraInfo: {}
    };
  },
  created () {
    paging({
      condition: {},
      pageNum: 1,
      pageSize: 10,
    }).then(res => {
      console.log(res)
      let data = res.rows;
      let arr = [];
      for (let i in data) {
        let obj = {};
        obj.dockName = data[i].dockName;
        obj.id = data[i].id;
        arr.push(obj);
      }
      this.dockName = [...arr];

    })
    this.getList();
  },
  methods: {
    getList () {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      if (condition.time) {
        condition.minSubmitTime = condition.time[0];
        condition.maxSubmitTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minSubmitTime;
        delete condition.maxSubmitTime;
      }
      const params = {
        condition,
        pageNum,
        pageSize,
        sorting: {},
      };
      page(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = parseInt(res.total);
          this.loading = false;
        } else {
          this.$message({
            type: "info",
            message: res.msg,
          });
        }
      });
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submit () {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          const { addValue: { time, name } } = this
          const params = {
            date: time,
            dockId: name
          }
          submit(params).then(res => {
            this.getCamera = false
            this.getList()
          })
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    //查看详情
    getDetail (item) {
      this.getCamera = true;
    },
    // 查看录像
    showVideo (info) {
      window.open('https://zhidao.baidu.com','_blank');
      // this.cameraInfo = info
      // this.showCamera = true
    },
    //删除
    deleteItem (item) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => { });
    },
    // 分页
    handleSizeChange (val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-title {
  background-color: #f4f8ff;
  padding: 12px 8px;
  margin-bottom: 12px;
}
.driverList .item,
.carList .item {
  width: 80%;
  position: relative;
  .config {
    position: absolute;
    top: 18px;
    right: -108px;
    .add,
    .delete {
      font-size: 40px;
      cursor: pointer;
    }
    .add {
      color: green;
    }
    .delete {
      color: red;
    }
  }
}
.detail-box {
  table {
    width: 85%;
    margin: 0 auto 12px;
    border-collapse: collapse;
    border: none;
    td {
      width: 50%;
      border: solid #d7d7d7 1px;
      padding: 12px 6px;
    }
    .c-td {
      height: 140px;
      overflow-y: auto;
    }
    .content {
      width: 100%;
      height: 100%;
      .words {
        text-indent: 2em;
        margin-top: 12px;
      }
    }
  }
}
.video-box{
    width: 100%;
    height: 400px;
}
</style>
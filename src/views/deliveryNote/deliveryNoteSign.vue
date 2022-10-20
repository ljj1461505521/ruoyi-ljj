<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="司机姓名：" prop="dyDriverRealName">
        <el-input
          v-model="searchForm.dyDriverRealName"
          placeholder="请输入司机姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="司机手机号：" prop="dyDriverPhone">
        <el-input
          v-model="searchForm.dyDriverPhone"
          placeholder="请输入司机手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="预约号：" prop="rezNumber">
        <el-input
          v-model="searchForm.rezNumber"
          placeholder="请输入预约号"
        ></el-input>
      </el-form-item>
      <el-form-item label="车牌号：" prop="dyVehicleLicensePlate">
        <el-input
          v-model="searchForm.dyVehicleLicensePlate"
          placeholder="请输入车牌号"
        ></el-input>
      </el-form-item>
      <el-form-item label="签到时间：" prop="time">
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
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        prop="rezNumber"
        label="预约号"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dyCompanyName"
        label="公司名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dyVehicleLicensePlate"
        label="车牌号"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dyDriverRealName"
        label="司机姓名"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dyDriverPhone"
        label="手机号"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column prop="date" label="预约时间" width="230" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rezSubmitTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="签到时间" width="230" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="操作"
        align="center"
        width="180"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="getDetail(scope.row.id, 1)"
            >查看</el-button
          >
          <el-button size="mini" type="text" @click="getDetail(scope.row.id, 2)"
            >手动调度</el-button
          >
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
    <!-- 详情 -->
    <el-dialog
      :title="'签到详情'"
      :visible.sync="showDetail"
      width="720px"
      @closed="addValue = {}"
    >
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <el-row class="detail-box">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="detail-title"
          >
            <el-col>入场信息</el-col>
          </el-row>
          <!-- 入场信息 -->
          <table>
            <tbody>
              <tr>
                <td colspan="2">
                  预约时间：{{ parseTime(addValue.dyVehicleRezEndTime) }}
                  {{ addValue.rezStartTime }}至{{ addValue.rezEndTime }}
                </td>
              </tr>
              <tr>
                <td colspan="2">入场事由：{{ findName(addValue.rezType) }}</td>
              </tr>
              <tr>
                <td colspan="2" class="c-td">
                  <el-row class="content">
                    <el-col :span="24">备注：</el-col>
                    <el-col :span="24">
                      <el-input
                        :value="addValue.rezRemark"
                        :disabled="true"
                        type="textarea"
                        :rows="3"
                        style="margin-top: 12px"
                      />
                    </el-col>
                  </el-row>
                </td>
              </tr>
              <tr>
                <td>审核人：{{ addValue.checkBy || "-" }}</td>
                <td>状态：{{ getStatusNameByRows(addValue) || "-" }}</td>
              </tr>
              <tr>
                <td>审核通过时间：{{ parseTime(addValue.checkTime) }}</td>
                <td>原因：{{ addValue.rezTypeName || "-" }}</td>
              </tr>
              <tr>
                <td>签到时间：{{ parseTime(addValue.signTime) }}</td>
                <td>签到门岗：{{ addValue.signGate || "-" }}</td>
              </tr>
              <tr>
                <td>验证方式：{{ addValue.signType || "-" }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <!-- 配送商信息 -->
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="detail-title"
          >
            <el-col>配送商信息</el-col>
          </el-row>
          <table>
            <tbody>
              <tr>
                <td>预约号：{{ addValue.rezNumber || "-" }}</td>
                <td>类型：{{ addValue.rezTypeName || "-" }}</td>
              </tr>
              <tr>
                <td>公司名称：{{ addValue.dyCompanyName || "-" }}</td>
                <td>司机电话：{{ addValue.dyDriverPhone || "-" }}</td>
              </tr>
              <tr>
                <td>司机姓名：{{ addValue.dyDriverRealName || "-" }}</td>
                <td>车辆类型：{{ addValue.dyVehicleVehicleType || "-" }}</td>
              </tr>
              <tr>
                <td>身份证号：{{ addValue.dyDriverCardNo || "-" }}</td>
                <td>车牌号码：{{ addValue.dyVehicleLicensePlate || "-" }}</td>
              </tr>
              <tr>
                <td>
                  <el-row :gutter="12">
                    <el-col :span="24">身份证（正面）：</el-col>
                    <el-col :span="24">
                      <img
                        :src="addValue.dyDriverCardFront"
                        style="max-width: 100%"
                      />
                    </el-col>
                  </el-row>
                </td>
                <td>
                  <el-row :gutter="12">
                    <el-col :span="24">人员图片：</el-col>
                    <el-col :span="24">
                      <img
                        :src="addValue.dyDriverPhotoFace"
                        style="max-width: 100%"
                      />
                    </el-col>
                  </el-row>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 随行人员信息 -->
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="detail-title"
          >
            <el-col>随行人员信息</el-col>
          </el-row>
          <div
            v-for="(item, index) in addValue.entourageList"
            :key="item.dyDriverId"
          >
            <p>随行人员{{ index + 1 }}：</p>
            <table>
              <tbody>
                <tr>
                  <td>姓名：{{ item.dyDriverRealName || "-" }}</td>
                  <td>联系电话：{{ item.dyDriverPhone || "-" }}</td>
                </tr>
                <tr>
                  <td>事由说明：{{ item.rezRemark || "-" }}</td>
                  <td>
                    <el-row :gutter="12">
                      <el-col :span="24">身份证（正面）：</el-col>
                      <el-col :span="24">
                        <img
                          :src="item.dyDriverPhotoFace"
                          style="max-width: 100%"
                        />
                      </el-col>
                    </el-row>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-row>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button plain @click="showDetail = false">取消</el-button>
        <el-button
          v-if="detailType == 2"
          type="primary"
          @click="showPlatformList = true"
          >手动选择</el-button
        >
      </el-row>
      <selectDick
        :showPlatformList="showPlatformList"
        @sureSelectDock="sureSelectDock"
        @onClose="onClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import { signPaging, signInfo } from "@/api/order/delivery_note";
import { dock_dispatch_dispatch } from "@/api/my-api/platform.js";
import { list } from "@/api/my-api/platformNature";
import { parseTime } from "@/utils/ruoyi";
import { orderStatus } from "./const";
import selectDick from "@/components/selectDick";
export default {
  components: { selectDick },
  data() {
    return {
      searchForm: {
        dyDriverRealName: undefined,
        dyDriverPhone: undefined,
        rezNumber: undefined,
        dyVehicleLicensePlate: undefined,
        time: [],
        dockList: [],
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      detailType: 1, //1为查看，2为调度
      addValue: {
        rezRemark: undefined,
      },
      showPlatformList: false,
      status: orderStatus,
    };
  },
  created() {
    list({
      name: "",
    }).then((res) => {
      if (res.code == 200) {
        this.dockList = res.rows;
      } else {
        this.$message({
          type: "info",
          message: res.msg,
        });
      }
    });
    this.getList();
  },
  methods: {
    // 获取statusName
    getStatusNameByRows({status, entranceTime}) {
      if(status === 5 && entranceTime) {
        return '已调度进场中';
      }
      return this.status[status]
    },
    getList() {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      if (condition.time) {
        condition.minSignTime = condition.time[0];
        condition.maxSignTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minSignTime;
        delete condition.maxSignTime;
      }
      const params = {
        condition,
        pageNum,
        pageSize,
        sorting: {},
      };
      signPaging(params).then((res) => {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (formName) {
            case "searchForm":
              this.getList();
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看详情
    getDetail(id, detailType) {
      signInfo({ id }).then((res) => {
        this.addValue = res.data;
        this.detailType = detailType;
        this.showDetail = true;
      });
    },
    // 确认调度
    sureSelectDock(dockId) {
      let desc =
        this.tableRadio.status == 2
          ? "该月台已经被占用，是否确定调度?"
          : "是否确定调度?";
      this.$confirm(desc, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        dock_dispatch_dispatch({
          dockId: dockId,
          dyNoteId: this.addValue.dyNoteId,
        }).then((res) => {
          this.msgSuccess(res.msg);
          this.showPlatformList = false;
          this.showDetail = false;
          this.getList();
        });
      });
    },
    onClose() {
      this.showPlatformList = false;
    },
    //删除
    deleteItem(item) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {});
    },
    findName(rezType) {
      let rezTypeName = "";
      if (!rezType) {
        return "-";
      }
      function searchName(arr) {
        arr.some((x) => {
          if (x.id == rezType) {
            rezTypeName = x.name;
            return true;
          }
          if (x.childList && x.childList.length > 0) {
            searchName(x.childList);
          }
        });
      }
      searchName(this.dockList);
      return rezTypeName;
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
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
</style>
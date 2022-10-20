<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="预约号：" prop="rezNumberKeyword">
        <el-input
          v-model="searchForm.rezNumberKeyword"
          placeholder="请输入预约号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="月台名称：" prop="dockName">
        <el-input
          v-model="searchForm.dockName"
          placeholder="请输入月台名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="车牌号：" prop="vehicleLicensePlate">
        <el-input
          v-model="searchForm.vehicleLicensePlate"
          placeholder="请输入车牌号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="调度时间：" prop="time">
        <el-date-picker
          v-model="searchForm.time"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入场时间：" prop="time2">
        <el-date-picker
          v-model="searchForm.time2"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
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
    <el-row type="flex" justify="space-between" style="margin-bottom: 22px">
      <!-- <el-button icon="el-icon-download" type="warning">导出</el-button> -->
      <!-- <el-button icon="el-icon-delete" type="danger" @click="deleteItem">删除</el-button> -->
    </el-row>

    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        prop="deliveryNoteDto.rezNumber"
        label="预约号"
        width="230"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryNoteDto.rezNumber }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="月台号" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryNoteDto.dispatchDockName}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="deliveryNoteDto.vehicleLicensePlate"
        label="车牌号"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryNoteDto.vehicleLicensePlate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dockName"
        label="调度月台"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dockName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliveryNoteDto.dispatchStatus"
        label="状态"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            statusType[scope.row.deliveryNoteDto.dispatchStatus]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliveryNoteDto.signTime"
        label="签到时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.deliveryNoteDto.signTime, "{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dispatchTime"
        label="调度时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(
              scope.row.deliveryNoteDto.dispatchTime,
              "{y}-{m}-{d} {h}:{i}"
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="driveInTime"
        label="入场时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.driveInTime, "{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="getDetail(scope.row.id)"
            >查看</el-button
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
    <!-- 月台调度详情 -->
    <el-dialog :title="'月台调度详情'" :visible.sync="showDetail" width="720px">
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
            <div>预约信息</div>
            <el-button type="text" style="padding: 0">查看更多></el-button>
          </el-row>
          <table>
            <tbody>
              <tr>
                <td>预约号：{{ addValue.rezNumber || "-" }}</td>
                <td>公司名称：{{ addValue.driverCompanyName || "-" }}</td>
              </tr>
              <tr>
                <td>车牌号：{{ addValue.vehicleLicensePlate || "-" }}</td>
                <td>司机：{{ addValue.driverRealName || "-" }}</td>
              </tr>
              <tr>
                <td>司机电话：{{ addValue.driverPhone || "-" }}</td>
                <td>入场事由：{{ findName(addValue.rezType) || "-" }}</td>
              </tr>
              <tr>
                <td colspan="2">
                  预约时间：{{
                    parseTime(addValue.rezStartTime, "{y}-{m}-{d} {h}:{i}")
                  }}
                  至
                  {{ parseTime(addValue.rezEndTime, "{y}-{m}-{d} {h}:{i}") }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 调度信息 -->
          <div style="margin-top: 20px">
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              class="detail-title"
            >
              <el-col>调度信息</el-col>
            </el-row>
            <table>
              <tbody>
                <tr>
                  <td>签到时间:{{ parseTime(addValue.signTime) || "-" }}</td>
                  <td>签到门岗：{{ addValue.signGate }}</td>
                </tr>
                <tr>
                  <td>验证方式:{{ addValue.signType || "-" }}</td>
                  <td>停放月台:{{ addValue.dispatchDockName || "-" }}</td>
                </tr>
                <tr>
                  <td>
                    调度类型：{{
                      addValue.dispatchType == 2 ? "手动调度" : "自动调度"
                    }}
                  </td>
                  <td>调度人：{{ addValue.dispatchBy || "-" }}</td>
                </tr>
                <tr>
                  <td>
                    调度时间：{{ parseTime(addValue.dispatchTime) || "-" }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-row>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button plain @click="showDetail = false">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { recordPaging, recordInfo } from "@/api/order/delivery_note";
import { list } from "@/api/my-api/platformNature";
import { parseTime } from "@/utils/ruoyi";
export default {
  data () {
    return {
      searchForm: {
        rezNumberKeyword: undefined,
        dockName: undefined,
        vehicleLicensePlate: undefined,
        time: undefined,
        time2: undefined,
      },
      rules: {},
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      addValue: {
        deliveryNoteDto: {},
      },
      dockList: [],
      statusType: {
        0: "未进场",
        1: "已进场",
      },
      showDetail: false,
    };
  },
  created () {
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
    getList () {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      console.log(condition);
      if (condition.time) {
        condition.minDispatchTime = condition.time[0];
        condition.maxDispatchTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minDispatchTime;
        delete condition.maxDispatchTime;
      }
      if (condition.time2) {
        condition.minEntranceTime = condition.time2[0];
        condition.maxEntranceTime = condition.time2[1];
        delete condition.time;
      } else {
        delete condition.minEntranceTime;
        delete condition.maxEntranceTime;
      }
      const params = {
        condition,
        pageNum,
        pageSize,
        sorting: {},
      };
      recordPaging(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          console.log(this.tableData);
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
    getDetail (id) {
      recordInfo({ id: id }).then((res) => {
        this.addValue = res.data.deliveryNoteDto;
        this.showDetail = true;
      });
    },
    submitForm (formName) {
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
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    findName (rezType) {
      let rezTypeName = "";
      if (!rezType) {
        return "-";
      }
      function searchName (arr) {
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
    onClose () {
      this.showPlatformList = false;
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
.detail-box {
  table {
    width: 85%;
    border-collapse: collapse;
    border: none;
    td {
      border: solid #d7d7d7 1px;
      padding: 12px 6px;
    }
  }
}
</style>
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
      <el-form-item label="公司名称：" prop="driverCompanyName">
        <el-input
          v-model="searchForm.driverCompanyName"
          placeholder="请输入公司名称"
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
      <el-form-item label="月台名称：" prop="dockName">
        <el-input
          v-model="searchForm.dockName"
          placeholder="请输入月台名称"
          clearable
        ></el-input>
        <!-- <el-select
          v-model="searchForm.dickName"
          placeholder="请选择月台名称"
          clearable
        >
          <el-option label="请选择" value="请选择"></el-option>
        </el-select> -->
        <!-- <el-cascader
          class="p_cascader"
          :options="dockList"
          clearable
          v-model="searchForm.dickName"
          @change="getDockList(e)"
        ></el-cascader> -->
      </el-form-item>
      <el-form-item label="调度人：" prop="dispatchBy">
        <el-input
          v-model="searchForm.dispatchBy"
          placeholder="请输入调度人"
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
      <!-- <el-button icon="el-icon-plus" type="primary" @click="showDetail=true">新增</el-button> -->
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
      <el-table-column type="index" width="70" label="序列号">
      </el-table-column>

      <el-table-column
        prop="rezNumber"
        label="预约号"
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="driverCompanyName"
        label="公司名称"
        width="210"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="vehicleLicensePlate"
        label="车牌号"
        width="130"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dispatchDockName"
        label="调度月台"
        align="center"
        width="140"
      ></el-table-column>
      <el-table-column prop="date" label="状态" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ getStatusNameByRows(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="signTime"
        label="签到时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dispatchType"
        label="调度类型"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            { 1: "自动调度", 2: "手动调度" }[scope.row.dispatchType]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dispatchBy"
        label="调度人"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dispatchTime"
        label="调度时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dispatchTime) }}</span>
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
          <el-button size="mini" type="text" @click="getDetail(scope.row, 1)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 4"
            @click="getDetail(scope.row, 4)"
            >插队</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 5"
            @click="getDetail(scope.row, 5)"
            >取消调度</el-button
          >

          <!-- <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 5 && scope.row.dispatchStatus == 1"
            @click="getDetail(scope.row, 1)"
            >查看</el-button
          > -->
          <!-- <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 5 && scope.row.dispatchStatus == 1"
            @click="getDetail(scope.row, 6)"
            >继续下一个作业</el-button
          > -->
          <!-- <el-button size="mini" type="text" @click="getDetail(scope.row)"
            >手动调度</el-button
          > -->
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
            <el-button
              type="text"
              style="padding: 0"
              @click="openMore(addValue.id, addValue.rezNumber)"
              >查看更多></el-button
            >
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
                  预约时间：{{ parseTime(addValue.rezStartTime) }} 至
                  {{ parseTime(addValue.rezEndTime) }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 调度信息 -->
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
                <td>签到时间:{{ addValue.signTime || "-" }}</td>
                <td>签到门岗：{{ addValue.signGate || "-" }}</td>
              </tr>
              <tr>
                <td>验证方式:{{ addValue.signType || "-" }}</td>
                <td>停放月台:{{ addValue.dispatchDockName || "-" }}</td>
              </tr>
              <tr>
                <td>
                  调度类型：{{
                    { 1: "自动调度", 2: "手动调度" }[addValue.dispatchType]
                  }}
                </td>
                <td>调度人：{{ addValue.dispatchBy || "-" }}</td>
              </tr>
              <tr>
                <td>调度时间：{{ parseTime(addValue.dispatchTime) || "-" }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </el-row>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button plain @click="showDetail = false">关闭</el-button>
        <!-- <el-button type="primary" @click="showPlatformList = true"
          >手动选择</el-button
        > -->
        <el-button type="primary" @click="insert(addValue.id)" v-if="type == 4"
          >插队</el-button
        >
        <el-button type="primary" @click="cancel(addValue.id)" v-if="type == 5"
          >取消调度</el-button
        >
        <!-- <el-button
          type="primary"
          @click="
            next(addValue.dockDto.dockType, addValue.dispatchList.dyNoteId)
          "
          v-if="type == 6"
          >继续下一个作业</el-button
        > -->
      </el-row>
    </el-dialog>

    <!-- 审核详情 -->
    <el-dialog
      :title="'预约详情审核'"
      :visible.sync="showDetail2"
      width="720px"
    >
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="detail-title"
      >
        <el-col>预约信息</el-col>
      </el-row>
      <el-row class="detail-box" type="flex" justify="center">
        <table class="detailTable">
          <tbody>
            <tr>
              <td>预约号：{{ addValue.rezNumber || "-" }}</td>
              <td>申请人手机号：{{ addValue.driverRegisterPhone || "-" }}</td>
            </tr>
            <tr>
              <td>公司名称：{{ addValue.driverCompanyName || "-" }}</td>
              <td>司机电话：{{ addValue.driverPhone || "-" }}</td>
            </tr>
            <tr>
              <td>司机姓名：{{ addValue.driverRealName || "-" }}</td>
              <!-- <td>司机手机号：{{ addValue.driverPhone || "-" }}</td>
              <td>注册手机号：{{ addValue.driverRegisterPhone || "-" }}</td>
              <td>司机证件号：{{ addValue.driverCardNo || "-" }}</td> -->

              <td>车牌号码：{{ addValue.vehicleLicensePlate || "-" }}</td>
            </tr>
            <tr>
              <td>车辆吨位：{{ addValue.vehicleTonnage || "-" }}</td>
              <td>
                类型：{{ addValue.rezSubmitType == 2 ? "加急" : "普通" || "-" }}
              </td>
            </tr>
            <tr>
              <td>
                预约时段：{{ parseTime(addValue.rezStartTime, "{y}-{m}-{d}") }}
                {{ parseTime(addValue.rezStartTime, "{h}:{i}") }}至{{
                  parseTime(addValue.rezEndTime, "{h}:{i}")
                }}
              </td>
              <td>入场事由{{ findName(addValue.rezType) || "-" }}</td>
            </tr>
            <tr>
              <td>
                证件类型：{{
                  { "000": "未知", "111": "身份证", "335": "驾驶证" }[
                    addValue.driverCardType
                  ] || "-"
                }}
              </td>
              <td>身份证号：{{ addValue.driverCardNo || "-" }}</td>
            </tr>
            <tr>
              <td>
                性别：{{
                  { 0: "未知", 1: "男", 2: "女" }[addValue.driverSex] || "-"
                }}
              </td>
              <td>
                随车人员：<span
                  v-if="
                    addValue.entourageList && addValue.entourageList.length > 0
                  "
                  >有</span
                ><span v-else>无</span>
              </td>
            </tr>
            <tr>
              <td>
                <el-row :gutter="12">
                  <el-col :span="24">身份证（正面）：</el-col>
                  <el-col :span="24" v-if="addValue.driverCardFront">
                    <img
                      :src="addValue.driverCardFront"
                      style="width: 200px; height: 100px; object-fit: contain"
                    />
                  </el-col>
                  <el-col :span="24" v-else>-</el-col>
                </el-row>
              </td>
              <td>
                <el-row :gutter="12">
                  <el-col :span="24">人员图片：</el-col>
                  <el-col :span="24" v-if="addValue.driverPhotoFace">
                    <img
                      :src="addValue.driverPhotoFace"
                      style="width: 200px; height: 100px; object-fit: contain"
                    />
                  </el-col>
                  <el-col :span="24" v-else>-</el-col>
                </el-row>
              </td>
            </tr>
            <tr>
              <td>
                <el-row :gutter="12">
                  <el-col :span="24">行程卡：</el-col>
                  <el-col :span="24" v-if="addValue.driverPhotoItinerary">
                    <img
                      :src="addValue.driverPhotoItinerary"
                      style="width: 200px; height: 100px; object-fit: contain"
                    />
                  </el-col>
                  <el-col :span="24" v-else>-</el-col>
                </el-row>
              </td>
              <td>备注：{{ addValue.rezRemark || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </el-row>
      <!-- 随行人员信息 -->
      <div style="margin-top: 22px">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-title"
          v-if="addValue.entourageList && addValue.entourageList.length > 0"
        >
          <el-col>随行人员信息</el-col>
        </el-row>
        <div
          v-for="(item, index) in addValue.entourageList"
          :key="item.dyDriverId"
        >
          <p>随行人员{{ index + 1 }}：</p>
          <el-row class="detail-box" type="flex" justify="center">
            <table>
              <tbody>
                <tr>
                  <td>姓名：{{ item.realName || "-" }}</td>
                  <td>联系电话：{{ item.phone || "-" }}</td>
                </tr>
                <tr>
                  <td>身份证号：{{ item.cardNo || "-" }}</td>
                  <td rowspan="2">
                    <el-row :gutter="12">
                      <el-col :span="24">人脸照片：</el-col>
                      <el-col :span="24" v-if="item.photoFace">
                        <img
                          :src="item.photoFace"
                          style="
                            width: 200px;
                            height: 100px;
                            object-fit: contain;
                          "
                        />
                      </el-col>
                      <el-col :span="24" v-else>-</el-col>
                    </el-row>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-row :gutter="12">
                      <el-col :span="24">身份证（正面）：</el-col>
                      <el-col :span="24" v-if="item.cardFront">
                        <img
                          :src="item.cardFront"
                          style="
                            width: 200px;
                            height: 100px;
                            object-fit: contain;
                          "
                        />
                      </el-col>
                      <el-col :span="24" v-else>-</el-col>
                    </el-row>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-row :gutter="12">
                      <el-col :span="24">行程卡：</el-col>
                      <el-col :span="24" v-if="item.photoItinerary">
                        <img
                          :src="item.photoItinerary"
                          style="
                            width: 200px;
                            height: 100px;
                            object-fit: contain;
                          "
                        />
                      </el-col>
                      <el-col :span="24" v-else>-</el-col>
                    </el-row>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </div>
      </div>
      <!-- 入场信息 -->
      <!-- <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="detail-title"
      >
        <el-col>入场信息</el-col>
      </el-row>
      <table>
        <tbody>
          <tr>
            <td colspan="2">
              预约时间：{{ parseTime(addValue.rezStartTime, "{y}-{m}-{d}") }}
              {{ parseTime(addValue.rezStartTime, "{h}:{i}") }}至{{
                parseTime(addValue.rezEndTime, "{h}:{i}")
              }}
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
        </tbody>
      </table> -->
      <!-- 审核信息 -->
      <div v-if="addValue.checkBy" style="margin-top: 22px">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-title"
        >
          <el-col>审核信息</el-col>
        </el-row>
        <el-row class="detail-box" type="flex" justify="center">
          <table>
            <tbody>
              <tr>
                <td>审核人：{{ addValue.checkBy || "-" }}</td>
                <td>
                  审核时间：{{ parseTime(addValue.checkTime, "{y}-{m}-{d}") }}
                  {{ parseTime(addValue.checkTime, "{h}:{i}") }}
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>
      </div>
    </el-dialog>

    <selectDick
      :showPlatformList="showPlatformList"
      @sureSelectDock="sureSelectDock"
      @onClose="onClose"
    />
  </div>
</template>

<script>
import {
  dispatchPaging,
  dispatchInfo,
  insertTeam,
  nextWork,
  cancelDispatch,
  dispatch,
} from "@/api/order/delivery_note";
import { list } from "@/api/my-api/platformNature";
import { parseTime } from "@/utils/ruoyi";
import { dock_dispatch_dispatch } from "@/api/my-api/platform.js";
import selectDick from "@/components/selectDick";
export default {
  components: { selectDick },
  data () {
    return {
      searchForm: {
        rezNumberKeyword: undefined,
        driverCompanyName: undefined,
        vehicleLicensePlate: undefined,
        dyVehicleLicensePlate: undefined,
        dockName: undefined,
        dispatchBy: undefined,
        time: [],
      },
      rules: {},
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      showDetail2: false,
      showPlatformList: false,
      addValue: {
        name: undefined,
      },
      dockList: [],
      type: undefined,
    };
  },
  created () {
    list({
      name: "",
    }).then((res) => {
      if (res.code == 200) {
        this.dockList = this.handleDockListData(res.rows);
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

    //获取月台列表父级联
    handleDockListData (data) {
      console.log('dockList', data)
      let parentData = [];
      data.forEach(ele => {
        parentData.push({
          value: ele.id,
          label: ele.name,
          children: this.getChildren(ele)
        });
      });

      console.log('parentData', parentData)
      return parentData;
    },

    //获取备课目录子级联
    getChildren (ele) {
      if (!ele.childList || ele.childList.length == 0) return;
      let ChildrenData = [];
      ele.childList.forEach(list => {
        ChildrenData.push({
          value: list.id,
          label: list.name
        });
      });
      return ChildrenData;
    },

    getStatusNameByRows ({ status, entranceTime }) {
      if (status === 5 && entranceTime) {
        return '已调度进场中';
      }
      const statusEnum = { 4: "已签到", 5: "已调度未进场", 6: "已调度已进场" };
      return statusEnum[status]
    },
    getList () {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      if (condition.time) {
        condition.minDispatchTime = condition.time[0];
        condition.maxDispatchTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minDispatchTime;
        delete condition.maxDispatchTime;
      }
      const params = {
        condition,
        pageNum,
        pageSize,
        sorting: {}
      };
      dispatchPaging(params).then((res) => {
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
    openMore (a, b) {
      console.log(a, b);
      this.showDetail2 = true;
    },
    //查看详情
    getDetail (item, type) {
      this.type = type;
      let params = {
        // rezNumber: item.rezNumber,
        id: item.id,
      };
      dispatchInfo(params).then((res) => {
        this.addValue = res.data;
        this.showDetail = true;
      });
    },
    //插队
    insert (id) {
      this.$confirm("是否确定插队", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(id);
        insertTeam({ id: id }).then((res) => {
          if ((res.code = 200)) {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
          this.showDetail = false;
          this.getList();
        });
      });
    },
    //取消调度
    cancel (id) {
      cancelDispatch({ id: id }).then((res) => {
        if ((res.code = 200)) {
          this.$message({
            type: "success",
            message: res.msg,
          });
        }
        this.showDetail = false;
        this.getList();
      });
    },
    //继续下一个作业
    next (dockType, dyNoteId) {
      this.$confirm("是否继续下一个作业", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(id);
        nextWork({ dockType: dockType, dyNoteId: dyNoteId }).then((res) => {
          if ((res.code = 200)) {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
          this.showDetail = false;
          this.getList();
        });
      });
    },
    // 确认调度
    sureSelectDock (dockId) {
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
    //判断显示状态
    checkStatus (status, dispatchStatus) {
      if (status == 4) {
        return "已签到";
      } else if (status == 5 && dispatchStatus == 0) {
        return "已调度未进场";
      } else if (status == 5 && dispatchStatus == 1) {
        return "已调度已进场";
      }
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
</style>
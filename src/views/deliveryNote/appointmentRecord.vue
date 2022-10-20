<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="司机姓名：" prop="driverRealName">
        <el-input
          v-model="searchForm.driverRealName"
          placeholder="请输入司机姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="申请人手机号：" prop="registerPhone">
        <el-input
          v-model="searchForm.registerPhone"
          placeholder="请输入申请人手机号"
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
      <el-form-item label="签到时间：" prop="time">
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
      <el-form-item label="预约时间：" prop="time3">
        <el-date-picker
          v-model="searchForm.time3"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          style="width: 185px"
          clearable
        >
          <el-option
            v-for="(val, key) in status"
            :label="val"
            :value="key"
            :key="key"
          ></el-option>
        </el-select>
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
      <el-button
        icon="el-icon-download"
        type="warning"
        @click="exports('export_delivery_note')"
        >导出</el-button
      >
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
        prop="rezNumber"
        label="预约号"
        width="230"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="driverRegisterPhone"
        label="申请人手机号"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="driverCompanyName"
        label="公司名称"
        align="center"
        width="210"
      >
      </el-table-column>
      <el-table-column
        prop="driverRealName"
        label="司机姓名"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="driverPhone" label="司机手机号" align="center">
      </el-table-column>
      <el-table-column
        prop="rezType"
        label="入场事由"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ findName(scope.row.rezType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时段" width="200" align="center">
        <template slot-scope="scope">
          <span
            >{{ parseTime(scope.row.rezStartTime, "{y}-{m}-{d}") }}
            {{ parseTime(scope.row.rezStartTime, "{h}:{i}") }}至{{
              parseTime(scope.row.rezEndTime, "{h}:{i}")
            }}</span
          >
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
        prop="driveInTime"
        label="入场时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.entranceTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="driveInTime"
        label="调度月台"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dispatchDockName) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="driveInTime"
        label="离场时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.departureTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="confirmBy"
        label="放行人"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.releasePermitDto
              ? scope.row.releasePermitDto.confirmBy
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="driveInTime"
        label="放行条"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ { 0: "", 1: "有" }[scope.row.permitFlag] }}</span>
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
    <!-- 预约详情 -->
    <el-dialog :title="'预约详情'" :visible.sync="showDetail" width="720px">
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <div>
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="detail-title"
          >
            <el-col>预约信息</el-col>
          </el-row>
          <el-row class="detail-box" type="flex" justify="center">
            <table>
              <tbody>
                <tr>
                  <td>预约号：{{ addValue.rezNumber || "-" }}</td>
                  <td>
                    申请人手机号：{{ addValue.driverRegisterPhone || "-" }}
                  </td>
                </tr>
                <tr>
                  <td>公司名称：{{ addValue.driverCompanyName || "-" }}</td>
                  <td>司机电话：{{ addValue.driverPhone || "-" }}</td>
                </tr>
                <tr>
                  <td>司机姓名：{{ addValue.driverRealName || "-" }}</td>
                  <td>车牌号码：{{ addValue.vehicleLicensePlate || "-" }}</td>
                </tr>
                <tr>
                  <td>车辆吨位：{{ addValue.vehicleTonnage || "-" }}</td>
                  <td>
                    类型：{{
                      addValue.rezSubmitType == 2 ? "加急" : "普通" || "-"
                    }}
                  </td>
                </tr>
                <tr>
                  <td>
                    预约时段：{{
                      parseTime(addValue.rezStartTime, "{y}-{m}-{d}")
                    }}
                    {{ parseTime(addValue.rezStartTime, "{h}:{i}") }}至{{
                      parseTime(addValue.rezEndTime, "{h}:{i}")
                    }}
                  </td>
                  <td>入场事由：{{ findName(addValue.rezType) || "-" }}</td>
                </tr>
                <!-- <tr>
                <td>
                  证件类型：{{
                    { "000": "未知", "111": "身份证", "335": "驾驶证" }[
                      addValue.driverCardType
                    ] || "-"
                  }}
                </td>
                <td>身份证号：{{ addValue.driverCardNo || "-" }}</td>
              </tr> -->
                <!-- <tr>
                <td>性别：{{ addValue.driverCardNo || "-" }}</td>
                <td>
                  随身人员：<span
                    v-if="
                      addValue.entourageList &&
                      addValue.entourageList.length > 0
                    "
                    >有</span
                  ><span v-else>无</span>
                </td>
              </tr> -->
                <tr>
                  <td>身份证号：{{ addValue.driverCardNo || "-" }}</td>
                  <td>
                    随车人员：<span
                      v-if="
                        addValue.entourageList &&
                        addValue.entourageList.length > 0
                      "
                      >有</span
                    ><span v-else>无</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    备注：
                    <div
                      style="width: 100%; height: 60px; border: 1px solid #ccc"
                    >
                      {{ addValue.rezRemark || "-" }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    提交时间：{{ parseTime(addValue.rezSubmitTime) || "-" }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </div>
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
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </el-row>
          </div>
        </div>
        <div>
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="detail-title"
          >
            <el-col>调度信息</el-col>
          </el-row>
          <el-row class="detail-box" type="flex" justify="center">
            <table>
              <tbody>
                <tr>
                  <td>签到时间:{{ addValue.signTime || "-" }}</td>
                  <td>签到门岗：{{ addValue.signGate || "-" }}</td>
                </tr>
                <tr>
                  <td>验证方式:{{ addValue.signType || "-" }}</td>
                  <td>入厂时间:{{ addValue.dispatchDockName || "-" }}</td>
                </tr>
                <tr>
                  <td>停放月台：{{ addValue.dispatchBy || "-" }}</td>
                  <td>
                    调度类型：{{
                      addValue.dispatchType == 2 ? "手动调度" : "自动调度"
                    }}
                  </td>
                </tr>
                <tr>
                  <td>调度人：{{ addValue.dispatchBy || "-" }}</td>
                  <td>
                    调度时间：{{ parseTime(addValue.dispatchTime) || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </div>
        <div style="margin-top: 22px">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="detail-title"
          >
            <el-col>出场信息</el-col>
          </el-row>
          <el-row class="detail-box" type="flex" justify="center">
            <table>
              <tbody>
                <tr>
                  <td>
                    放行条：{{
                      { 0: "", 1: "有" }[
                        addValue.releasePermitDto
                          ? addValue.releasePermitDto.permitFlag
                          : "0"
                      ]
                    }}
                  </td>
                  <td>
                    出场验证门岗：{{
                      addValue.releasePermitDto
                        ? addValue.releasePermitDto.departureGate
                        : "-"
                    }}
                  </td>
                </tr>
                <!-- <tr>
                  <td>出场时间：2020-12-12 15:00</td>
                  <td></td>
                </tr> -->
                <tr>
                  <td>离场时间:：{{ parseTime(addValue.departureTime) }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </div>
      </el-form>
      <el-row type="flex" justify="end" style="margin-top: 22px">
        <el-button plain @click="showDetail = false">关闭</el-button>
      </el-row>
    </el-dialog>
    <!-- 导出字段选择 -->
    <el-dialog
      title="导出字段选择"
      :visible.sync="showField"
      width="720px"
      @closed="reset()"
    >
      <el-form
        ref="fileForm"
        :rules="rules"
        :model="from"
        label-position="left"
      >
        <el-row style="margin-top: 20px">
          <el-col :span="6">
            <el-checkbox
              v-model="from.rezNumber"
              true-label="预约号"
              false-label="0"
              >预约号</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.driverRegisterPhone"
              true-label="申请人手机号"
              false-label="0"
              >申请人手机号</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.driverCompanyName"
              true-label="公司名称"
              false-label="0"
              >公司名称</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.driverRealName"
              true-label="司机名称"
              false-label="0"
              >司机姓名</el-checkbox
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6">
            <el-checkbox
              v-model="from.driverPhone"
              true-label="司机手机号"
              false-label="0"
              >司机手机号</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.driverCardNo"
              true-label="身份证号"
              false-label="0"
              >身份证号</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.vehicleLicensePlate"
              true-label="车牌号"
              false-label="0"
              >车牌号</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.rezType"
              true-label="入场事由"
              false-label="0"
              >入场事由</el-checkbox
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6">
            <el-checkbox
              v-model="from.time"
              true-label="预约时段"
              false-label="0"
              >预约时段</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.vehicleTonnage"
              true-label="车辆吨位"
              false-label="0"
              >车辆吨位</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.type"
              true-label="预约类型（普通/加急）"
              false-label="0"
              >预约类型(普通/加急)</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.rezRemark"
              true-label="入场备注"
              false-label="0"
              >入场备注</el-checkbox
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6" s>
            <el-checkbox
              v-model="from.time2"
              true-label="提交时间"
              false-label="0"
              >提交时间</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.time3"
              true-label="签到时间"
              false-label="0"
              >签到时间</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.signGate"
              true-label="签到门岗"
              false-label="0"
              >签到门岗</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.signType"
              true-label="验证方式"
              false-label="0"
              >验证方式</el-checkbox
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6" s>
            <el-checkbox
              v-model="from.time4"
              true-label="调度时间"
              false-label="0"
              >调度时间</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.time5"
              true-label="入场时间"
              false-label="0"
              >入场时间</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.dispatchDockName"
              true-label="调度月台"
              false-label="0"
              >调度月台</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.dispatchBy"
              true-label="调度人"
              false-label="0"
              >调度人</el-checkbox
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6" s>
            <el-checkbox
              v-model="from.dispatchType"
              true-label="调度类型（自动/手动）"
              false-label="0"
              >调度类型(自动/手动)</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="from.tiao" true-label="方行条" false-label="0"
              >放行条</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="from.name" true-label="放行人" false-label="0"
              >放行人</el-checkbox
            >
          </el-col>
          <el-col :span="6">
            <el-checkbox
              v-model="from.outType"
              true-label="离场验证门岗"
              false-label="0"
              >离场验证门岗</el-checkbox
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6" s>
            <el-checkbox
              v-model="from.time6"
              true-label="离场时间"
              false-label="0"
              >离场时间</el-checkbox
            >
          </el-col>
          <!-- <el-col :span="6">
            <el-checkbox v-model="checked">随车人员1姓名</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="checked">随车人员1联系电话</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="checked">随车人员1身份证号</el-checkbox>
          </el-col> -->
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showField = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { info, paging, exportDeliveryNote } from "@/api/order/delivery_note";
import { dictType } from "@/api/my-api/dict";
import { list } from "@/api/my-api/platformNature";
import { parseTime } from "@/utils/ruoyi";
import { orderStatus } from "./const";
import { downLoadZip } from "@/utils/fileDownload";
import { server } from "@/config/server";
import qs from "qs";
export default {
  data() {
    return {
      searchForm: {
        vehicleLicensePlate: undefined,
        driverRealName: undefined,
        driverCompanyName: undefined,
        driverPhone: undefined,
        registerPhone: undefined,
        status: undefined,
        time: undefined,
        time2: undefined,
        time3: undefined,
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
        releasePermitDto: {},
      },
      dockList: [],
      statusType: {
        0: "未进场",
        1: "已进场",
      },
      showDetail: false,
      showField: false,
      checked: true,
      status: orderStatus,
      from: {
        rezNumber: "预约号",
        driverRegisterPhone: "申请人手机号",
        driverCompanyName: "公司名称",
        driverRealName: "司机名称",
        driverPhone: "司机手机号",
        driverCardNo: "身份证号",
        vehicleLicensePlate: "车牌号",
        rezType: "入场事由",
        vehicleTonnage: "车辆吨位",
        time: "预约时段",
        type: "预约类型（普通/加急）",
        rezRemark: "入场备注",
        time2: "提交时间",
        time3: "签到时间",
        signGate: "签到门岗",
        signType: "验证方式",
        time4: "调度时间",
        time5: "入场时间",
        dispatchDockName: "调度月台",
        dispatchBy: "调度人",
        dispatchType: "调度类型（自动/手动）",
        tiao: "方行条",
        name: "放行人",
        outType: "离场验证门岗",
        time6: "离场时间",
      },
      keyAarry: [],
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
    getList() {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      console.log(condition);
      if (condition.time) {
        condition.minSignTime = condition.time[0];
        condition.maxSignTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minSignTime;
        delete condition.maxSignTime;
      }
      if (condition.time2) {
        condition.minEntranceTime = condition.time2[0];
        condition.maxEntranceTime = condition.time2[1];
        delete condition.time2;
      } else {
        delete condition.minEntranceTime;
        delete condition.maxEntranceTime;
      }
      if (condition.time3) {
        condition.minRezTime = condition.time3[0];
        condition.maxRezTime = condition.time3[1];
        delete condition.time3;
      } else {
        delete condition.minRezTime;
        delete condition.maxRezTime;
      }
      if (condition.status === "") {
        delete condition.status;
      }
      const params = {
        condition,
        pageNum,
        pageSize,
        sorting: {},
      };
      paging(params).then((res) => {
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
    getDetail(id) {
      info({ id: id }).then((res) => {
        this.addValue = res.data;
        this.showDetail = true;
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
    findName(rezType) {
      let rezTypeName = "";

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
    //导出
    exports(dictType1) {
      console.log(this.from);
      this.showField = true;
      dictType(dictType1).then((res) => {
        console.log(res.data);
        this.keyAarry = res.data;
      });
    },
    submit() {
      console.log(this.from);
      let data = this.from;
      let keyAarry = this.keyAarry;
      let arr = [];
      for (let i in data) {
        keyAarry.forEach((item) => {
          if (item.dictLabel == data[i]) {
            console.log(item.dictLabel);
            let obj = {};
            obj.dictLabel = item.dictLabel;
            obj.dictValue = item.dictValue;
            arr.push(obj);
          }
        });
      }
      console.log(arr);
      // exportDeliveryNote({ properties: arr }).then((res) => {
      //   console.log(res);
      // });
      let params = { properties: arr };
      downLoadZip(
        "/console/delivery_note/exportDeliveryNote",
        "预约记录.xlsx",
        params
      );
      this.showField = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    onClose() {
      this.showPlatformList = false;
    },
    reset() {
      this.from = {
        rezNumber: "预约号",
        driverRegisterPhone: "申请人手机号",
        driverCompanyName: "公司名称",
        driverRealName: "司机名称",
        driverPhone: "司机手机号",
        driverCardNo: "身份证号",
        vehicleLicensePlate: "车牌号",
        rezType: "入场事由",
        vehicleTonnage: "车辆吨位",
        time: "预约时段",
        type: "预约类型（普通/加急）",
        rezRemark: "入场备注",
        time2: "提交时间",
        time3: "签到时间",
        signGate: "签到门岗",
        signType: "验证方式",
        time4: "调度时间",
        time5: "入场时间",
        dispatchDockName: "调度月台",
        dispatchBy: "调度人",
        dispatchType: "调度类型（自动/手动）",
        tiao: "方行条",
        name: "放行人",
        outType: "离场验证门岗",
        time6: "离场时间",
      };
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
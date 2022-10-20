<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="first"></el-tab-pane>
      <el-tab-pane label="变更申请待审核" name="second"></el-tab-pane>
    </el-tabs>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="公司名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="司机姓名：" prop="driverRealName">
        <el-input
          v-model="searchForm.driverRealName"
          placeholder="请输入司机姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="司机手机号：" prop="driverPhone">
        <el-input
          v-model="searchForm.driverPhone"
          placeholder="请输入司机手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="车牌号：" prop="vehicleLicensePlate">
        <el-input
          v-model="searchForm.vehicleLicensePlate"
          placeholder="请输入车牌号"
        ></el-input>
      </el-form-item>
      <el-form-item label="提交时间：" prop="time">
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
    <el-row
      v-if="checkType == 1"
      type="flex"
      justify="space-between"
      style="margin-bottom: 22px"
    >
      <el-button icon="el-icon-plus" type="primary" @click="showDetail = true"
        >新增</el-button
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
      <el-table-column prop="companyTypeName" label="公司类型" align="center">
        <template slot-scope="scope">
          <span>{{ searchTypeName(scope.row.companyType, 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="公司名称"
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="companyPrincipal"
        label="负责人姓名"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="companyTel"
        label="公司电话"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column prop="supplyTypeName" label="供应类型" align="center">
        <template slot-scope="scope">
          <span>{{ searchTypeName(scope.row.supplyType, 2) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="备案状态" align="center">
        <template slot-scope="scope">
          <span>{{status[scope.row.status]}}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="submitTime"
        label="提交时间"
        width="230"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.submitTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="getDetail(scope.row.id, 1)"
            >审核</el-button
          >
          <!-- <el-button size="mini" type="text" @click="getDetail(scope.row.id,2)">查看</el-button> -->
          <!-- <el-button
            v-if="scope.row.status==0||scope.row.status==3"
            size="mini"
            type="text"
            @click="getDetail(scope.row.id,3)"
          >编辑</el-button>-->
          <!-- <el-button
            v-if="scope.row.status==0||scope.row.status==2"
            size="mini"
            type="text"
            @click="deleteItem(scope.row.id)"
          >删除</el-button>-->
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
    <!-- 备案登记 -->
    <el-dialog
      :title="!!addValue.id ? '修改备案' : '备案登记'"
      :visible.sync="showDetail"
      width="780px"
      @closed="onClose"
    >
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-title"
        >
          <el-col>基本信息</el-col>
          <el-col style="text-align: right">* 为必填</el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="公司名称" prop="name" label-width="120px">
            <el-input
              v-model="addValue.name"
              placeholder="请输入公司名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司类型" prop="companyType" label-width="120px">
            <el-select
              v-model="addValue.companyType"
              placeholder="请选择类型"
              style="width: 185px"
            >
              <el-option
                v-for="item in companyType"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item
            label="营业执照注册号"
            prop="businessLicenseCode"
            label-width="120px"
          >
            <el-input
              v-model="addValue.businessLicenseCode"
              placeholder="请输入营业执照注册号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司地址"
            prop="companyAddress"
            label-width="120px"
          >
            <el-input
              v-model="addValue.companyAddress"
              placeholder="请输入公司地址"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item
            label="负责人姓名"
            prop="companyPrincipal"
            label-width="120px"
          >
            <el-input
              v-model="addValue.companyPrincipal"
              placeholder="请输入负责人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司电话" prop="companyTel" label-width="120px">
            <el-input
              v-model="addValue.companyTel"
              placeholder="请输入公司电话"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="供应类型" prop="supplyType" label-width="120px">
            <el-select
              v-model="addValue.supplyType"
              placeholder="请选择类型"
              style="width: 185px"
            >
              <el-option
                v-for="item in supplyType"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="供应材料"
            prop="supplyMaterials"
            label-width="120px"
          >
            <el-input
              v-model="addValue.supplyMaterials"
              placeholder="请输入供应材料"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item
            label="经营范围"
            prop="businessScope"
            label-width="120px"
          >
            <el-input
              v-model="addValue.businessScope"
              placeholder="请输入经营范围"
            ></el-input>
          </el-form-item>
        </el-row>
        <!-- 添加汽车列表 -->
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-title"
        >
          <el-col>车辆信息</el-col>
        </el-row>
        <div class="carList">
          <div
            class="item"
            v-for="(item, index) in addValue.deliveryVehicleList"
            :key="index"
          >
            <div>车辆{{ index + 1 }}：</div>
            <el-row type="flex" justify="space-between">
              <el-form-item
                label="车牌号"
                :prop="`licensePlate${index}`"
                class="is-required"
                label-width="70px"
              >
                <el-input
                  v-model="item.licensePlate"
                  placeholder="请输入车牌号"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="车辆类型"
                prop="vehicleType"
                label-width="70px"
              >
                <el-input
                  v-model="item.vehicleType"
                  placeholder="请输入车辆类型"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-form-item
                label="吨位"
                prop="deadWeightTonnage"
                label-width="70px"
              >
                <el-input
                  v-model="item.deadWeightTonnage"
                  placeholder="请输入吨位"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="预约结束时间"
                prop="rezEndTime"
                label-width="100px"
              >
                <el-time-picker
                  v-model="item.rezEndTime"
                  placeholder="请选择预约结束时间"
                  value-format="HH:mm"
                  format="HH:mm"
                  style="width: 185px"
                ></el-time-picker>
              </el-form-item>
            </el-row>
            <el-form-item label="备注" prop="remark" label-width="60px">
              <el-input
                type="textarea"
                :rows="3"
                :maxlength="200"
                show-word-limit
                v-model="item.remark"
                placeholder="请输入200字以内备注，配送路线或其他信息"
              ></el-input>
            </el-form-item>
            <!-- 操作 -->
            <div class="config">
              <i
                class="el-icon-circle-plus-outline add"
                @click="addTableItem(1)"
              />
              <i
                v-if="index != 0"
                class="el-icon-remove-outline delete"
                @click="deleteTableItem(1, index)"
              />
            </div>
          </div>
        </div>
        <!-- 添加司机列表 -->
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-title"
        >
          <el-col>司机信息</el-col>
        </el-row>
        <div class="driverList">
          <div
            class="item"
            v-for="(item, index) in addValue.deliveryDriverList"
            :key="index"
          >
            <div>司机{{ index + 1 }}：</div>
            <el-row type="flex" justify="space-between">
              <el-form-item
                label="司机姓名"
                :prop="`realName${index}`"
                class="is-required"
                label-width="110px"
              >
                <el-input
                  v-model="item.realName"
                  placeholder="请输入司机姓名"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="司机手机号"
                :prop="`phone${index}`"
                class="is-required"
                label-width="100px"
              >
                <el-input
                  v-model="item.phone"
                  placeholder="请输入手机号码"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-form-item
                label="司机身份证号"
                :prop="`cardNo${index}`"
                class="is-required"
                label-width="110px"
              >
                <el-input
                  v-model="item.cardNo"
                  placeholder="请输入司机身份证号"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="性别"
                :prop="`sex${index}`"
                class="is-required"
                label-width="100px"
              >
                <el-radio-group v-model="item.sex" style="width: 185px">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-form-item
                label="身份证(正面)"
                prop="cardFront"
                label-width="100px"
              >
                <ImageUpload
                  @on-success="
                    (response, fileList) => {
                      cardFrontUpload(response, fileList, index);
                    }
                  "
                  @on-remove="
                    (file, fileList) => {
                      cardFrontRemove(file, fileList, index);
                    }
                  "
                  :value="item.cardFront"
                  :index="index"
                />
              </el-form-item>
              <el-form-item
                label="健康证"
                prop="photoHealthCertificate"
                label-width="100px"
              >
                <ImageUpload
                  :value="item.photoHealthCertificate"
                  @on-success="
                    (response, fileList) => {
                      photoHealthCertificateUpload(response, fileList, index);
                    }
                  "
                  @on-remove="
                    (file, fileList) => {
                      photoHealthCertificatePicRemove(file, fileList, index);
                    }
                  "
                />
              </el-form-item>
            </el-row>
            <el-form-item label="备注" prop="remark" label-width="100px">
              <el-input
                type="textarea"
                :rows="3"
                :maxlength="200"
                show-word-limit
                v-model="item.remark"
                placeholder="请输入200字以内备注，配送路线或其他信息"
              ></el-input>
            </el-form-item>
            <!-- 操作 -->
            <div class="config">
              <i
                class="el-icon-circle-plus-outline add"
                @click="addTableItem(2)"
              />
              <i
                v-if="index != 0"
                class="el-icon-remove-outline delete"
                @click="deleteTableItem(2, index)"
              />
            </div>
          </div>
        </div>
        <el-row type="flex" justify="end" align="middle">
          <el-button plain @click="submitForm('detailForm', 'storage')"
            >暂存</el-button
          >
          <el-button type="primary" @click="submitForm('detailForm', 'submit')"
            >提交</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 审核详情 -->
    <el-dialog
      :title="detailType == 1 ? '备案审核' : '备案详情'"
      :visible.sync="showAudit"
      width="720px"
      @closed="onClose"
    >
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="detail-title"
      >
        <el-col>基本信息</el-col>
      </el-row>
      <el-row class="detail-box" type="flex" justify="center">
        <table>
          <tbody>
            <tr>
              <td>公司名称：{{ addValue.name || "-" }}</td>
              <td>公司类型：{{ addValue.companyTypeName || "-" }}</td>
            </tr>
            <tr>
              <td>营业执照注册号：{{ addValue.businessLicenseCode || "-" }}</td>
              <td>公司地址：{{ addValue.companyAddress || "-" }}</td>
            </tr>
            <tr>
              <td>负责人姓名：{{ addValue.companyPrincipal || "-" }}</td>
              <td>公司电话：{{ addValue.companyTel || "-" }}</td>
            </tr>
            <tr>
              <td>供应类型：{{ addValue.supplyTypeName || "-" }}</td>
              <td>供应材料：{{ addValue.supplyMaterials || "-" }}</td>
            </tr>
            <tr>
              <td colspan="2" class="c-td">
                <el-row class="content">
                  <el-col :span="24">经营范围：</el-col>
                  <el-col :span="24" class="words">{{
                    addValue.businessScope || "-"
                  }}</el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>

      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="detail-title"
      >
        <el-col>车辆信息</el-col>
      </el-row>
      <el-row
        v-for="(item, index) in addValue.deliveryVehicleList"
        :key="item.id"
        class="detail-box"
        type="flex"
        justify="center"
      >
        <table>
          <tbody>
            <tr>
              车辆{{
                index + 1
              }}
            </tr>
            <tr>
              <td>车牌号：{{ item.licensePlate || "-" }}</td>
              <td>车辆类型：{{ item.vehicleType || "-" }}</td>
            </tr>
            <tr>
              <td>吨位：{{ item.deadWeightTonnage || "-" }}</td>
              <td>预约结束时间：{{ item.rezEndTime || "-" }}</td>
            </tr>
            <tr>
              <td colspan="2" class="c-td">
                <el-row class="content">
                  <el-col :span="24">备注：</el-col>
                  <el-col :span="24" class="words">{{
                    item.remark || "-"
                  }}</el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>

      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="detail-title"
      >
        <el-col>司机信息</el-col>
      </el-row>
      <el-row
        v-for="(item, index) in addValue.deliveryDriverList"
        :key="item.id"
        class="detail-box"
        type="flex"
        justify="center"
      >
        <table>
          <tbody>
            <tr>
              司机{{
                index + 1
              }}
            </tr>
            <tr>
              <td>司机姓名：{{ item.realName || "-" }}</td>
              <td>司机手机号：{{ item.phone || "-" }}</td>
            </tr>
            <tr>
              <td>司机身份证号：{{ item.cardNo || "-" }}</td>
              <td>性别：{{ item.sex == 0 ? "男" : "女" }}</td>
            </tr>
            <tr>
              <td>
                <p>身份证（正面）</p>
                <img
                  style="width: 200px; height: 100px; object-fit: contain"
                  :src="item.cardFront"
                />
              </td>
              <td>
                <p>健康证</p>
                <img
                  style="width: 200px; height: 100px; object-fit: contain"
                  :src="item.photoHealthCertificate"
                />
              </td>
            </tr>
            <tr>
              <td colspan="2" class="c-td">
                <el-row class="content">
                  <el-col :span="24">备注：</el-col>
                  <el-col :span="24" class="words">{{
                    item.remark || "-"
                  }}</el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>
      <el-row type="flex" justify="end" style="margin-top: 20px">
        <el-button plain @click="showAudit = false">关闭</el-button>
        <el-button @click="registerCheck" type="primary" v-if="detailType == 1"
          >审核</el-button
        >
      </el-row>
      <el-dialog
        width="640px"
        title="提示"
        :visible.sync="showReason"
        @closed="reason = ''"
        append-to-body
      >
        <p style="margin-bottom: 12px">审核不通过原因</p>
        <el-input
          v-model="reason"
          placeholder="请输入原因"
          type="textarea"
          :maxlength="200"
          show-word-limit
          :rows="4"
        ></el-input>
        <el-row type="flex" justify="end" style="margin-top: 12px">
          <el-button plain @click="showReason = false">取消</el-button>
          <el-button @click="sureUnPass" :disabled="!!reason" type="primary"
            >确定</el-button
          >
        </el-row>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import {
  changePaging,
  registerPaging,
  storage,
  submit,
  registerInfo,
  changeInfo,
  deleteInfo,
  registerCheck,
  changeCheck
} from "@/api/my-api/distribution";
import { parseTime } from "@/utils/ruoyi";
import { dictCode, dictType } from "@/api/my-api/dict";
export default {
  components: { ImageUpload },
  data () {
    // 校验车牌号
    var checkLicensePlate = (rule, value, callback) => {
      const index = parseInt(rule.field.split("licensePlate")[1]);
      const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[ABCDEFGHJK])|([ABCDEFGHJK]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]\d{3}\d{1,3}[领])|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      const pass = reg.test(
        this.addValue.deliveryVehicleList[index].licensePlate
      );
      if (pass) {
        callback();
      } else {
        callback(new Error("请输入正确的车牌号"));
      }
    };
    // 校验司机名字
    var checkRealName = (rule, value, callback) => {
      const index = parseInt(rule.field.split("realName")[1]);
      const content = this.addValue.deliveryDriverList[index].realName;
      const reg = /^\s+$/g;
      if (!!content && !reg.test(content)) {
        callback();
      } else {
        callback(new Error("请输入司机名字"));
      }
    };
    // 校验司机手机号
    var checkPhone = (rule, value, callback) => {
      const index = parseInt(rule.field.split("phone")[1]);
      const reg = /^1[3456789]\d{9}$/;
      const pass = reg.test(this.addValue.deliveryDriverList[index].phone);
      if (pass) {
        callback();
      } else {
        callback(new Error("请正确的输入手机号"));
      }
    };
    // 校验司机身份证号
    var checkCardNo = (rule, value, callback) => {
      const index = parseInt(rule.field.split("cardNo")[1]);
      const reg = /[1-9]\d{5}[1-2]\d{3}((0\d)|(1[0-2]))(([012]\d)|3[0-1])\d{3}(\d|X|x)/;
      const pass = reg.test(this.addValue.deliveryDriverList[index].cardNo);
      if (pass) {
        callback();
      } else {
        callback(new Error("请正确的身份证号"));
      }
    };
    // 校验司机性别
    var checkSex = (rule, value, callback) => {
      const index = parseInt(rule.field.split("sex")[1]);
      const content = this.addValue.deliveryDriverList[index].sex;
      if (content == 0 || content == 1) {
        callback();
      } else {
        callback(new Error("请选择司机性别"));
      }
    };
    return {
      activeName: "first",
      checkType: 1,
      searchForm: {
        name: undefined,
        driverRealName: undefined,
        driverPhone: undefined,
        vehicleLicensePlate: undefined,
        time: undefined,
        checkStatus: 1 //1: 待审核 2:驳回 3:通过
      },
      rules: {
        name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        companyPrincipal: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" }
        ],
        companyTel: [
          { required: true, message: "请输入公司电话", trigger: "blur" },
          {
            pattern: /(^1[3456789]\d{9}$)|(^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$)/,
            message: "请输入正确的公司电话",
            trigger: "blur"
          }
        ],
        licensePlate0: [{ validator: checkLicensePlate, trigger: "blur" }],
        realName0: [{ validator: checkRealName, trigger: "blur" }],
        phone0: [{ validator: checkPhone, trigger: "blur" }],
        cardNo0: [{ validator: checkCardNo, trigger: "blur" }],
        sex0: [{ validator: checkSex, trigger: "blur" }]
      },
      tableData: [{}],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      status: {
        0: "待提交",
        1: "预约失败",
        2: "已驳回",
        3: "已通过"
      },
      addValue: {
        name: undefined,
        companyType: undefined,
        businessLicenseCode: undefined,
        companyAddress: undefined,
        companyPrincipal: undefined,
        companyTel: undefined,
        supplyType: undefined,
        supplyMaterials: undefined,
        businessScope: undefined,
        deliveryVehicleList: [
          {
            licensePlate: undefined,
            vehicleType: undefined,
            deadWeightTonnage: undefined,
            rezEndTime: undefined,
            remark: undefined
          }
        ],
        deliveryDriverList: [
          {
            realName: undefined,
            phone: undefined,
            cardNo: undefined,
            sex: undefined,
            cardFront: undefined,
            photoHealthCertificate: undefined,
            remark: undefined
          }
        ]
      },
      showAudit: false,
      showReason: false,
      reason: "",
      detailType: 0,
      companyType: [], //配送商公司类型
      supplyType: [] //配送商供应类型
    };
  },
  created () {
    this.getList();
    dictType("biz_dy_company_type").then(res => {
      this.companyType = res.data;
    });
    dictType("biz_dy_supply_type").then(res => {
      this.supplyType = res.data;
    });
  },
  methods: {
    handleClick (tab) {
      if (tab.name == "first") {
        this.checkType = 1;
      } else if (tab.name == "second") {
        this.checkType = 2;
      }
      this.getList();
    },
    getList () {
      this.loading = true;
      const { searchForm, pageNum, pageSize, checkType } = this;
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
        sorting: {}
      };
      let paging;
      if (checkType == 1) {
        paging = registerPaging;
      } else if (checkType == 2) {
        paging = changePaging;
      }
      paging(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.rows.map(v => {
            return {
              ...v.deliveryCompany,
              ...v
            };
          });
          this.total = parseInt(parseInt(res.total));
          this.loading = false;
        } else {
          this.$message({
            type: "info",
            message: res.msg
          });
        }
      });
    },
    setDetail (type) {
      if (type == "storage") {
        storage(this.addValue).then(res => {
          this.getList();
          this.showDetail = false;
        });
      } else if (type == "submit") {
        submit(this.addValue).then(res => {
          this.getList();
          this.showDetail = false;
        });
      }
    },
    submitForm (formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (formName) {
            case "searchForm":
              this.getList();
              break;
            case "detailForm":
              this.setDetail(type);
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
    //查看详情
    getDetail (id, detailType) {
      let info;
      if (this.checkType == 1) {
        info = registerInfo;
      } else if (this.checkType == 2) {
        info = changeInfo;
      }
      info({ id }).then(res => {
        this.detailType = detailType;
        let deliverType;
        if (this.checkType == 1) {
          deliverType = "deliveryCompany";
        } else if (this.checkType == 2) {
          deliverType = "afterDeliveryCompany";
        }
        this.addValue = { ...res.data[deliverType], ...res.data };
        if (detailType == 1 || detailType == 2) {
          this.showAudit = true;
        } else if (detailType == 3) {
          this.showDetail = true;
        }
      });
    },
    //删除
    deleteItem (id) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteInfo({ id }).then(res => {
          this.msgSuccess(res.msg);
          this.getList();
        });
      });
    },
    // 1为车辆列表，2为司机列表
    addTableItem (type) {
      if (type == 1) {
        this.addValue.deliveryVehicleList.push({
          licensePlate: undefined,
          vehicleType: undefined,
          deadWeightTonnage: undefined,
          rezEndTime: undefined,
          remark: undefined
        });
        this.rules[
          `licensePlate${this.addValue.deliveryVehicleList.length - 1}`
        ] = this.rules.licensePlate0;
      } else if (type == 2) {
        this.addValue.deliveryDriverList.push({
          realName: undefined,
          phone: undefined,
          cardNo: undefined,
          sex: undefined,
          cardFront: undefined,
          photoHealthCertificate: undefined,
          remark: undefined
        });
        const index = this.addValue.deliveryDriverList.length - 1;
        this.rules[`realName${index}`] = this.rules.realName0;
        this.rules[`phone${index}`] = this.rules.phone0;
        this.rules[`cardNo${index}`] = this.rules.cardNo0;
        this.rules[`sex${index}`] = this.rules.sex0;
      }
    },
    deleteTableItem (type, index) {
      let newVal;
      if (type == 1) {
        newVal = JSON.parse(JSON.stringify(this.addValue.deliveryVehicleList));
        newVal.splice(index, 1);
        this.addValue.deliveryVehicleList = newVal;
      } else if (type == 2) {
        newVal = JSON.parse(JSON.stringify(this.addValue.deliveryDriverList));
        newVal.splice(index, 1);
        this.addValue.deliveryDriverList = newVal;
      }
    },
    // 审核不通过
    sureUnPass () {
      const params = {
        id: this.addValue.id,
        pass: false,
        reason: this.reason
      };
      let check;
      if (this.checkType == 1) {
        check = registerCheck;
      } else if (this.checkType == 2) {
        check = changeCheck;
      }
      check(params).then(res => {
        this.getList();
        this.showReason = false;
        this.showAudit = false;
      });
    },
    // 配送商登记审核
    registerCheck () {
      this.$confirm("是否通过该配送商备案登记?", "警告", {
        confirmButtonText: "不通过",
        cancelButtonText: "通过",
        distinguishCancelAndClose: true,
        type: "warning"
      })
        .then(() => {
          this.showReason = true;
        })
        .catch(event => {
          if (event != "close") {
            const params = {
              id: this.addValue.id,
              pass: true,
              reason: undefined
            };
            let check;
            if (this.checkType == 1) {
              check = registerCheck;
            } else if (this.checkType == 2) {
              check = changeCheck;
            }
            check(params).then(res => {
              this.getList();
              this.showAudit = false;
            });
          }
        });
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
    // 上传身份证照片
    cardFrontUpload (response, fileList, index) {
      if (response.code != 500) {
        let deliveryDriverList = JSON.parse(
          JSON.stringify(this.addValue.deliveryDriverList)
        );
        let obj = Object.assign(deliveryDriverList[index], {
          cardFront: response.url
        });
        deliveryDriverList.splice(index, 1, obj);
        this.addValue.deliveryDriverList = deliveryDriverList;
      } else {
        this.msgError(response.msg);
      }
    },
    // 删除身份证图片
    cardFrontRemove (file, fileList, index) {
      let deliveryDriverList = JSON.parse(
        JSON.stringify(this.addValue.deliveryDriverList)
      );
      let obj = Object.assign(deliveryDriverList[index], {
        cardFront: ""
      });
      deliveryDriverList.splice(index, 1, obj);
      this.addValue.deliveryDriverList = deliveryDriverList;
    },

    // 上传健康证照片
    photoHealthCertificateUpload (response, fileList, index) {
      if (response.code != 500) {
        let deliveryDriverList = JSON.parse(
          JSON.stringify(this.addValue.deliveryDriverList)
        );
        let obj = Object.assign(deliveryDriverList[index], {
          photoHealthCertificate: response.url
        });
        deliveryDriverList.splice(index, 1, obj);
        this.addValue.deliveryDriverList = deliveryDriverList;
      } else {
        this.msgError(response.msg);
      }
    },
    // 删除健康证图片
    photoHealthCertificatePicRemove (file, fileList, index) {
      let deliveryDriverList = JSON.parse(
        JSON.stringify(this.addValue.deliveryDriverList)
      );
      let obj = Object.assign(deliveryDriverList[index], {
        photoHealthCertificate: ""
      });
      deliveryDriverList.splice(index, 1, obj);
      this.addValue.deliveryDriverList = deliveryDriverList;
    },
    // 查询类型名字
    searchTypeName (val, type) {
      let arr, obj;
      if (type == 1) {
        arr = this.companyType;
      } else if (type == 2) {
        arr = this.supplyType;
      }
      obj = arr.find(v => {
        return v.dictValue == val;
      });
      return !!obj ? obj.dictLabel : "-";
    },
    onClose () {
      this.addValue = {
        name: undefined,
        companyType: undefined,
        businessLicenseCode: undefined,
        companyAddress: undefined,
        companyPrincipal: undefined,
        companyTel: undefined,
        supplyType: undefined,
        supplyMaterials: undefined,
        businessScope: undefined,
        deliveryVehicleList: [
          {
            licensePlate: undefined,
            vehicleType: undefined,
            deadWeightTonnage: undefined,
            rezEndTime: undefined,
            remark: undefined
          }
        ],
        deliveryDriverList: [
          {
            realName: undefined,
            phone: undefined,
            cardNo: undefined,
            sex: undefined,
            cardFront: undefined,
            photoHealthCertificate: undefined,
            remark: undefined
          }
        ]
      };
    }
  }
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
    border-collapse: collapse;
    border: none;
    td {
      border: solid #d7d7d7 1px;
      padding: 12px 6px;
    }
    .c-td {
      height: 180px;
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
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
      <el-form-item label="司机手机号：" prop="driverPhone">
        <el-input
          v-model="searchForm.driverPhone"
          placeholder="请输入司机手机号"
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
      <el-form-item label="提交时间：" prop="time">
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
      <el-form-item label="申请人手机号：" prop="registerPhone">
        <el-input
          v-model="searchForm.registerPhone"
          placeholder="请输入申请人手机号"
          clearable
        ></el-input>
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
        align="center"
        width="230"
      ></el-table-column>
      <el-table-column
        prop="driverRegisterPhone"
        label="申请人手机号"
        width="110"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="driverCompanyName"
        label="公司名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="driverRealName"
        label="司机姓名"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="driverPhone"
        label="司机手机号"
        width="110"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="rezTypeName"
        label="入场事由"
        align="center"
        width="130"
      >
        <template slot-scope="scope">
          <span>{{ findName(scope.row.rezType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="预约时间" width="180" align="center">
        <template slot-scope="scope">
          <span
            >{{ parseTime(scope.row.rezStartTime, "{y}-{m}-{d}") }}
            {{ parseTime(scope.row.rezStartTime, "{h}:{i}") }} -
            {{ parseTime(scope.row.rezEndTime, "{h}:{i}") }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="date" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ getStatusNameByRows(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="vehicleLicensePlate" label="车牌号" align="center"></el-table-column>
      <el-table-column prop="date" label="预约类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rezSubmitType == 2 ? "加急" : "普通" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="提交时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rezSubmitTime) }}</span>
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
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="text"
            @click="getDetail(scope.row, 1)"
            >审核</el-button
          >
          <el-button
            v-if="
              scope.row.status == 2 ||
              scope.row.status == 3 ||
              scope.row.status == 8 ||
              scope.row.status == 9 ||
              scope.row.status == 0
            "
            size="mini"
            type="text"
            @click="getDetail(scope.row, 2)"
            >查看</el-button
          >
          <!-- <el-button
            v-if="scope.row.status == 3"
            size="mini"
            type="text"
            @click="editDetail(scope.row)"
            >修改</el-button
          > -->
          <el-button
            v-if="scope.row.status == 3"
            size="mini"
            type="text"
            @click="handSignIn(scope.row)"
            >手动签到</el-button
          >
          <el-button
            v-if="scope.row.status == 3"
            size="mini"
            type="text"
            @click="getDetail(scope.row, 3)"
            >取消</el-button
          >
          <el-button
            v-if="scope.row.status == 4"
            size="mini"
            type="text"
            @click="getDispatchDetail(scope.row)"
            >插队</el-button
          >
          <el-button
            v-if="scope.row.status == 6"
            size="mini"
            type="text"
            @click="getRegisterDetail(scope.row)"
            >登记放行</el-button
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

    <!-- 审核详情 -->
    <el-dialog
      :title="'预约详情审核'"
      :visible.sync="showDetail"
      width="720px"
      @closed="addValue = {}"
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
              <td>预约号：{{ addValue.rezNumber || "-" }}</td>
              <td>申请人手机号：{{ addValue.driverRegisterPhone || "-" }}</td>
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
            <tr>
              <td colspan="2">
                访客验证码：{{ addValue.visitorVerificationCode || "-" }}
              </td>
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
      <!-- 出场信息 -->
      <!-- <div v-if="addValue.releasePermitDto" style="margin-top: 22px">
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
                  是否登记放行条：{{
                    addValue.releasePermitDto.permitFlag === 1 ? "是" : "否"
                  }}
                </td>
                <td>
                  放行登记时间：{{
                    parseTime(
                      addValue.releasePermitDto.registerTime,
                      "{y}-{m}-{d}"
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  放行登记人：{{ addValue.releasePermitDto.registerBy }}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-row :gutter="12">
                    <el-col :span="24">车厢照片：</el-col>
                    <el-col
                      :span="24"
                      v-if="
                        addValue.releasePermitDto.pictures &&
                        addValue.releasePermitDto.pictures.length
                      "
                    >
                      <img
                        v-for="img in addValue.releasePermitDto.pictures"
                        :key="img"
                        :src="img"
                        style="width: 200px; height: 100px; margin:0 16px 16px 0; object-fit: contain"
                      />
                    </el-col>
                  </el-row>
                </td>
              </tr>
              <tr>
                <td>
                  出场时间：{{
                    parseTime(
                      addValue.releasePermitDto.registerTime,
                      "{y}-{m}-{d}"
                    )
                  }}
                </td>
                <td>出场门岗: {{ addValue.releasePermitDto.departureGate }}</td>
              </tr>
            </tbody>
          </table>
        </el-row>
      </div> -->
      <el-row type="flex" justify="end" style="margin-top: 16px;">
        <el-button plain @click="showDetail = false">关闭</el-button>
        <el-button v-if="detailType == 3" type="primary" @click="quxiao()"
          >取消预约</el-button
        >
        <el-button v-if="detailType == 1" type="primary" @click="registerCheck"
          >审核</el-button
        >
        <!-- <el-button v-if="detailType == 4" type="primary">插队</el-button> -->
      </el-row>
      <el-dialog
        width="640px"
        title="提示"
        :visible.sync="showReason"
        @closed="reason = ''"
        append-to-body
      >
        <!-- <p style="margin-bottom: 12px">审核不通过原因</p> -->
        <el-select
          v-model="value"
          clearable
          placeholder="请选择审核不通过原因"
          style="width: 100%; margin-bottom: 20px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="reason"
          placeholder="请输入原因"
          type="textarea"
          :maxlength="200"
          show-word-limit
          :rows="4"
          v-if="value == '其它'"
        ></el-input>
        <el-row type="flex" justify="end" style="margin-top: 12px">
          <el-button plain @click="showReason = false">取消</el-button>
          <el-button
            @click="sureUnPass"
            :disabled="(!reason && !value) || (value == '其他' && !reason)"
            type="primary"
            >确定</el-button
          >
        </el-row>
      </el-dialog>
      <el-dialog
        width="640px"
        title="提示"
        :visible.sync="showCancelReason"
        @closed="reason = ''"
        append-to-body
      >
        <p style="margin-bottom: 12px">取消预约原因</p>
        <el-input
          v-model="reason"
          placeholder="请输入原因"
          type="textarea"
          :maxlength="200"
          show-word-limit
          :rows="4"
        ></el-input>
        <el-row type="flex" justify="end" style="margin-top: 12px">
          <el-button plain @click="showCancelReason = false">取消</el-button>
          <el-button @click="sureCancel" :disabled="!reason" type="primary"
            >确定</el-button
          >
        </el-row>
      </el-dialog>
    </el-dialog>

    <!-- 修改预约时间 -->
    <el-dialog
      :title="'修改预约时间'"
      :visible.sync="showEdit"
      width="560px"
      @closed="(addValue = {}), (editForm = {})"
    >
      <el-row :gutter="20">
        <el-col :span="4" style="margin-bottom: 20px">预约时间:</el-col>
        <el-col style="margin-bottom: 20px" :span="20"
          >{{ parseTime(addValue.rezStartTime, "{y}-{m}-{d}") }}
          {{ parseTime(addValue.rezStartTime, "{h}:{i}") }}至{{
            parseTime(addValue.rezEndTime, "{h}:{i}")
          }}</el-col
        >
        <el-col :span="4" style="margin-bottom: 20px">变更时间:</el-col>
        <el-col :span="20" style="margin-bottom: 20px">
          <el-date-picker
            v-model="editForm.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-col>
        <el-col :span="24" style="margin-bottom: 12px">变更原因:</el-col>
        <el-col :span="24">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入原因"
            :maxlength="200"
            show-word-limit
            v-model="editForm.reason"
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" style="margin-top: 22px">
        <el-button plain @click="showEdit = false">取消</el-button>
        <el-button
          :disabled="editForm.time ? editForm.time.length < 2 : true"
          type="primary"
          @click="sureEdit"
          >确定</el-button
        >
      </el-row>
    </el-dialog>
    <!-- 放行登记详情 -->
    <el-dialog
      title="登记放行"
      :visible.sync="showRegisterDetail"
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
            <div>预约信息</div>
            <el-button type="text" style="padding: 0">查看更多></el-button>
          </el-row>
          <table>
            <tbody>
              <tr>
                <td>预约号：{{ addValue.rezNumber || "-" }}</td>
                <td>公司名称：{{ addValue.dyCompanyName || "-" }}</td>
              </tr>
              <tr>
                <td>车牌号：{{ addValue.dyVehicleLicensePlate || "-" }}</td>
                <td>司机：{{ addValue.dyDriverRealName || "-" }}</td>
              </tr>
              <tr>
                <td>司机电话：{{ addValue.dyDriverPhone || "-" }}</td>
                <td>入场事由：{{ findName(addValue.rezType) || "-" }}</td>
              </tr>
              <tr>
                <td>
                  预约时间：{{ parseTime(addValue.dyVehicleRezEndTime) }}
                  {{ addValue.rezStartTime }} 至 {{ addValue.rezEndTime }}
                </td>
                <td>签到时间：{{ parseTime(addValue.signTime) }}</td>
              </tr>
              <tr>
                <td>签到验证门岗：{{ addValue.signGate || "-" }}</td>
                <td>验证方式：{{ addValue.signType || "-" }}</td>
              </tr>
              <tr>
                <td>停放月台：{{ addValue.dispatchDockName || "-" }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <template v-if="detailType == 1 || detailType == 2">
            <!-- 出场信息 -->
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              class="detail-title"
            >
              <el-col>出场信息</el-col>
            </el-row>
            <template>
              <el-form-item
                label="车厢照片："
                prop="pictures"
                class="is-required"
                label-width="140px"
              >
                <ImageUpload
                  @on-success="addImg"
                  @on-remove="removeImg"
                  :showFileList="true"
                  :limit="5"
                />
              </el-form-item>
              <el-form-item label="备注：" prop="relRemark" label-width="140px">
                <el-input
                  type="textarea"
                  :rows="3"
                  :maxlength="200"
                  v-model="addValue.relRemark"
                  placeholder="请输入货车出场物品及数量描述"
                ></el-input>
              </el-form-item>
            </template>
          </template>
        </el-row>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button plain @click="showDetail = false">关闭</el-button>
        <el-button v-if="detailType == 1" @click="Register()" type="primary"
          >提交</el-button
        >
      </el-row>
    </el-dialog>
    <!-- 月台调度详情 -->
    <el-dialog
      :title="'月台调度详情'"
      :visible.sync="showDispatchDetail"
      width="720px"
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
            <div>预约信息</div>
            <el-button type="text" style="padding: 0">查看更多></el-button>
          </el-row>
          <table>
            <tbody>
              <tr>
                <td>预约号：{{ addValue.rezNumber || "-" }}</td>
                <td>公司名称：{{ addValue.dyCompanyName || "-" }}</td>
              </tr>
              <tr>
                <td>车牌号：{{ addValue.dyVehicleLicensePlate || "-" }}</td>
                <td>司机：{{ addValue.dyDriverRealName || "-" }}</td>
              </tr>
              <tr>
                <td>司机电话：{{ addValue.dyDriverPhone || "-" }}</td>
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
                    addValue.dispatchType == 2 ? "手动调度" : "自动调度"
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
        <el-button type="primary" @click="insert(addValue.id)">插队</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { cancel, change, check, info, paging, manualSign } from "@/api/order/delivery_note";
import { list } from "@/api/my-api/platformNature";
import ImageUpload from "@/components/ImageUpload";
import { releaseInfo, releaseRegister } from "@/api/order/delivery_note";
import { dispatchInfo, insertTeam } from "@/api/order/delivery_note";
import { dictType } from "@/api/my-api/dict";
import { orderStatus } from "./const";
import { parseTime } from "@/utils/ruoyi";
export default {
  components: { ImageUpload },
  data() {
    return {
      searchForm: {
        driverRealName: undefined,
        driverPhone: undefined,
        driverCompanyName: undefined,
        vehicleLicensePlate: undefined,
        status: "1",
        registerPhone: undefined,
        time: [],
      },
      detailId: "",
      detailType: 1,
      title: { 1: "预约详情审核", 2: "预约详情", 3: "修改预约时间" },
      rules: {},
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      showEdit: false,
      addValue: {
        rezRemark: undefined,
        pictures: [],
        dockDto: {},
      },
      status: orderStatus,
      showReason: false,
      reason: "",
      dockList: [],
      editForm: {
        reason: "",
        time: undefined,
        rezEndTime: "",
        rezStartTime: "",
      },
      showCancelReason: false,
      showRegisterDetail: false,
      showDispatchDetail: false,
      options: [
        // {
        //   value: "月台已满",
        //   label: "月台已满",
        // },
        // {
        //   value: "暂停服务",
        //   label: "暂停服务",
        // },
        // {
        //   value: "其它",
        //   label: "其它",
        // },
      ],
      value: "",
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
    dictType("biz_delivery_note_reject_reason").then((res) => {
      console.log(res.data);
      let data = res.data;
      let arr = [];
      for (let i in data) {
        let obj = {};
        obj.label = data[i].dictLabel;
        obj.value = data[i].dictLabel;
        arr.push(obj);
      }
      this.options = arr;
    });
    let condition = {};
    //当前日期
    let date = new Date();
    let dateTime = date.getTime();
    condition.maxRezSubmitTime = parseTime(dateTime, "{y}-{m}-{d} {h}:{i}:{s}");
    //前十天
    let beforeDay = this.getday();
    let beforeDayTime = beforeDay.getTime();
    condition.minRezSubmitTime = parseTime(
      beforeDayTime,
      "{y}-{m}-{d} {h}:{i}:{s}"
    );
    condition.status = 1;
    console.log(condition);
    const params = {
      condition,
      pageNum: 1,
      pageSize: 10,
      sorting: {},
    };
    console.log(params);
    //默认加载前十天待审核的预约信息
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
    // this.getList();
  },
  methods: {
    // getValue(val) {
    //   this.reason = val;
    // },
    // 获取statusName
    getStatusNameByRows({ status, entranceTime }) {
      if (status === 5 && entranceTime) {
        return "已调度进场中";
      }
      return this.status[status];
    },
    getday() {
      var now = new Date();
      now.setDate(now.getDate() - 10);
      return now;
    },
    getList() {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      if (condition.time) {
        condition.minRezSubmitTime = condition.time[0];
        condition.maxRezSubmitTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minRezSubmitTime;
        delete condition.maxRezSubmitTime;
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
    //登记放行
    getRegisterDetail(item) {
      let params = {
        id: item.id,
        // rezNumber: item.rezNumber
      };
      releaseInfo(params).then((res) => {
        this.addValue = res.data;
        this.showRegisterDetail = true;
      });
    },
    Register() {
      const {
        releasePermitDto: { dyNoteId },
        pictures,
        relType,
        relRemark,
      } = this.addValue;
      let params = {
        dyNoteId,
        pictures,
        relType,
        relRemark,
      };
      releaseRegister(params).then((res) => {
        this.getList();
        this.showRegisterDetail = false;
      });
    },
    addImg(response, fileList) {
      if (response.code != 500) {
        let pictures = fileList.map((v) => v.response.url);
        this.addValue.pictures = pictures;
      } else {
        this.msgError(response.msg);
      }
    },
    removeImg(response, fileList) {
      let pictures = fileList.map((v) => v.response.url);
      this.addValue.pictures = pictures;
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
      console.log(this.searchForm);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 手动签到
    handSignIn({id}) {
      manualSign({id}).then(() => {
        this.msgSuccess("手动签到成功");
        this.getList();
      });
    },
    //查看详情
    getDetail(item, detailType) {
      console.log(1);
      let params = {
        rezNumber: item.rezNumber,
        id: item.id,
      };
      this.detailType = detailType;
      this.detailId = item.id;
      console.log(this.detailId);
      info(params).then((res) => {
        this.addValue = res.data;
        this.showDetail = true;
      });
    },
    // 修改详情
    editDetail(item) {
      this.addValue = item;
      this.showEdit = true;
    },
    //调度详情
    getDispatchDetail(item) {
      let params = {
        // rezNumber: item.rezNumber,
        id: item.id,
      };
      dispatchInfo(params).then((res) => {
        this.addValue = res.data;
        this.showDispatchDetail = true;
      });
    },
    quxiao() {
      this.showCancelReason = true;
      // console.log(id);
      // this.$confirm("确定取消该预约申请吗?", "警告", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // }).then(() => {
      //   cancel(id).then((res) => {
      //     this.msgSuccess(res.msg);
      //     this.getList();
      //   });
      // });
    },
    sureCancel() {
      let params = {
        id: this.addValue.id,
        reason: this.reason,
      };
      cancel(params).then((res) => {
        this.getList();
        this.showCancelReason = false;
        this.showDetail = false;
        this.msgSuccess(res.msg);
      });
    },
    //插队
    insert(id) {
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
          this.showDispatchDetail = false;
          this.getList();
        });
      });
    },
    // 确定编辑
    sureEdit() {
      console.log(this.editForm);
      const params = {
        id: this.addValue.id,
        reason: this.editForm.reason,
        rezEndTime: this.editForm.time[0],
        rezStartTime: this.editForm.time[1],
      };
      change(params).then((res) => {
        this.msgSuccess(res.msg);
        this.showEdit = false;
        this.getList();
      });
    },
    // 审核
    registerCheck() {
      this.$confirm("是否通过该预约申请?", "警告", {
        confirmButtonText: "不通过",
        cancelButtonText: "通过",
        distinguishCancelAndClose: true,
        type: "warning",
      })
        .then(() => {
          this.showReason = true;
        })
        .catch((event) => {
          if (event != "close") {
            const params = {
              id: this.addValue.id,
              pass: true,
              reason: undefined,
            };
            check(params).then((res) => {
              this.getList();
              this.showDetail = false;
            });
          }
        });
    },
    sureUnPass() {
      let newReason;
      if (this.value == "其他") {
        newReason = this.reason;
      } else {
        newReason = this.value;
      }
      const params = {
        id: this.addValue.id,
        pass: false,
        reason: newReason,
      };
      check(params).then((res) => {
        this.getList();
        this.showReason = false;
        this.showDetail = false;
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
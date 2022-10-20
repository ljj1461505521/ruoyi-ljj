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
      <el-form-item label="司机名称：" prop="driverRealName">
        <el-input
          v-model="searchForm.driverRealName"
          placeholder="请输入司机名称"
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

      <el-form-item label="注册手机号：" prop="registerPhone">
        <el-input
          v-model="searchForm.registerPhone"
          placeholder="请输入注册手机号"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="司机证件号：" prop="driverCardNo">
        <el-input
          v-model="searchForm.driverCardNo"
          placeholder="请输入司机证件号"
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
      <el-form-item label="出场时间：" prop="time1">
        <el-date-picker
          v-model="searchForm.time1"
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
        width="110"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="driverRealName"
        label="姓名"
        width="120"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="driverPhone"
        label="司机手机号"
        width="120"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="driverRegisterPhone"
        label="注册手机号"
        width="120"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="driverCardNo"
        label="司机证件号"
        width="170"
        align="center"
      ></el-table-column>
      <el-table-column label="预约时间" width="200" align="center">
        <template slot-scope="scope">
          <span
            >{{ parseTime(scope.row.rezStartTime, "{y}-{m}-{d}") }}
            {{ parseTime(scope.row.rezStartTime, "{h}:{i}") }} 至
            {{ parseTime(scope.row.rezEndTime, "{h}:{i}") }}</span
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
        prop="dispatchTime"
        label="调度时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dispatchTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放行条" align="center">
        <template slot-scope="scope">
          <span>{{ !!scope.row.releaseRegisterTime ? "有" : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="departureTime"
        label="出场时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.departureTime) }}</span>
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
          <el-button size="mini" type="text" @click="getDetail(scope.row, 2)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handApperaScene(scope.row)"
            v-if="
              scope.row.status === 6 ||
              (scope.row.status === 5 && scope.row.entranceTime)
            "
            >手动出场</el-button
          >

          <el-button
            size="mini"
            type="text"
            v-if="
              (scope.row.status == 5 || scope.row.status == 6) &&
              !scope.row.releaseRegisterTime &&
              scope.row.dispatchStatus == 1
            "
            @click="getDetail(scope.row, 3)"
            >继续调度</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-if="
              (scope.row.status == 5 || scope.row.status == 6) &&
              !scope.row.releaseRegisterTime
            "
            @click="getDetail(scope.row, 1)"
            >放行登记</el-button
          >

          <!-- <el-button size="mini" type="text" @click="getDetail(scope.row, 3)"
            >确认放行</el-button
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
    <el-dialog
      :title="title[detailType]"
      :visible.sync="showDetail"
      width="720px"
      @closed="
        addValue = {
          relRemark: undefined,
          relType: undefined,
          pictures: [],
          dockDto: {},
          releasePermitDto: {},
        };
        fileList = [];
      "
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
            <el-button type="text" style="padding: 0" @click="addmore"
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
                <td>
                  预约时间：{{
                    parseTime(addValue.rezStartTime, "{y}-{m}-{d}")
                  }}
                  {{ parseTime(addValue.rezStartTime, "{h}:{i}") }} 至
                  {{ parseTime(addValue.rezEndTime, "{h}:{i}") }}
                </td>
                <td>签到时间：{{ parseTime(addValue.signTime) }}</td>
              </tr>
              <tr>
                <td>签到验证门岗：{{ addValue.signGate || "-" }}</td>
                <td>验证方式：{{ addValue.signType || "-" }}</td>
              </tr>
              <tr>
                <td>
                  停放月台：{{
                    addValue.dockDto ? addValue.dockDto.dockName : "-"
                  }}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <template
            v-if="detailType == 1 || detailType == 2 || detailType == 3"
          >
            <!-- 出场信息 -->
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              class="detail-title"
            >
              <el-col>出场信息</el-col>
            </el-row>
            <template v-if="detailType == 1">
              <!-- <el-form-item
                label="出场理由："
                prop="relType"
                label-width="140px"
              >
                <el-select
                  v-model="addValue.relType"
                  placeholder="请选择理由"
                  style="width: 185px"
                >
                  <el-option label="其他" value="0"></el-option>
                  <el-option label="卸货完成" value="1"></el-option>
                  <el-option label="提货完成" value="2"></el-option>
                </el-select>
              </el-form-item> -->
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
                  :fileList="fileList"
                  :limit="5"
                />
              </el-form-item>
              <div style="margin-left: 140px; margin-bottom: 20px">
                png、jpg图片格式。数量5张以内
              </div>
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
            <table v-if="detailType == 2 || detailType == 3">
              <tbody>
                <tr>
                  <td>
                    出场验证门岗：{{
                      addValue.releasePermitDto
                        ? addValue.releasePermitDto.departureGate
                        : "-"
                    }}
                  </td>
                  <td>出场时间：{{ parseTime(addValue.departureTime) }}</td>
                </tr>
                <!-- <tr>
                  <td>出场时间：2020-12-12 15:00</td>
                  <td></td>
                </tr> -->
                <tr>
                  <td class="c-td">
                    <el-row class="content">
                      <el-col :span="24">车厢照片：</el-col>
                      <span v-if="addValue.releasePermitDto">
                        <el-col
                          :span="24"
                          v-for="(item, i) in addValue.releasePermitDto
                            .pictures"
                          :key="i"
                        >
                          <img
                            v-if="addValue.releasePermitDto.pictures"
                            :src="item"
                            alt
                            style="
                              width: 200px;
                              height: 100px;
                              object-fit: contain;
                            "
                          />
                          <span v-else>-</span>
                        </el-col>
                      </span>
                      <span v-else>-</span>
                    </el-row>
                  </td>
                  <td>
                    备注：
                    {{
                      addValue.releasePermitDto
                        ? addValue.releasePermitDto.relRemark
                        : "-"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </el-row>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button plain @click="showDetail = false">关闭</el-button>
        <!-- <el-button
          v-if="detailType == 3"
          @click="submitForm('detailForm', 1)"
          type="primary"
          >确认放行</el-button
        > -->
        <el-button
          v-if="detailType == 1"
          @click="submitForm('detailForm', 2)"
          type="primary"
          >提交</el-button
        >
        <el-button v-if="detailType == 3" type="primary" @click="next()"
          >继续调度</el-button
        >
      </el-row>
    </el-dialog>
    <!-- 月台性质 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="400px">
      <el-form
        :model="fromData"
        :inline="true"
        ref="dialogVisibles"
        :rules="rules"
      >
        <el-form-item label="月台性质：" prop="dockType">
          <treeselect
            v-model="fromData.dockType"
            :multiple="false"
            :options="dockList"
            :normalizer="normalizer"
            :flat="true"
            :show-count="true"
            placeholder="请选择月台性质"
            style="width: 185px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureNext()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核详情 -->
    <el-dialog :title="'预约详情'" :visible.sync="showDetail2" width="720px">
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
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImageUpload from "@/components/ImageUpload";
import { list } from "@/api/my-api/platformNature";
import {
  releasePaging,
  releaseInfo,
  releaseRegister,
  releaseRelease,
  nextWork,
  init_register,
  manualRelease
} from "@/api/order/delivery_note";
import { parseTime } from "@/utils/ruoyi";
export default {
  components: { ImageUpload, Treeselect },
  data () {
    var checkPictures = (rule, value, callback) => {
      //   console.log(value);
      //   console.log(this.addValue.pictures);
      //   if (!!value && value.length > 0) {
      //     callback();
      //   } else {
      //
      //   }
      // console.log(this.fileList);
      // callback();
      if (this.fileList.length > 0) {
        callback();
      } else {
        callback(new Error("请上传车厢照片"));
      }
    };
    return {
      searchForm: {
        rezNumberKeyword: undefined,//预约号
        driverCompanyName: undefined,//公司名称
        vehicleLicensePlate: undefined,//车牌号
        driverRealName: undefined,//司机名称
        driverPhone: undefined,//司机手机号
        registerPhone: undefined,//注册手机号
        driverCardNo: undefined,//司机证件号
        rezNumber: undefined,
        dyCompanyName: undefined,
        dyVehicleLicensePlate: undefined,
        time: undefined,
        time1: undefined
      },
      rules: {
        relType: [{ required: true, message: "请选择理由", trigger: "blur" }],
        pictures: [{ validator: checkPictures, trigger: "blur" }],
        dockType: [
          { required: true, message: "请选择月台性质", trigger: "blur" },
        ],
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      showDetail2: false,
      title: { 1: "放行登记", 2: "放行详情", 3: "放行详情" },
      detailType: 1,
      addValue: {
        relRemark: undefined,
        relType: 0,
        pictures: [],
        dockDto: {},
        releasePermitDto: {},
      },
      dockList: [],
      fromData: {
        dockType: undefined,
      },
      normalizer (node) {
        if (node.childList && !node.childList.length) {
          delete node.childList;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.childList,
          isDisabled: !!node.childList && node.childList.length > 0,
        };
      },
      dialogVisible: false,
      dyNoteId: undefined, //订单ID
      fileList: [],
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
      if (condition.time) {
        condition.minDispatchTime = condition.time[0];
        condition.maxDispatchTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minDispatchTime;
        delete condition.maxDispatchTime;
      }
      if (condition.time1) {
        condition.minDepartureTime = condition.time1[0];
        condition.maxDepartureTime = condition.time1[1];
        delete condition.time1;
      } else {
        delete condition.minDepartureTime;
        delete condition.maxDepartureTime;
      }
      const params = {
        condition,
        pageNum,
        pageSize,
        sorting: {},
      };
      releasePaging(params).then((res) => {
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
    submitForm (formName, type) {
      this.pageNum = 1
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (formName) {
            case "searchForm":
              this.getList();
              break;
            case "detailForm":
              if (type == 1) {
                this.sureRelease();
              } else if (type == 2) {
                this.Register();
              }
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
    // 手动出场
    handApperaScene ({ id }) {
      manualRelease({ id }).then(() => {
        this.msgSuccess("手动出场成功");
        this.getList();
      })
    },
    //查看详情
    getDetail (item, detailType) {
      let params = {
        id: item.id,
        // rezNumber: item.rezNumber
      };
      init_register(params).then((res) => {
        let obj = {};
        // let arr=[];
        // obj.name=res.data.name;
        // obj.url=res.data.url;
        // arr.push(obj);
        let arr = [{ url: res.data.url }]
        this.fileList = [...arr];
      })
      releaseInfo(params).then((res) => {
        this.addValue = res.data;
        this.detailType = detailType;
        this.showDetail = true;
      });
    },
    next () {
      this.dialogVisible = true;
      this.dyNoteId = this.addValue.id;
    },
    sureNext () {
      this.$refs.dialogVisibles.validate((valid) => {
        if (valid) {
          let params = {
            dyNoteId: this.dyNoteId,
            dockType: this.fromData.dockType,
          };
          nextWork(params).then((res) => {
            if ((res.code = 200)) {
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
            this.showDetail = false;
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addmore () {
      this.showDetail2 = true;
    },
    // 确认放行
    sureRelease () {
      releaseRelease({ id: this.addValue.id }).then((res) => {
        this.getList();
        this.showDetail = false;
      });
    },
    // 登记放行
    Register () {
      console.log(this.fileList);
      let arr = [];
      let data = this.fileList;
      for (let i in data) {
        arr.push(data[i].url);
      }
      this.addValue.pictures = arr;
      const {
        // releasePermitDto: { dyNoteId },
        pictures,
        id,
        relRemark,
      } = this.addValue;
      let params = {
        dyNoteId: id,
        pictures,
        relType: 0,
        relRemark,
      };
      console.log(params);
      releaseRegister(params).then((res) => {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        this.getList();
        this.showDetail = false;
      });
    },
    addImg (response, fileList) {
      if (response.code != 500) {
        let pictures = fileList.map((v) => {
          if (v.response) {
            let obj = {};
            obj.url = v.response.url;
            this.fileList.push(obj);
          }
        });
        console.log(this.fileList);
        // this.fileList=fileList;
        // this.addValue.pictures = pictures;
        // console.log(this.addValue.pictures);
        // console.log(fileList);
      } else {
        this.msgError(response.msg);
      }
    },
    removeImg (response, fileList) {
      //   let pictures = fileList.map((v) =>{
      //     //   if(v.response){
      //     //       let obj={};
      //     //       obj.url=v.response.url;
      //     //       console.log( v.response.url)
      //     //        this.fileList.push(obj);
      //     //   }
      //     console.log(fileList)
      //     this.fileList=fileList;
      //   });
      this.fileList = fileList;
      console.log(this.fileList);
      //   this.addValue.pictures = pictures;
    },
    //删除
    deleteItem (item) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => { });
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
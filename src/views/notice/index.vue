<template>
  <div>
    <Websocket @getNotice="getNotice" />
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="消息标题：" prop="noticeTitle">
        <el-input
          v-model="searchForm.noticeTitle"
          placeholder="请输入公告标题"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="noticeType">
        <el-select v-model="searchForm.noticeType" placeholder="月台调度" clearable>
          <el-option label="全部" value></el-option>
          <el-option label="预约进度" value="300"></el-option>
          <el-option label="月台调度" value="200"></el-option>
          <el-option label="系统通知" value="100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间：" prop="time">
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
      <el-form-item label="消息状态：" prop="readFlag">
        <el-select v-model="searchForm.readFlag" placeholder="全部" clearable>
          <el-option label="全部" value></el-option>
          <el-option label="已读" value="1"></el-option>
          <el-option label="未读" value="0"></el-option>
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
      <el-button icon="el-icon-delete" type="danger" @click="deleteItems(multipleSelection)">删除</el-button>
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
        prop="noticeTitle"
        label="消息标题"
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="noticeContent"
        label="消息内容"
        align="center"
        min-width="270"
      ></el-table-column>
      <el-table-column
        prop="noticeType"
        label="消息类型"
        align="center"
        width="100"
      >
        <template slot-scope="scope">{{
          noticeType[scope.row.noticeType]
        }}</template>
      </el-table-column>
      <!-- <el-table-column
        prop="recipient"
        label="接收人"
        width="230"
        align="center"
      ></el-table-column> -->
      <el-table-column
        prop="readFlag"
        label="消息状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">{{
          scope.row.readFlag == 1 ? "已读" : "未读"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发送时间"
        align="center"
        width="180"
      >
        <template slot-scope="scope">{{
          parseTime(scope.row.createTime)
        }}</template>
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
            size="mini"
            type="text"
            @click="getDetail(scope.row, scope.row.noticeType)"
            >查看</el-button
          >
          <el-button size="mini" type="text" @click="deleteItem(scope.row.id)"
            >删除</el-button
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
    <!-- 信息详情 -->
    <el-dialog :title="'消息详情'" :visible.sync="showDetail" width="620px">
      <el-row class="detail-box" type="flex" justify="center">
        <table>
          <tbody>
            <tr>
              <td>消息标题：{{ addValue.noticeTitle }}</td>
              <td>消息类型：{{ noticeType[addValue.noticeType] }}</td>
            </tr>
            <tr>
              <td>接收人：{{ addValue.recipient }}</td>
              <td>发送时间：{{ parseTime(addValue.createTime) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="c-td">
                <el-row class="content">
                  <el-col :span="24">内容:</el-col>
                  <el-col :span="24" class="words">{{
                    addValue.noticeContent
                  }}</el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>
    </el-dialog>
    <!-- 审核详情信息 -->
    <el-dialog
      title="预约详情审核"
      :visible.sync="dialogFormVisible"
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
        <table>
          <tbody>
            <tr>
              <td>预约号：{{ addValue.rezNumber || "-" }}</td>
              <td>申请人手机号：{{ addValue.driverRegisterPhone || "-" }}</td>
            </tr>
            <tr>
              <td>公司名称：{{ addValue.driverCompanyName || "-" }}</td>
              <td>司机电话：{{ addValue.dyDriverPhone || "-" }}</td>
            </tr>
            <tr>
              <td>司机名称：{{ addValue.driverRealName || "-" }}</td>
              <td>车牌号码：{{ addValue.vehicleLicensePlate || "-" }}</td>
            </tr>
            <tr>
              <td>车辆吨位：{{ addValue.vehicleTonnage || "-" }}</td>
              <td>类型：{{ addValue.rezSubmitType == 2 ? "加急" : "普通" }}</td>
            </tr>
            <tr>
              <td>
                预约时段：{{ parseTime(addValue.rezStartTime, "{y}-{m}-{d}") }}
                {{ parseTime(addValue.rezStartTime, "{h}:{i}") }}至{{
                  parseTime(addValue.rezEndTime, "{h}:{i}")
                }}
              </td>
              <td>入场事由：{{ findName(addValue.rezType) || "-" }}</td>
            </tr>
            <tr>
              <td>身份证号：{{ addValue.driverCardNo || "-" }}</td>
              <td>
                随车人员：<span v-if="addValue.entourageList">有</span
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
                  <el-col v-else>-</el-col>
                </el-row>
              </td>
              <td>
                <el-row :gutter="12">
                  <el-col :span="24">司机人脸图片：</el-col>
                  <el-col :span="24" v-if="addValue.driverPhotoFace">
                    <img
                      :src="addValue.driverPhotoFace"
                      style="width: 200px; height: 100px; object-fit: contain"
                    />
                  </el-col>
                  <el-col v-else>-</el-col>
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
                  <el-col v-else>-</el-col>
                </el-row>
              </td>
              <td>备注：{{ addValue.rezRemark || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </el-row>
      <!-- 人员信息 -->
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="detail-title"
        v-if="addValue.entourageList && addValue.entourageList.length > 0"
      >
        <el-col>随车人员信息</el-col>
      </el-row>
      <div v-for="item in addValue.entourageList" :key="item.dyDriverId">
        <p style="margin-left: 22px">随车人员:</p>
        <el-row class="detail-box" type="flex" justify="center">
          <table>
            <tbody>
              <tr>
                <td>姓名：{{ item.realName || "-" }}</td>
                <td>联系电话：{{ item.phone || "-" }}</td>
              </tr>
              <tr>
                <td>身份证号：{{ item.cardNo || "-" }}</td>
                <td>
                  <el-row :gutter="12">
                    <el-col :span="24">人脸照片：</el-col>
                    <el-col :span="24">
                      <img
                        :src="item.photoFace"
                        style="width: 200px; height: 100px; object-fit: contain"
                      />
                    </el-col>
                  </el-row>
                </td>
              </tr>

              <tr>
                <td>
                  <el-row :gutter="12">
                    <el-col :span="24">身份证（正面）：</el-col>
                    <el-col :span="24">
                      <img
                        :src="item.cardFront"
                        style="width: 200px; height: 100px; object-fit: contain"
                      />
                    </el-col>
                  </el-row>
                </td>
                <td>
                  <el-row :gutter="12">
                    <el-col :span="24">行程卡：</el-col>
                    <el-col :span="24">
                      <img
                        :src="item.photoItinerary"
                        style="width: 200px; height: 100px; object-fit: contain"
                      />
                    </el-col>
                  </el-row>
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>
      </div>
      <div>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-title"
          v-if="addValue.checkBy"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button
          type="primary"
          @click="registerCheck"
          v-if="addValue.status == 1"
          >审核</el-button
        >
        <el-button
          type="primary"
          @click="handleCancel(addValue.id)"
          v-if="addValue.status == 3"
          >取消</el-button
        >
      </div>
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
          <el-button @click="sureUnPass" :disabled="!reason" type="primary"
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
        <p style="margin-bottom: 12px">取消预约的原因</p>
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
          <el-button @click="sureCancel" :disabled="!reason" type="primary"
            >确定</el-button
          >
        </el-row>
      </el-dialog>
    </el-dialog>
    <!-- 调度详情 -->
    <el-dialog
      title="月台调度详情"
      :visible.sync="dialogDispatch"
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
        <el-col style="text-align: right">
          <span> 查看更多></span>
        </el-col>
      </el-row>
      <el-row class="detail-box" type="flex" justify="center">
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
                预约时段：{{ parseTime(addValue.rezStartTime, "{y}-{m}-{d}") }}
                {{ parseTime(addValue.rezStartTime, "{h}:{i}") }}至{{
                  parseTime(addValue.rezEndTime, "{h}:{i}")
                }}
              </td>
              <td></td>
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
        <el-col>调度信息</el-col>
      </el-row>
      <el-row class="detail-box" type="flex" justify="center">
        <table>
          <tbody>
            <tr>
              <td>签到时间：{{ addValue.signTime || "-" }}</td>
              <td>签到门岗：{{ addValue.signGate || "-" }}</td>
            </tr>
            <tr>
              <td>签到方式：{{ addValue.signType || "-" }}</td>
              <td>停放月台：{{ addValue.dispatchDockName || "-" }}</td>
            </tr>

            <tr>
              <td>
                调度类型:{{
                  addValue.dispatchType == 2 ? "手动调度" : "自动调度"
                }}
              </td>
              <td>调度人：{{ addValue.dispatchBy || "-" }}</td>
            </tr>
            <tr>
              <td>
                调度时间：{{ parseTime(addValue.dispatchTime, "{y}-{m}-{d}") }}
                {{ parseTime(addValue.dispatchTime, "{h}:{i}") }}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDispatch = false">关闭</el-button>
        <el-button type="primary" @click="handleCancelDispatch(addValue.id)"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  info,
  check,
  cancel,
  cancelDispatch,
  dispatchInfo,
} from "@/api/order/delivery_note";
import { paging, deleteItem, messageInfo } from "@/api/my-api/message";
import { list } from "@/api/my-api/platformNature";
import { parseTime } from "@/utils/ruoyi";
import Websocket from "@/components/Websocket";
export default {
  components: { Websocket },
  data() {
    return {
      searchForm: {
        noticeTitle: undefined,
        noticeType: undefined,
        time: [],
        readFlag: undefined,
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
      noticeType: {
        100: "系统通知",
        200: "月台调度",
        300: "预约进度",
      },
      addValue: {},
      detailType: "",
      dialogFormVisible: false,
      showReason: false,
      reason: "",
      dockList: [],
      dialogDispatch: false,
      showCancelReason: false,
    };
  },
  created() {
    this.getList();
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
  },
  methods: {
    getList() {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      let condition = JSON.parse(JSON.stringify(searchForm));
      if (condition.time) {
        condition.minCreateTime = condition.time[0];
        condition.maxCreateTime = condition.time[1];
        delete condition.time;
      } else {
        delete condition.minCreateTime;
        delete condition.maxCreateTime;
      }
      if (condition.noticeType == "") {
        delete condition.noticeType;
      }
      if (condition.readFlag == "") {
        delete condition.readFlag;
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
    getNotice(data) {
      console.log(data);
      this.tableData.push(data);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList();
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
    getMessage(params) {
      messageInfo(params).then((res) => {});
    },
    //查看详情
    getDetail(item, detailType) {
      this.detailType = detailType;
      console.log(this.detailType);
      // let str = item.noticeContent;
      // let arr = str.split("，");
      // let str1 = arr[0];
      // console.log(str1);
      // let str2 = str1.split("号")[1];
      let params = {
        rezNumber: item.rezNumber,
      };
      if (this.detailType == 300) {
        // let params = {
        //   id: item.id,
        // };
        this.getMessage({ id: item.id });
        info(params).then((res) => {
          this.addValue = res.data;
          this.dialogFormVisible = true;
        });
      } else if (this.detailType == 200) {
        // let params = {
        //   // rezNumber: item.rezNumber,
        //   id: item.id,
        // };
        this.getMessage({ id: item.id });
        dispatchInfo(params).then((res) => {
          this.addValue = res.data;
          this.dialogDispatch = true;
        });
      } else if ((this.detailType = 100)) {
        messageInfo({ id: item.id }).then((res) => {
          this.addValue = res.data;
          this.showDetail = true;
        });
      }
    },
    //查看更多
    seeMore(id) {
      let params = {
        id: id,
      };
      this.getDetail(params, 300);
    },
    //取消调度
    handleCancelDispatch(id) {
      this.$confirm("是否取消调度?", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        distinguishCancelAndClose: true,
        type: "warning",
      }).then(() => {
        cancelDispatch({ id: id }).then((res) => {
          if ((res.code = 200)) {
            this.$message({
              type: "info",
              message: res.msg,
            });
            this.dialogDispatch = false;
            this.getList();
          }
        });
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
              this.dialogFormVisible = false;
            });
          }
        });
    },
    // 取消预约
    handleCancel(id) {
      this.$confirm("是否取消该预约?", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        distinguishCancelAndClose: true,
        type: "warning",
      })
        .then(() => {
          this.showCancelReason = true;
        })
        .catch((event) => {});
    },
    sureCancel() {
      let params = {
        id: this.addValue.id,
        reason: this.reason,
      };
      cancel(params).then((res) => {
        this.msgSuccess(res.msg);
      });
    },
    sureUnPass() {
      const params = {
        id: this.addValue.id,
        pass: false,
        reason: this.reason,
      };
      check(params).then((res) => {
        this.getList();
        this.showReason = false;
        this.dialogFormVisible = false;
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
    //多选删除
    deleteItems(row){
        let arr=row.map(item =>item.id);
        console.log(arr);
        // let ids=arr.join(",");
        // console.log(ids);
        arr.forEach(id=>{
            deleteItem({id}).then((res)=>{
                    if(id==arr[arr.length-1]){
                        this.getList();
                        this.msgSuccess(res.msg);
                    }
            })
        })
          
    },
    //删除
    deleteItem(id) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteItem({ id }).then((res) => {
          this.getList();
          this.msgSuccess(res.msg);
        });
      });
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
  margin-bottom: 20px;
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
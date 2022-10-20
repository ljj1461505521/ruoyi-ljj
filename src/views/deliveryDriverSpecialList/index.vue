<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="条件：">
        <el-row>
          <el-col :span="10">
            <el-select v-model="searchForm.fieldKey" placeholder="全部">
              <el-option label="全部" value></el-option>
              <el-option label="申请人手机号" value="registerPhone"></el-option>
              <el-option label="身份证号" value="driverCardNo"></el-option>
              <el-option label="司机手机号" value="driverPhone"></el-option>
              <el-option label="车牌号" value="vehicleLicensePlate"></el-option>
            </el-select>
          </el-col>
          <el-col :span="14">
            <el-input
              v-model="searchForm.fieldValue"
              placeholder="请输入关键词"
              clearable
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select v-model="searchForm.specialType" placeholder="全部" clearable>
          <el-option label="全部" value></el-option>
          <el-option label="白名单" value="1"></el-option>
          <el-option label="黑名单" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置时间：" prop="time">
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
    <el-row style="margin-bottom: 20px">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="dialogFormVisible = true"
        >新增</el-button
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
      <el-table-column
        prop="registerPhone"
        label="名单名称"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ keyType[scope.row.fieldKey] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="registerPhone"
        label="内容"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fieldValue }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="specialType"
        label="类型"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ type[scope.row.specialType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="加入原因"
        width="250"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="设置时间"
        width="230"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="操作"
        align="center"
        fixed="right"
        min-width="180"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="setOutWhite(scope.row)"
            v-if="scope.row.specialType == 1"
            >移出白名单</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="setOutBlacklist(scope.row)"
            v-if="scope.row.specialType == 2"
            >移出黑名单</el-button
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
    <!-- 加入黑名单 -->
    <!-- <el-dialog
      :title="'加入黑名单'"
      :visible.sync="showBlacklist"
      width="520px"
    >
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="top"
      >
        <el-form-item
          label="请输入加入原因："
          prop="remark"
          label-width="120px"
        >
          <el-input
            v-model="addValue.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入原因"
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="end" align="middle">
          <el-button plain @click="showBlacklist = false">取消</el-button>
          <el-button type="primary" @click="submitForm('detailForm')"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-dialog> -->

    <!-- 访客详情 -->
    <!-- <el-dialog
      :title="'访客详情'"
      :visible.sync="showAudit"
      width="720px"
      @closed="detail = {}"
    >
      <el-row class="detail-box">
        <el-col :span="24">
          <table>
            <tbody>
              <tr>
                <td>公司名称：{{ detail.deliveryCompanyName || "-" }}</td>
                <td>司机姓名：{{ detail.realName || "-" }}</td>
              </tr>
              <tr>
                <td>司机手机号：{{ detail.phone || "-" }}</td>
                <td>身份证号：{{ detail.cardNo || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col>
          <el-button type="text" style="float: right; margin-top: 20px"
            >查看更多</el-button
          >
        </el-col>
      </el-row>
    </el-dialog> -->
    <el-dialog
      title="新增"
      :visible.sync="dialogFormVisible"
      width="700px"
      @closed="onClose"
    >
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="fieldList"
          :rules="rules"
          size="medium"
          label-width="120px"
        >
          <el-col :span="12">
            <el-form-item label="申请人手机号：" prop="registerPhone1">
              <el-input
                v-model="fieldList.registerPhone"
                placeholder="请输入申请人手机号"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机手机号码：" prop="driverPhone">
              <el-input
                v-model="fieldList.driverPhone"
                placeholder="请输入司机手机号码"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号：" prop="vehicleLicensePlate">
              <el-input
                v-model="fieldList.vehicleLicensePlate"
                placeholder="请输入车牌号"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="driverCardNo">
              <el-input
                v-model="fieldList.driverCardNo"
                placeholder="请输入身份证号"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="addValue"
          :rules="rules"
          size="medium"
          label-width="110px"
        >
          <el-col :span="24">
            <el-form-item label="类型：" prop="specialType">
              <el-radio v-model="addValue.specialType" label="1"
                >白名单</el-radio
              >
              <el-radio v-model="addValue.specialType" label="2"
                >黑名单</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加入原因：">
              <el-input
                v-model="addValue.remark"
                placeholder="请输入加入原因"
                type="textarea"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="handelConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import { parseTime } from "@/utils/ruoyi";
import {
  paging,
  addWhiteBlackList,
  remove_whitelist,
  remove_blacklist,
} from "@/api/my-api/visitor";
export default {
  components: { ImageUpload },
  data() {
    return {
      fieldList: {
        registerPhone: undefined,
        driverPhone: undefined,
        driverCardNo: undefined,
        vehicleLicensePlate: undefined,
      },
      searchForm: {
        fieldKey: undefined,
        fieldValue: undefined,
        specialType: undefined,
        time: [],
      },
      rules: {
        specialType: [
          { required: true, message: "请选择名单类型", trigger: "blur" },
        ],
        // registerPhone1: {
        //   required: true,
        //   message: "请输入申请人手机号",
        //   trigger: "blur",
        // },
        // driverPhone: {
        //   required: true,
        //   message: "请输入司机手机号",
        //   trigger: "blur",
        // },
        // vehicleLicensePlate: {
        //   required: true,
        //   message: "请输入车牌号",
        //   trigger: "blur",
        // },
        // driverCardNo: {
        //   required: true,
        //   message: "请输入身份证号",
        //   trigger: "blur",
        // },
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showBlacklist: false,
      addValue: {
        remark: undefined,
      },
      showAudit: false,
      detail: {},
      dialogFormVisible: false,
      type: {
        1: "白名单",
        2: "黑名单",
      },
      keyType: {
        registerPhone: "申请人手机号",
        driverPhone: "司机手机号",
        vehicleLicensePlate: "车牌号",
        driverCardNo: "身份证号",
      },
    };
  },
  created() {
    this.getList();
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
      if (condition.specialType == "") {
        delete condition.specialType;
      }
      if (condition.fieldKey == "") {
        delete condition.fieldKey;
      }
      const params = {
        condition: condition,
        pageNum,
        pageSize,
      };
      paging(params).then((res) => {
        if (res.code == 200) {
          let jsonData = res.rows;
          console.log(jsonData);
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
    //添加的确定按钮
    handelConfirm() {
      if (
        !!this.fieldList.registerPhone ||
        !!this.fieldList.driverPhone ||
        !!this.fieldList.driverCardNo ||
        !!this.fieldList.vehicleLicensePlate
      ) {
        let info = [];
        let obj = this.fieldList;
        for (let item in obj) {
          let list = {};
          if (!!obj[item]) {
            list.fieldKey = item;
            list.fieldValue = obj[item];
            info.push(list);
          }
        }
        console.log(info);
        this.addValue["fieldList"] = info;
        console.log(this.addValue);
        addWhiteBlackList(this.addValue).then((res) => {
          if (res.code == "200") {
            this.dialogFormVisible = false;
            this.getList();
            this.$message({
              message: res.msg,
              type: "success",
            });
          }
        });
      } else {
        this.$message.error(
          "申请人手机号、司机手机号、车牌号、身份证号四个必填一项"
        );
        return;
      }
      console.log(1111);
    },
    onClose() {
      this.dialogFormVisible = false;
      this.addValue = {};
      this.fieldList = {};
    },
    // setBlack() {
    //   set_blacklist(this.addValue).then((res) => {
    //     this.getList();
    //     this.showBlacklist = false;
    //   });
    // },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList();
          // this.searchForm = {};
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.searchForm = {
        fieldKey: undefined,
        fieldValue: undefined,
        specialType: undefined,
        time: [],
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看详情
    // getDetail(item) {
    //   const params = {
    //     cardNo: item.cardNo,
    //     deliveryCompanyId: item.deliveryCompanyId,
    //   };
    //   info(params).then((res) => {
    //     this.detail = res.data;
    //     this.showAudit = true;
    //   });
    // },
    //移出白名单
    setOutWhite(item) {
      this.$confirm("确定移出白名单？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          fieldKey: item.fieldKey,
          fieldValue: item.fieldValue,
        };
        console.log(params);
        remove_whitelist(params).then((res) => {
          this.msgSuccess(res.msg);
          this.getList();
          console.log(res);
        });
      });
    },
    //移出黑名单
    setOutBlacklist(item) {
      this.$confirm("确定移出黑名单？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          fieldKey: item.fieldKey,
          fieldValue: item.fieldValue,
        };
        console.log(params);
        remove_blacklist(params).then((res) => {
          this.msgSuccess(res.msg);
          this.getList();
        });
      });
    },
    //删除
    // deleteItem(item) {
    //   this.$confirm("是否确定删除?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {});
    // },
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
    margin: 0 auto;
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
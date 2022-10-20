<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="公司名称：" prop="deliveryCompanyName">
        <el-input v-model="searchForm.deliveryCompanyName" placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="司机姓名：" prop="realName">
        <el-input v-model="searchForm.realName" placeholder="请输入司机姓名"></el-input>
      </el-form-item>
      <el-form-item label="司机手机号：" prop="phone">
        <el-input v-model="searchForm.phone" placeholder="请输入司机手机号"></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" prop="time">
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
        <el-button type="primary" @click="submitForm('searchForm')" icon="el-icon-search">查询</el-button>
        <el-button @click="resetForm('searchForm')" icon="el-icon-refresh">重置</el-button>
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
      <el-table-column prop="deliveryCompanyName" label="公司名称" align="center"></el-table-column>
      <el-table-column prop="realName" label="司机姓名" width="100" align="center"></el-table-column>
      <el-table-column prop="phone" label="司机手机号" width="180" align="center"></el-table-column>
      <el-table-column prop="cardNo" label="身份证号" width="250" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="230" align="center">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="setBlacklist(scope.row)"
          >移出黑名单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end" style="margin-top:12px;">
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
    <el-dialog :title="'加入黑名单'" :visible.sync="showBlacklist" width="520px">
      <el-form ref="detailForm" :rules="rules" :model="addValue" label-position="top">
        <el-form-item label="请输入加入原因：" prop="remark" label-width="120px">
          <el-input v-model="addValue.remark" type="textarea" :rows="3" placeholder="请输入原因"></el-input>
        </el-form-item>
        <el-row type="flex" justify="end" align="middle">
          <el-button plain @click="showBlacklist=false">取消</el-button>
          <el-button type="primary" @click="submitForm('detailForm')">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 访客详情 -->
    <el-dialog :title="'访客详情'" :visible.sync="showAudit" width="720px" @closed="detail={}">
      <el-row class="detail-box">
        <el-col :span="24">
          <table>
            <tbody>
              <tr>
                <td>公司名称：{{detail.deliveryCompanyName}}</td>
                <td>司机姓名：{{detail.realName}}</td>
              </tr>
              <tr>
                <td>司机手机号：{{detail.phone}}</td>
                <td>身份证号：{{detail.cardNo}}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col>
          <el-button type="text" style="float:right;margin-top:20px;">查看更多</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import { parseTime } from "@/utils/ruoyi";
import {
  paging,
  info,
  set_whitelist,
  set_blacklist,
  remove_whitelist,
  remove_blacklist
} from "@/api/my-api/visitor";
export default {
  components: { ImageUpload },
  data() {
    return {
      searchForm: {
        specialType: 2,
        deliveryCompanyName: undefined,
        realName: undefined,
        phone: undefined,
        time: []
      },
      rules: {
        remark: [{ required: true, message: "请输入原因", trigger: "blur" }]
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showBlacklist: false,
      addValue: {
        remark: undefined
      },
      showAudit: false,
      detail: {}
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
      const params = {
        condition: condition,
        pageNum,
        pageSize
      };
      paging(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = parseInt(res.total);
          this.loading = false;
        } else {
          this.$message({
            type: "info",
            message: res.msg
          });
        }
      });
    },
    setBlack() {
      set_blacklist().then(res => {
        this.getList();
        this.showAudit = false;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (formName) {
            case "searchForm":
              this.getList();
              break;
            case "detailForm":
              this.setBlack();
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
    getDetail(item) {
      const params = {
        cardNo: item.cardNo,
        deliveryCompanyId: item.deliveryCompanyId
      };
      info(params).then(res => {
        this.detail = res.data;
        this.showAudit = true;
      });
    },
    //移出黑名单
    setBlacklist(item) {
      this.$confirm(
        "确定移出黑名单？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const params = {
          cardNo: item.cardNo,
          deliveryCompanyId: item.deliveryCompanyId
        };
        remove_blacklist(params).then(res => {
          this.msgSuccess(res.msg)
          this.getList()
        });
      });
    },
    //删除
    deleteItem(item) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {});
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
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
<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="假日名称：" prop="holidayName">
        <el-input
          v-model="searchForm.holidayName"
          placeholder="请输入假日名称"
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
    <el-row type="flex" justify="space-between" style="margin-bottom: 22px">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="(showDetail = true), (title = '新增假日')"
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
      <el-table-column
        prop="holidayName"
        label="假日名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="date"
        label="假日时间"
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="holidayDesc"
        label="描述"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="holidayOprBy"
        label="操作账户"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="holidayOprTime"
        label="创建时间"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.holidayOprTime) }}</span>
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
            >编辑</el-button
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
    <!-- 新增假日 -->
    <el-dialog
      :title="title"
      :visible.sync="showDetail"
      width="620px"
      @closed="addValue = {}"
    >
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <el-row type="flex" justify="space-between">
          <el-form-item label="假日名称" prop="holidayName" label-width="80px">
            <el-input
              v-model="addValue.holidayName"
              placeholder="请输入假日名称"
              :maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="假日时间" prop="date" label-width="80px">
            <el-date-picker
              v-model="addValue.date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择假日时间"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-form-item label="描述" prop="holidayDesc" label-width="80px">
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="200"
            show-word-limit
            v-model="addValue.holidayDesc"
            placeholder="请输入200字以内说明"
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="end" align="middle">
          <el-button @click="showDetail = false">取消</el-button>
          <el-button type="primary" @click="submitForm('detailForm')"
            >提交</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :title="'查看假日'"
      :visible.sync="showInfo"
      width="620px"
      @closed="addValue = {}"
    >
      <el-row class="detail-box" type="flex" justify="center">
        <table>
          <tbody>
            <tr>
              <td>假日名称：{{ addValue.holidayName }}</td>
              <td>假日时间：{{ addValue.date }}</td>
            </tr>
            <tr>
              <td colspan="2" class="c-td">
                <el-row class="content">
                  <el-col :span="24">描述：</el-col>
                  <el-col :span="24" class="words">{{
                    addValue.holidayDesc
                  }}</el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { add, deleteItem, info, paging, update } from "@/api/my-api/dataConfig";
import { parseTime } from "@/utils/ruoyi";
export default {
  data() {
    return {
      searchForm: {
        holidayName: undefined,
      },
      rules: {
        holidayName: [
          { required: true, message: "请输入假日名称", trigger: "blur" },
        ],
        date: [{ required: true, message: "请选择假日时间", trigger: "blur" }],
      },
      tableData: [{}],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: "新增假日",
      multipleSelection: [], //表格多选
      showDetail: false,
      addValue: {
        holidayName: undefined,
        time: undefined,
        holidayDesc: undefined,
      },
      showInfo: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      const params = {
        condition: { ...searchForm },
        pageNum,
        pageSize,
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
    setDetail() {
      let myFunction;
      let params;
      if (!!this.addValue.id) {
        myFunction = update;
        params = JSON.parse(JSON.stringify(this.addValue));
      } else {
        myFunction = add;
        params = JSON.parse(JSON.stringify(this.addValue));
        params.startDate = params.date;
        params.endDate = params.date;
        delete params.date;
      }
      // let params = JSON.parse(JSON.stringify(this.addValue));

      myFunction(params).then((res) => {
        this.getList();
        this.showDetail = false;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (formName) {
            case "searchForm":
              this.getList();
              break;
            case "detailForm":
              this.setDetail();
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
    getDetail(id, type) {
      info({ id }).then((res) => {
        this.addValue = {
          ...res.data,
          time: parseTime(res.data.date),
        };
        if (type == 1) {
          this.showInfo = true;
        } else if (type == 2) {
          this.title = "编辑假日";
          this.showDetail = true;
        }
      });
    },
    //删除
    deleteItem(id) {
      this.$confirm("是否确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteItem({ idList: [id] }).then((res) => {
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
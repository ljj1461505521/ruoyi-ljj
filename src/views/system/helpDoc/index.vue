<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="关键词：" prop="title">
        <el-input
          v-model="searchForm.title"
          placeholder="请输入关键词"
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
        @click="(showAdd = true), (title = '新增说明')"
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
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        min-width="300"
        max-width="400"
        align="left"
      >
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ { 1: "帮助文档", 5: "预约须知" }[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="popupFlag" label="是否弹窗" align="center"
        ><template slot-scope="scope">
          <span>{{ { 0: "N", 1: "Y" }[scope.row.popupFlag] }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="popupCountdown"
        label="倒计时"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="sort"
        label="显示顺序"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="useUserType"
        label="操作账户"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ useUserType[scope.row.useUserType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="操作"
        align="center"
        min-width="180"
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
    <!-- 新增说明 -->
    <el-dialog
      :title="title"
      :visible.sync="showAdd"
      width="620px"
      @closed="onClose"
    >
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <el-row type="flex" justify="space-between">
          <el-form-item label=" 标题" prop="title" label-width="80px">
            <el-input
              v-model="addValue.title"
              :maxlength="12"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户" prop="useUserType" label-width="100px">
            <el-select v-model="addValue.useUserType" placeholder="请选择用户">
              <el-option label="全部" :value="0"></el-option>
              <!-- <el-option label="后台用户" :value="1"></el-option> -->
              <el-option label="司机端用户" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="类型" prop="type" label-width="80px">
            <el-select
              v-model="addValue.type"
              placeholder="请选择类型"
              :disabled="show == 1 ? true : false"
            >
              <el-option label="帮助文档" :value="1"></el-option>
              <el-option label="预约须知" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="弹窗倒计时"
            prop="popupCountdown"
            label-width="100px"
            v-if="addValue.type == 5 ? true : false"
          >
            <el-input
              v-model="addValue.popupCountdown"
              :maxlength="10"
              placeholder="请输入弹窗倒计时"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="内容" prop="content" label-width="80px">
          <Editor v-model="addValue.content" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort" label-width="80px">
          <el-input-number
            v-model="addValue.sort"
            placeholder="请输入显示顺序"
          ></el-input-number>
        </el-form-item>
        <el-row type="flex" justify="end" align="middle">
          <el-button @click="showAdd = false">取消</el-button>
          <el-button type="primary" @click="submitForm('detailForm')"
            >提交</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      :title="'说明详情'"
      :visible.sync="showDetail"
      width="620px"
      @closed="onClose"
    >
      <el-row class="detail-box" type="flex" justify="center">
        <table>
          <tbody>
            <tr>
              <td>标题：{{ addValue.title || "-" }}</td>
              <td>用户：{{ useUserType[addValue.useUserType] || "-" }}</td>
            </tr>
            <tr></tr>
            <tr>
              <td>弹窗倒计时：{{ addValue.popupCountdown || "-" }}</td>
              <td>显示顺序：{{ addValue.sort || "-" }}</td>
            </tr>
            <tr>
              <td>
                类型：{{ { 1: "帮助文档", 5: "预约须知" }[addValue.type] }}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2" class="c-td">
                <el-row class="content">
                  <el-col :span="24">内容:</el-col>
                  <el-col :span="24" class="words">
                    <div v-html="addValue.content"></div>
                  </el-col>
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
import Editor from "@/components/Editor";
import { parseTime } from "@/utils/ruoyi";
import { add, deleteItem, info, paging, update } from "@/api/system/helptext";
export default {
  components: { Editor },
  data() {
    var contentPass = (rule, value, callback) => {
      if (value.length > 2000) {
        callback(new Error("最多输入2000个字符"));
      } else {
        callback();
      }
    };
    return {
      searchForm: {
        title: undefined,
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            pattern: /^[\u4e00-\u9fa5a-z0-9]+$/i,
            message: "仅限汉字，英文和数字",
            trigger: "blur",
          },
        ],
        useUserType: [
          { required: true, message: "请选择用户", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
          },
        ],
        popupCountdown: [
          {
            required: true,
            message: "请输入倒计时长",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请填写内容", trigger: "blur" },
          { validator: contentPass, trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入显示顺序", trigger: "blur" }],
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      title: "新增说明",
      addValue: {
        title: undefined,
        content: undefined,
        picCover: undefined,
        sort: undefined,
        title: undefined,
        useUserType: undefined,
        popupCountdown: undefined,
      },
      show: 0,
      showAdd: false,
      useUserType: {
        0: "全部",
        1: "后台用户",
        3: "司机端用户",
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
      const params = {
        condition: { ...searchForm },
        pageNum,
        pageSize,
      };
      paging(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows.map((v) => {
            return {
              ...v,
              content: v.content.replace(
                /\<img/gi,
                '<img style="max-width:100%;"'
              ),
            };
          });
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
      if (this.addValue.id) {
        myFunction = update;
      } else {
        myFunction = add;
      }
      myFunction(this.addValue).then((res) => {
        this.getList();
        this.showAdd = false;
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
        if (type == 1) {
          this.showDetail = true;
        } else if (type == 2) {
          this.title = "编辑说明";
          this.showAdd = true;
          this.show = 1;
        }
        this.addValue = res.data;
      });
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
    onClose() {
      this.addValue = {};
      this.show = 0;
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
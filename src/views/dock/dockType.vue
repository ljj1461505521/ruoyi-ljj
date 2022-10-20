<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="月台性质：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入月台性质"
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
      <el-button icon="el-icon-plus" type="primary" @click="showDetail = true"
        >新增</el-button
      >
      <!-- <el-button icon="el-icon-delete" type="danger" @click="deleteItem">删除</el-button> -->
    </el-row>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      default-expand-all
      row-key="id"
      :tree-props="{ children: 'childList' }"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column
        prop="name"
        label="月台性质"
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dockTotal"
        label="月台数量"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="appointmentTotal"
        label="上限数量/每小时"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        min-width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createBy"
        label="创建人"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
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
        width="180"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="!!scope.row.childList"
            size="mini"
            type="text"
            @click="getDetail(scope.row, 1)"
            >新增</el-button
          >
          <el-button size="mini" type="text" @click="getDetail(scope.row, 2)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="deleteItem(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <el-row type="flex" justify="end" style="margin-top: 12px">
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
    </el-row> -->
    <!-- 新增月台性质 -->
    <el-dialog
      :title="'新增月台性质'"
      :visible.sync="showDetail"
      width="620px"
      @closed="onClose"
    >
      <el-form
        ref="detailForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <div style="width: 70%; margin: 0 auto">
          <el-form-item
            v-if="pidList.length > 0"
            label="上级类目"
            prop="pid"
            label-width="140px"
          >
            <el-select
              v-model="addValue.pid"
              :disabled="true"
              placeholder="请选择上级类目"
              style="width: 100%"
            >
              <el-option
                v-for="item in pidList"
                :label="item.name"
                :value="item.pid"
                :key="item.pid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="月台性质" prop="name" label-width="140px">
            <el-input
              v-model="addValue.name"
              placeholder="请输入月台性质"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="上限数量/每小时"
            prop="appointmentTotal"
            label-width="140px"
            v-if="pidList.length > 0"
          >
            <el-input
              v-model="addValue.appointmentTotal"
              placeholder="请输入每小时上限数量"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="说明"
            prop="desc"
            label-width="140px"
            v-if="pidList.length > 0"
          >
            <el-input
              type="textarea"
              :rows="3"
              :maxlength="200"
              v-model="addValue.desc"
              placeholder="请输入200字以内说明"
            ></el-input>
          </el-form-item>
        </div>
        <el-row type="flex" justify="end" align="middle">
          <el-button plain @click="showDetail = false">取消</el-button>
          <el-button type="primary" @click="submitForm('detailForm')"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 修改月台性质-->
    <el-dialog
      :title="'修改月台性质'"
      :visible.sync="showEdit"
      width="620px"
      @closed="onClose"
    >
      <el-form
        ref="editForm"
        :rules="rules"
        :model="addValue"
        label-position="left"
      >
        <div style="width: 70%; margin: 0 auto">
          <el-form-item
            v-if="addValue.level == 2"
            label="上级类目"
            prop="pid"
            label-width="140px"
          >
            <el-select
              v-model="addValue.pid"
              placeholder="请选择上级类目"
              style="width: 100%"
            >
              <el-option
                v-for="item in pidList"
                :label="item.name"
                :value="item.pid"
                :key="item.pid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="月台性质" prop="name" label-width="140px">
            <el-input
              v-model="addValue.name"
              placeholder="请输入月台性质"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="上限数量/每个小时"
            prop="appointmentTotal"
            label-width="140px"
            v-if="addValue.level == 2"
          >
            <el-input
              v-model="addValue.appointmentTotal"
              placeholder="请输入月台性质"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="addValue.level == 2"
            label="说明"
            prop="desc"
            label-width="140px"
          >
            <el-input
              type="textarea"
              :rows="3"
              :maxlength="200"
              v-model="addValue.desc"
              placeholder="请输入200字以内说明"
            ></el-input>
          </el-form-item>
        </div>
        <el-row type="flex" justify="end" align="middle">
          <el-button @click="showEdit = false" plain>取消</el-button>
          <el-button type="primary" @click="submitForm('editForm')"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, deleteItem, update } from "@/api/my-api/platformNature";
import { parseTime } from "@/utils/ruoyi";
export default {
  data () {
    return {
      searchForm: {
        name: undefined,
      },
      rules: {
        name: [{ required: true, message: "请输入月台性质", trigger: "blur" }],
        pid: [{ required: true, message: "请选择上级类目", trigger: "blur" }],
        appointmentTotal: [
          {
            required: true,
            message: "请选择输入每小时上限数量",
            trigger: "blur",
          },
          {
            pattern: /^\d{1,5}$/,
            message: "请输入5位数的数字",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      showEdit: false,
      addValue: {
        pid: 0,
        name: undefined,
        desc: undefined,
        appointmentTotal: undefined,
        level: 1,
      },
      pidList: [], //上级类目
    };
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      this.loading = true;
      const { searchForm, pageNum, pageSize } = this;
      const params = {
        ...searchForm,
        pageNum,
        pageSize,
      };
      list(params).then((res) => {
        console.log(res);
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
    // 新增
    setDetail () {
      add(this.addValue).then((res) => {
        this.getList();
        this.showDetail = false;
      });
    },
    // 编辑
    editItem () {
      update(this.addValue).then((res) => {
        this.getList();
        this.showEdit = false;
      });
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (formName) {
            case "searchForm":
              this.getList();
              break;
            case "detailForm":
              this.setDetail();
              break;
            case "editForm":
              this.editItem();
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
    getDetail (item, type) {
      const { id, name, level, desc, pid, appointmentTotal } = item;
      if (type == 1) {
        this.pidList = [{ pid: id, name }];
        this.addValue = {
          pid: id,
          level: 2,
          name: undefined,
          desc: undefined,
          appointmentTotal: undefined,
        };
        this.showDetail = true;
      } else if (type == 2) {
        this.pidList = this.tableData.map((v) => {
          return { pid: parseInt(v.id), name: v.name };
        });
        this.addValue = {
          id,
          pid: level == 1 ? 0 : parseInt(pid),
          level,
          name,
          desc,
          appointmentTotal,
        };
        this.showEdit = true;
      }
    },
    //删除
    deleteItem (id) {
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
    // 关闭
    onClose () {
      this.addValue = {
        pid: 0,
        name: undefined,
        desc: undefined,
        level: 1,
      };
      this.pidList = [];
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
</style>
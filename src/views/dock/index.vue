<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchForm">
      <el-form-item label="月台名称：" prop="dockName">
        <el-input
          v-model="searchForm.dockName"
          placeholder="请输入月台名称"
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
        @click="(showDetail = true), (title = '新增月台')"
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
        prop="dockTypeName"
        label="月台性质"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dockName"
        label="月台名称"
        width="210"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dockArea"
        label="面积（m2）"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="devCameraName"
        label="设备"
        width="180"
        align="center"
      ></el-table-column>
      <!-- <el-table-column prop="status" label="实时状态" align="center">
        <template slot-scope="scope">
          <span>{{
            { 1: "空闲", 2: "占用", 3: "暂不可用" }[scope.row.status]
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" label="月台状态" align="center">
        <template slot-scope="scope">
          <span>{{
            { 1: "开启", 2: "占用", 3: "锁定" }[scope.row.status]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dockDesc"
        label="说明"
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="date"
        label="操作"
        align="center"
        width="180"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="getDetail(scope.row.id)"
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
    <!-- 新增月台 -->
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
          <el-form-item label="月台性质" prop="dockType" label-width="80px">
            <treeselect
              v-model="addValue.dockType"
              :multiple="false"
              :options="options"
              :normalizer="normalizer"
              :flat="true"
              :show-count="true"
              placeholder="请选择月台性质"
              style="width: 185px"
              noChildrenText=""
            />
          </el-form-item>
          <el-form-item label="月台名称" prop="dockName" label-width="80px">
            <el-input
              v-model="addValue.dockName"
              placeholder="请输入月台名称"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="月台面积" prop="dockArea" label-width="80px">
            <el-input
              v-model="addValue.dockArea"
              placeholder="请输入月台面积"
              :maxlength="max"
              @input="setMax"
            ></el-input>
          </el-form-item>
          <el-form-item label="月台状态" prop="status" label-width="80px">
            <el-select
              v-model="addValue.status"
              placeholder="请选择月台状态"
              style="width: 185px"
            >
              <el-option label="启用" :value="1"></el-option>
              <!-- <el-option label="占用" :value="2"></el-option> -->
              <el-option label="锁定" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="设备" prop="devCameraCode" label-width="80px">
            <el-select
              v-model="addValue.devCameraCode"
              placeholder="请选择设备"
              style="width: 185px"
            >
              <el-option
                v-for="item in devCamera"
                :key="item.devCameraCode"
                :value="item.devCameraCode"
                :label="item.devCameraName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="备选设备"
            prop="devSecondaryCameraCode"
            label-width="80px"
          >
            <el-select
              v-model="addValue.devSecondaryCameraCode"
              placeholder="请选择设备"
              style="width: 185px"
            >
              <el-option
                v-for="item in devSeconddevCamera"
                :key="item.devSecondaryCameraCode"
                :value="item.devSecondaryCameraCode"
                :label="item.devSecondaryCameraName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="提示牌" prop="devPromptCode" label-width="80px">
            <el-select
              v-model="addValue.devPromptCode"
              placeholder="请选择提示牌"
              style="width: 185px"
            >
              <el-option
                v-for="(item, index) in devPrompt"
                :key="index"
                :value="item.devPromptCode"
                :label="item.devPromptName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="关联月台设备"
            prop="platformId"
            label-width="110px"
          >
            <el-select
              v-model="addValue.platformId"
              placeholder="请选择设备"
              style="width: 185px"
            >
              <el-option
                v-for="item in concatDev"
                :key="item.platformId"
                :value="item.platformId"
                :label="item.platformName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="排序" prop="sortValue" label-width="80px">
          <el-input
            v-model="addValue.sortValue"
            placeholder="请输入排序"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="dockDesc" label-width="80px">
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="200"
            v-model="addValue.dockDesc"
            placeholder="请输入200字以内说明"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="end" align="middle">
          <el-button plain @click="showDetail = false">取消</el-button>
          <el-button type="primary" @click="submitForm('detailForm')"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  paging,
  add,
  info,
  update,
  update_status,
  deleteItem,
  mode_code_list,
  camera_list,
  platform_list,
  
} from "@/api/my-api/platform";
import { list } from "@/api/my-api/platformNature";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    var validatePass = (rule, value, callback) => {
      console.log(value);
      let str=value.toString();
      var arr = str.split(".");
      var lenght = 0;
      if (!!arr[1]) {
        lenght = arr[0].length + arr[1].length;
        console.log(lenght);
      } else {
        lenght = arr[0].length;
      }
      console.log(lenght);
      if (lenght > 5) {
        console.log(11111);
        callback(new Error("请输入五位数字"));
      } else {
        callback();
      }
    };
    return {
      searchForm: {
        dockName: undefined,
      },
      rules: {
        dockType: [
          { required: true, message: "请选择月台性质", trigger: "blur" },
        ],
        dockName: [
          { required: true, message: "请输入月台名称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{1,20}$/,
            message: "请输入汉字 数字 字母组合20个字内的名称",
            trigger: "blur",
          },
        ],
        dockArea: [
          { required: true, message: "请输入月台面积", trigger: "blur" },
          {
            pattern: /^\d+$|^\d*\.\d+$/,
            message: "请输入数字和带小数点的数字",
            trigger: "blur",
          },
          { validator: validatePass, trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择月台状态", trigger: "blur" },
        ],
        devCameraCode: [
          { required: true, message: "请选择设备", trigger: "blur" },
        ],
        devPromptCode: [
          { required: true, message: "请选择提示牌", trigger: "blur" },
        ],
        platformId:[
            { required: true, message: "请选择关联月台设备", trigger: "blur" },
        ],
        sortValue: [
            {
                pattern: /^\d+$/,
                message: "请输入正整数",
                trigger: "blur",
            }
        ]
      },
      title: "新增月台",
      tableData: [{}],
      max: undefined,
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [], //表格多选
      showDetail: false,
      addValue: {
        devCameraCode: undefined,
        devCameraExt: undefined,
        devPromptCode: undefined,
        devPromptExt: undefined,
        dockArea: undefined,
        dockDesc: undefined,
        sortValue: undefined,
        dockName: undefined,
        dockType: undefined,
        id: undefined,
        status: undefined,
      },
      //设备
      devCamera: [
        // {
        //   devCameraCode: "2d8be8904aa08a6260f4b7b1872dfe11",
        //   devCameraExt:
        //     '{"indexCode":"2d8be8904aa08a6260f4b7b1872dfe11","name":"摄像机五号"}',
        //   devCameraName: "摄像机五号",
        // },
        // {
        //   devCameraCode: "2d8be81872dfe11904aa08a6260f4b7b",
        //   devCameraExt:
        //     '{"indexCode":"2d8be81872dfe11904aa08a6260f4b7b","name":"摄像机一号"}',
        //   devCameraName: "摄像机一号",
        // },
      ],
      //提示牌
      devPrompt: [
        // {
        //   devPromptCode: "51ef20f2befdb1a6854a88c398179610",
        //   devPromptExt:
        //     '{"indexCode":"51ef20f2befdb1a6854a88c398179610","name":"提示牌五号"}',
        //   devPromptName: "提示牌五号",
        // },
        // {
        //   devPromptCode: "51ef2c3981796100f2befdb1a6854a88",
        //   devPromptExt:
        //     '{"indexCode":"51ef2c3981796100f2befdb1a6854a88","name":"提示牌一号"}',
        //   devPromptName: "提示牌一号",
        // },
      ],
      //备用设备
      devSeconddevCamera: [],
      //关联设备月台
      concatDev: [],
      //月台性质
      options: [],
      normalizer(node) {
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
    };
  },
  created() {
    list({ name: "" }).then((res) => {
      this.options = res.rows;
    });
    mode_code_list().then(res=>{
        console.log(res.rows);
        let data=res.rows;
        console.log(data);
        let array1=[];
         for(let i in data){
            console.log(data[i]);
            let obj1 = {};
           obj1.devPromptCode = data[i].index_code;
            obj1.devPromptExt = data[i];
            obj1.devPromptName = data[i].screen_name;
            array1.push(obj1);;
        }
        this.devPrompt=[...array1];
        
    })
    camera_list({
        condition:{},
        pageNum: 1,
        pageSize: 10,
        sorting: {},
    }).then(res=>{
        console.log(res.rows);
        let data=res.rows;
        let array1 = [];
        let array2 = [];
        for(let i in data){
            let obj1 = {};
            let obj2 = {};
            obj2.devSecondaryCameraCode = data[i].indexCode;
            obj2.devSecondaryCameraExt =data[i];
            obj2.devSecondaryCameraName =data[i].name ;
            array2.push(obj2);
            obj1.devCameraCode = data[i].indexCode;
            obj1.devCameraExt = data[i];
            obj1.devCameraName = data[i].name;
            array1.push(obj1);
        }
        this.devSeconddevCamera=[...array2];
        this.devCamera=[...array1];

    })
    platform_list().then((res)=>{
        console.log(res);
        let data=res.rows;
        let arr=[];
        for(let i in data){
            let obj={};
            obj.platformId=data[i].platformId;
            obj.platformName=data[i].platformName;
            obj.platformExt=data[i];
            arr.push(obj);
        }
        this.concatDev=[...arr];
    })
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
        //   let data = res.rows;
        //   let array1 = [];
        //   let array2 = [];
        //   let array3 = [];
        //   for (let i in data) {
        //     let obj1 = {};
        //     let obj2 = {};
        //     let obj3 = {};
        //     obj1.devPromptCode = data[i].devPromptCode;
        //     obj1.devPromptExt = data[i].devPromptExt;
        //     obj1.devPromptName = data[i].devPromptName;
        //     array1.push(obj1);
        //     obj2.devCameraCode = data[i].devCameraCode;
        //     obj2.devCameraExt = data[i].devCameraExt;
        //     obj2.devCameraName = data[i].devCameraName;
        //     array2.push(obj2);
        //     obj2.devSecondaryCameraCode = data[i].devSecondaryCameraCode;
        //     obj2.devSecondaryCameraExt = data[i].devSecondaryCameraExt;
        //     obj2.devSecondaryCameraName = data[i].devSecondaryCameraName;
        //   }
        //   console.log(array2);
        //   console.log(array1);
        //   this.devCamera = [...new Set(array2)];
        //   this.devPrompt = [...new Set(array1)];
        //   this.devSeconddevCamera = [...new Set(array3)];
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
      const devCameraExt = this.devCamera.find((v) => {
        return v.devCameraCode == this.addValue.devCameraCode;
      }).devCameraExt;
      console.log(devCameraExt);
      const devPromptExt = this.devPrompt.find((v) => {
        return v.devPromptCode == this.addValue.devPromptCode;
      }).devPromptExt;
       var  devSecondaryCameraExt=undefined
     if(this.addValue.devSecondaryCameraCode){
         devSecondaryCameraExt = this.devSeconddevCamera.find((v) => {
        return v.devSecondaryCameraCode == this.addValue.devSecondaryCameraCode;
      }).devSecondaryCameraExt;
       }
         const platformExt = this.concatDev.find((v) => {
        return v.platformId == this.addValue.platformId;
      }).platformExt;

          const devCameraName = this.devCamera.find((v) => {
        return v.devCameraCode == this.addValue.devCameraCode;
      }).devCameraName;
      const devPromptName = this.devPrompt.find((v) => {
        return v.devPromptCode == this.addValue.devPromptCode;
      }).devPromptName;
       var  devSecondaryCameraName=undefined
     if(this.addValue.devSecondaryCameraCode){
         devSecondaryCameraName = this.devSeconddevCamera.find((v) => {
        return v.devSecondaryCameraCode == this.addValue.devSecondaryCameraCode;
      }).devSecondaryCameraName;
       }
         const platformName = this.concatDev.find((v) => {
        return v.platformId == this.addValue.platformId;
      }).platformName;

      let area = this.addValue.dockArea;
      this.addValue.dockArea = Number(area);
      let params = {
        ...this.addValue,
        devCameraExt:JSON.stringify(devCameraExt),
        devPromptExt:JSON.stringify(devPromptExt),
        devSecondaryCameraExt:JSON.stringify(devSecondaryCameraExt),
        platformExt:JSON.stringify(platformExt),
        platformName,
        devPromptName,
        devCameraName,
        devSecondaryCameraName

      };
      console.log(params);
      if (this.addValue.id) {
        update_status({
          id: this.addValue.id,
          status: this.addValue.status,
        }).then((res) => {
          console.log(res);
        });
      }
      myFunction(params).then((res) => {
        this.getList();
        this.showDetail = false;
         this.$message({
            type: "success",
            message: res.msg,
          })
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
    setMax(val) {
      console.log(Number(val));
      console.log(typeof val);
      let index = val.indexOf(".");
      if (index == -1) {
        this.max = 5;
      } else {
        this.max = 6;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看详情
    getDetail(id) {
      info({ id }).then((res) => {
        this.addValue = res.data;
        this.title = "编辑月台";
        this.showDetail = true;
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
</style>
<template>
  <div>
    <el-form ref="form" :model="form" label-width="160px">
      <el-form-item
        label="预约过期设置:"
        prop="rezExpiredOffsetTime"
        :rules="[
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' },
          { required: true, message: '请输入预约过期设置', trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.rezExpiredOffsetTime" style="width: 460px">
          <template slot="prepend">预约时段 + </template>
          <template slot="append">分钟未签到</template>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="自动审批通过条件:" prop="key">
      <el-checkbox-group v-model="form.key">
        <el-checkbox
          v-for="item in checkboxList"
          :key="item.key"
          :label="item.key"
          name="type"
          >{{ dealName(item.desc) }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item> -->
      <!-- <el-form-item
      label
      prop="reason"
      v-if="rezTypeFlag"
      :rules="[{ required: true, message: '请选择入场事由', trigger: 'blur' }]"
    >
      <el-radio-group v-model="form.reason">
        <el-radio label="1">冷冻</el-radio>
        <el-radio label="2">冷藏</el-radio>
        <el-radio label="3">交空盘</el-radio>
        <el-radio label="4">仓库（送原料包材/提半成品）</el-radio>
      </el-radio-group>
    </el-form-item> -->
      <el-form-item
        label="预约日期范围:"
        prop="rezSubmitDateOffsetRangeDay"
        :rules="[
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' },
          { required: true, message: '请输入预约日期范围', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.rezSubmitDateOffsetRangeDay"
          style="width: 200px"
        >
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="时段设置:">
        <el-table :data="form.tableData" border style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="名称："
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.name"
                placeholder="请输入名称"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="时段" width="400" align="center">
            <template slot-scope="scope">
              <div class="time">
                <el-time-select
                  placeholder="起始时间"
                  v-model="scope.row.startTime"
                  value-format="HH:mm:ss"
                  format="HH:mm:ss"
                  :picker-options="{
                    start: '00:00:00',
                    step: '01:00:00',
                    end: '23:00:00',
                  }"
                >
                </el-time-select>
                <span>至</span>
                <el-time-select
                  placeholder="结束时间"
                  v-model="scope.row.endTime"
                  :picker-options="{
                    start: '00:59:59',
                    step: '01:00:00',
                    end: '23:59:59',
                    minTime: scope.row.startTime,
                  }"
                >
                </el-time-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="是否启用"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.status"
                @change="handleCheckChange(scope.row)"
                :true-label="1"
                :false-label="0"
                :disabled="
                  scope.row.name == form.tableData[0].name ? true : false
                "
                >启用</el-checkbox
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="appointmentTotal"
            label="预约号数"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="detail(scope.row)">
                查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <div class="icon">
          <el-button
            type="success"
            icon="el-icon-plus"
            circle
            @click="addItem()"
          ></el-button>
          <el-button
            :type="form.tableData.length > 1 ? 'danger' : 'info'"
            icon="el-icon-minus"
            circle
            :disabled="form.tableData.length > 1 ? false : true"
            @click="delItem()"
          ></el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="resetForm('form')">重置</el-button> -->
        <el-button type="primary" @click="submitForm('form')"
          >保存确定</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog title="查看详情" :visible.sync="showDetail" width="820px">
      <el-table
        :data="tableData"
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
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="appointmentTotal"
          label="预约号数限制"
          align="center"
        ></el-table-column>
      </el-table>
      <el-row type="flex" justify="end" align="middle" style="margin-top: 20px">
        <el-button type="primary" @click="showDetail = false">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  configCancel,
  configUpdate,
  dictionaries,
  dock_type_list,
} from "@/api/order/delivery_note";
export default {
  data() {
    return {
      form: {
        rezExpiredOffsetTime: undefined,
        rezSubmitDateOffsetRangeDay: undefined,
        tableData: [],
      },
      checkboxList: [],
      list: [],
      checked: {
        0: false,
        1: true,
      },
      showDetail: false,
      tableData: [],
      flag: false,
    };
  },
  created() {
    this.getList();
    console.log(this.form);
  },
  mounted() {},
  // computed: {
  //   rezTypeFlag() {
  //     const index = this.form.key.findIndex((v) => {
  //       return v == "rezTypeFlag";
  //     });
  //     if (index > -1) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   },
  // },
  methods: {
    getList() {
      dictionaries().then((res) => {
        let data = res.data;
        if (data.rezSubmitDateOffsetRangeDay == undefined) {
          data.rezSubmitDateOffsetRangeDay = 7;
        }
        let alldata = Object.assign(this.form, data);
        this.form = alldata;
      });
      configCancel().then((res) => {
        this.form.tableData = res.data;
        // const index = list.findIndex((v) => {
        //   return v.key == "rezEndOffsetTime";
        // });
        // let keyList = [];
        // list.forEach((v) => {
        //   if (v.value == 1) {
        //     keyList.push(v.key);
        //   }
        //   if (v.key == "rezTypeFlag" && v.value != "0") {
        //     keyList.push(v.key);
        //     this.form.reason = v.value;
        //   }
        // });
        // this.form.key = keyList;

        // if (index > -1) {
        //   this.form.rezEndOffsetTime = list[index].value;
        // }
        // let checkboxList = JSON.parse(JSON.stringify(list));
        // checkboxList.splice(index, 1);
        // this.checkboxList = checkboxList;
        // this.list = list;
      });
    },
    handleCheckChange(row) {
      console.log(row);
      if (row.status == "1") {
        if (!!row.id) {
          let newarr = this.form.tableData.filter((item) => row.id != item.id);
          newarr.some((item, index) => {
            if (
              (row.startTime.split(":")[0] >= item.startTime.split(":")[0] &&
                row.startTime.split(":")[0] < item.endTime.split(":")[0]) ||
              (row.endTime.split(":")[0] > item.startTime.split(":")[0] &&
                row.endTime.split(":")[0] <= item.endTime.split(":")[0]) ||
              (row.startTime.split(":")[0] < item.startTime.split(":")[0] &&
                row.endTime.split(":")[0] > item.endTime.split(":")[0]) ||
              (row.startTime.split(":")[0] < item.startTime.split(":")[0] &&
                row.endTime.split(":")[0] > item.startTime.split(":")[0])
            ) {
              this.flag = true;
              console.log(row.startTime.split(":")[0]);
              console.log(item.startTime.split(":")[0]);

              console.log(1);
              return true;
            } else {
              this.flag = false;
              console.log(2);
              console.log(row.startTime.split(":")[0]);
              console.log(item.startTime.split(":")[0]);
            }
          });
        } else {
          console.log("没有id");
          let newarr = this.form.tableData.filter((item) => !!item.id);
          console.log(newarr);
          newarr.some((item) => {
            if (
              (row.startTime.split(":")[0] >= item.startTime.split(":")[0] &&
                row.startTime.split(":")[0] < item.endTime.split(":")[0]) ||
              (row.endTime.split(":")[0] > item.startTime.split(":")[0] &&
                row.endTime.split(":")[0] <= item.endTime.split(":")[0]) ||
              (row.startTime.split(":")[0] < item.startTime.split(":")[0] &&
                row.endTime.split(":")[0] > item.endTime.split(":")[0]) ||
              (row.startTime.split(":")[0] < item.startTime.split(":")[0] &&
                row.endTime.split(":")[0] > item.startTime.split(":")[0])
            ) {
              this.flag = true;
              console.log(row.startTime.split(":")[0]);
              console.log(1);
              return true;
            } else {
              this.flag = false;
              console.log(2);
              console.log(row.startTime.split(":")[0]);
            }
          });
        }
        console.log(this.flag);
        if (this.flag) {
          this.msgError("时段重叠了");
          row.status = 0;
        }
      }
      //-----------------------------------------------
      // if (row.status == "1") {
      //   console.log(this.form.tableData);
      //   if (!!row.id) {
      //     console.log("有id");
      //     let newarr = this.form.tableData.filter((item) => row.id != item.id);

      //     console.log(newarr);
      //     newarr.forEach((item) => {
      //       if (
      //         row.startTime.split(":")[0] < item.startTime.split(":")[0] ||
      //         row.endTime.split(":")[0] < item.endTime.split(":")[0]
      //       ) {
      //         console.log(
      //           row.startTime.split(":")[0] < item.startTime.split(":")[0]
      //         );
      //         this.msgError("时段重叠了");
      //         row.status = 0;
      //       }
      //     });
      //   } else {
      //     console.log("没");
      //     console.log(this.form.tableData);
      //     let newarr = this.form.tableData.filter((item) => !!item.id);
      //     console.log(newarr);

      //     newarr.forEach((item) => {
      //       if (!!row.startTime && !!row.endTime) {
      //         if (
      //           row.startTime.split(":")[0] < item.startTime.split(":")[0] ||
      //           row.endTime.split(":")[0] < item.endTime.split(":")[0] ||
      //           row.startTime.split(":")[0] < item.endTime.split(":")[0]
      //         ) {
      //           this.msgError("时段重叠了");
      //           row.status = 0;
      //         }
      //       }
      //       // else {
      //       //   console.log("请选择时间");
      //       //   alert("请选择时间");
      //       //   return;
      //       // }
      //     });
      //   }
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = [];
          console.log(this.form.tableData);
          let data = this.form.tableData;
          for (let i in data) {
            data[i].startTime = this.timeType(data[i].startTime + ':00');
            data[i].endTime = this.timeType(data[i].endTime + ':59');
          }
          console.log(data);

          // this.list.forEach((v) => {
          //   let value = "";
          //   if (v.key == "rezEndOffsetTime") {
          //     value = this.form.rezEndOffsetTime;
          //   } else {
          //     const index = this.form.key.findIndex((x) => {
          //       return x == v.key;
          //     });
          //     if (index > -1) {
          //       if (v.key == "rezTypeFlag") {
          //         value = this.form.reason;
          //       } else {
          //         value = "1";
          //       }
          //     } else {
          //       value = "0";
          //     }
          //   }
          //   let obj = {
          //     key: v.key,
          //     type: v.type,
          //     value: value,
          //   };
          //   params.push(obj);
          // });
          // let form = this.form;
          // let rezConfigModelList = [];
          // let obj = {};
          // for (let key in form) {
          //   obj["key"] = key;
          //   obj["value"] = form[key];
          //   rezConfigModelList.push(obj);
          // }
          // console.log(rezConfigModelList);
          // console.log(this.tableData);
          configUpdate({
            rezExpiredOffsetTime: this.form.rezExpiredOffsetTime,
            rezPeriodModelList: data,
            rezSubmitDateOffsetRangeDay: this.form.rezSubmitDateOffsetRangeDay,
          }).then((res) => {
            this.msgSuccess(res.msg);
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // dealName(name) {
    //   return name.split("-")[1];
    // },
    addItem() {
      console.log("增加");
      let obj = {
        name: undefined,
        startTime: undefined,
        endTime: undefined,
        status: 0,
      };
      // let itemList = this.tableData[0];
      // for (let key in itemList) {
      //   obj[key] = undefined;
      //   if (key == "status") {
      //     obj[key] = 0;
      //   }
      // }

      this.form.tableData.push(obj);
    },
    //删除
    delItem() {
      this.form.tableData.splice(this.form.tableData.length - 1, 1);
    },
    //查看详情
    detail(row) {
      let parms = {
        endTime: row.endTime,
        startTime: row.startTime,
      };
      console.log(parms);
      this.showDetail = true;
      dock_type_list(parms).then((res) => {
        this.tableData = res.data;
      });
    },
    //时间格式
    timeType(value) {
      var a = value.split(":"); // split it at the colons
      var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      console.log(seconds);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor((seconds % 360) % 60);
      var hh = h < 10 ? "0" + h : h;
      var mm = m < 10 ? "0" + m : m;
      var ss = s < 10 ? "0" + s : s;
      return hh + ":" + mm + ":" + ss;
    },
  },
};
</script>

<style>
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  width: 40px;
  height: 40px;
  background-color: red;
  text-align: center;
  line-height: 46px;
  border-radius: 50%;
  color: #fff;
}
.box1 {
  background-color: #00db00;
  margin-right: 30px;
}
.box2 {
  background-color: #e0e0e0;
}
.del {
  background-color: #ea0000;
}
.time {
  display: flex;
}
</style>
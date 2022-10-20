<template>
  <div>
    <el-form ref="form" :model="form" label-width="160px">
      <el-form-item
        label="设备报警时长:"
        prop="deliveryNoteLedDeviceStayTime"
        :rules="[
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' },
          { required: true, message: '请输入设备报警时长', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.deliveryNoteLedDeviceStayTime"
          style="width: 260px"
        >
          <template slot="append">秒</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="设备报警次数:"
        prop="deliveryNoteLedDeviceCircleTimes"
        :rules="[
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' },
          { required: true, message: '请输入设备报警次数', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.deliveryNoteLedDeviceCircleTimes"
          style="width: 260px"
        >
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="resetForm('form')">重置</el-button> -->
        <el-button type="primary" @click="submitForm('form')"
          >保存确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dictionaries } from "@/api/order/delivery_note";
import { updateAlarm } from "@/api/system/alarmsetting";
export default {
  data() {
    return {
      form: {
        deliveryNoteLedDeviceStayTime: undefined,
        deliveryNoteLedDeviceCircleTimes: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      dictionaries().then((res) => {
        this.form.deliveryNoteLedDeviceStayTime =
          res.data.deliveryNoteLedDeviceStayTime;
        this.form.deliveryNoteLedDeviceCircleTimes =
          res.data.deliveryNoteLedDeviceCircleTimes;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = this.form;
          let array = [];
          for (let key in data) {
            let obj = {};
            obj.key = key;
            obj.value = data[key];
            array.push(obj);
          }
          console.log(array);
          updateAlarm({
            deliveryNoteRezConfigModelList: array,
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
  },
};
</script>

<style>
</style>
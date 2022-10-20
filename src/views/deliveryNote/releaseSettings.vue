<template>
  <div>
    <el-form :model="formInline" class="demo-form-inline">
      <el-form-item label="放行方式">
        <el-checkbox
          v-model="formInline.deliveryNoteReleaseType"
          :true-label="1"
          :false-label="2"
          >自动放行
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dictionaries, releaseUpdate } from "@/api/order/delivery_note";
export default {
  data() {
    return {
      formInline: {
        deliveryNoteReleaseType: undefined,
      },
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    getlist() {
      dictionaries().then((res) => {
        this.$nextTick(() => {
          this.formInline.deliveryNoteReleaseType = JSON.parse(
            res.data.deliveryNoteReleaseType
          );
          console.log(this.formInline);
        });
      });
    },
    submitForm() {
      let data = this.formInline;
      let obj = {};
      for (let key in data) {
        obj.key = key;
        obj.value = data[key];
      }
      releaseUpdate(obj).then((res) => {
        if ((res.code = 200)) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getlist();
        }
      });
    },
  },
};
</script>

<style>
</style>
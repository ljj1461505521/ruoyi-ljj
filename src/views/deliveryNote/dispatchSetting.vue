<template>
  <div>
    <el-form :model="formInline" class="demo-form-inline">
      <el-form-item
        label="入厂门口到月台时长:"
        prop="deliveryNoteDispatchEffectiveTime"
        :rules="[{ pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }]"
      >
        <el-input
          v-model="formInline.deliveryNoteDispatchEffectiveTime"
          style="width: 460px"
        >
          <template slot="prepend">调度时间 + </template>
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dictionaries, dispatchUpdate } from "@/api/order/delivery_note";
export default {
  data() {
    return {
      formInline: {
        deliveryNoteDispatchEffectiveTime: undefined,
      },
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    getlist() {
      dictionaries().then((res) => {
        this.formInline.deliveryNoteDispatchEffectiveTime =
          res.data.deliveryNoteDispatchEffectiveTime;
        console.log(this.formInline);
      });
    },
    submitForm() {
      let data = this.formInline;
      let obj = {};
      for (let key in data) {
        obj.key = key;
        obj.value = data[key];
      }
      dispatchUpdate(obj).then((res) => {
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
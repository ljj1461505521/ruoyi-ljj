<template>
  <div class="all">
    <div class="content" v-if="flag == 1">
      <div class="title">找回密码</div>
      <div class="tip">验证码将会发送至你绑定的邮箱</div>
      <el-form ref="form" :model="form" class="form" :rules="rules">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="send" class="btn">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content" v-if="flag == 2">
      <div class="title">找回密码</div>
      <div class="tip">验证码已发送至你绑定的邮箱</div>
      <el-form ref="form" :model="form" class="form" :rules="rules">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="display: flex; justify-content: space-between">
            <el-input
              v-model="form.num"
              placeholder="请输入6位数验证码"
              maxlength="6"
              class="num"
            ></el-input>
            <el-button type="text" v-if="!!time" disabled
              >{{ time }}后可重新发</el-button
            >
            <el-button type="text" v-else-if="time == 0" @click="againGet"
              >重新获取验证码</el-button
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inputPassword" class="btn"
            >下一步</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="content" v-if="flag == 3">
      <div class="title">设置新密码</div>
      <div class="tip">新密码应不少于六位</div>
      <el-form ref="form" :model="form" class="form">
        <el-form-item>
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            v-model="form.surePassword"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="success" class="btn"
            >重置密码</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  query_user,
  send_code,
  check_code,
  resetPwdAndEmailCodeCheck,
} from "@/api/resetPassword";
import dataVue from "./system/dict/data.vue";
export default {
  data() {
    return {
      form: {},
      flag: 1,
      time: 60,
      test1: undefined,
      test2: undefined,
      rules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
    };
  },
  methods: {
    send() {
      if (!this.form.email) {
        return this.$message({
          showClose: true,
          message: "请输入邮箱",
          type: "error",
        });
      }
      console.log(this.form.email);
      query_user({ email: this.form.email }).then((res) => {
        if (res.code == 200) {
          console.log(this.form);
          let params = {
            email: this.form.email,
            sendSource: "2",
            useType: "2",
          };
          send_code(params).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.flag = 2;
              this.test2 = setInterval(() => {
                this.time--;
                console.log(this.time);
                if (this.time == 0) {
                  clearInterval(this.test2);
                }
                if (this.flag != 2) {
                  clearInterval(this.test2);
                }
              }, 1000);
            }
          });
        }
      });
    },
    inputPassword() {
      if (!this.form.num) {
        return this.$message({
          showClose: true,
          message: "请输入验证码",
          type: "error",
        });
      }
      if (!this.form.email) {
        return this.$message({
          showClose: true,
          message: "请输入邮箱",
          type: "error",
        });
      }
      let params = {
        cleanCodeType: "3",
        code: this.form.num,
        email: this.form.email,
        sendSource: "2",
        useType: "2",
      };
      check_code(params).then((res) => {
        console.log(res);
        if ((res.code = 200)) {
          this.flag = 3;
        }
      });
    },
    againGet() {
      if (!this.form.email) {
        return this.$message({
          showClose: true,
          message: "请输入邮箱",
          type: "error",
        });
      }
      let params = {
        email: this.form.email,
        sendSource: 2,
        useType: "2",
      };
      send_code(params).then((res) => {
        if (res.code == 200) {
          this.time = 60;
          this.test1 = setInterval(() => {
            this.time--;
            console.log(this.time);
            if (this.time == 0) {
              clearInterval(this.test1);
            }
            if (this.flag != 2) {
              clearInterval(this.test1);
            }
          }, 1000);
        }
      });
    },
    success() {
      if (this.form.password != this.form.surePassword) {
        return this.$message({
          showClose: true,
          message: "密码不一致",
          type: "error",
        });
      } else if (this.form.password.length < 6) {
        return this.$message({
          showClose: true,
          message: "密码应不少于6位",
          type: "error",
        });
      }
      let params = {
        code: this.form.num,
        email: this.form.email,
        password: this.form.password,
        sendSource: "2",
        useType: "2",
      };
      resetPwdAndEmailCodeCheck(params)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            console.log("重置成功");
            this.$router.push({
              path: "/login",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {},
  destroyed() {
    clearInterval(this.test1);
    clearInterval(this.test2);
  },
};
</script>

<style>
.num {
  width: 200px;
}
.all {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}
.content {
  width: 320px;
}
.content .btn {
  width: 100%;
}
.content .title {
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  color: #000;
  margin: 0;
}
.content .tip {
  font-size: 15px;
  color: #8590a6;
  margin: 10px 0;
}
.form {
  width: 100%;
  margin-top: 40px;
}
</style>
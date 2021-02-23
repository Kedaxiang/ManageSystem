<template>
  <div class="login">
    <div class="wrapper">
      <p class="title">Elearning后台管理系统</p>

      <div class="contain">
        <div class="box"><img src="../assets/images/favicon.png" /></div>

        <el-form
          class="form"
          :rules="rules"
          :model="loginForm"
          ref="loginForm"
          @submit.native.prevent="submitForm"
        >
          <el-form-item prop="account">
            <el-input
              placeholder="账号"
              v-model="loginForm.account"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="密码"
              v-model="loginForm.password"
              type="password"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="login-button" native-type="submit"
              >登陆</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/index";

export default {
  data() {
    return {
      loginForm: {
        account: "admin",
        password: "123456",
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(async (valid) => {
        // element-ui 提供的表单预验证
        if (valid) {
          let { data: res } = await login(this.loginForm);
          if (res.success) {
            this.$message.success("登陆成功");
            this.$router.push("/course/manage");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: rgb(50, 60, 84);
  position: relative;
}

.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);

  .title {
    color: #eee;
    text-align: center;
    font-size: 34px;
    margin-bottom: 120px;
  }
}

.contain {
  width: 450px;
  height: 300px;
  background: #fff;
  position: relative;
  border-radius: 20px;

  .box {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    padding: 8px;
    border: 1px solid #fff;
    box-shadow: 0 0 8px #fff;
    background: #fff;
    z-index: 99;

    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background: #fff;
    }
  }

  .form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;

    .login-button {
      width: 100%;
    }
  }
}
</style>

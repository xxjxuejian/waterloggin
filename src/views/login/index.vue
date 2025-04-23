<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { LoginFormData } from "@/api/auth.api.ts";

// 查询表单，叫做queryParams , reactive

// 登录表单，提交表单，叫做loginForm/formData/   reactive
const loginFormRef = ref<FormInstance>();
const loginForm = ref<LoginFormData>({
  username: "",
  password: "",
  rememberMe: false,
});

// 密码校验规则
const checkPwd = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入密码"));
  }
  if (value.length < 6 || value.length > 20) {
    return callback(new Error("密码长度应为 6 到 20 位"));
  }
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
  if (!reg.test(value)) {
    return callback(new Error("密码需包含字母和数字"));
  }
  callback(); // 校验通过
};

// 表单验证规则,使用reactive
const loginFormRules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ validator: checkPwd, trigger: "blur" }],
});

const handleLoginSubmit = async () => {
  try {
    const valid = await loginFormRef.value?.validate();
    if (!valid) return;
    loading.value = true;

    // 执行登录操作

    // 获取用户信息

    // 跳转 到之前的地址
    console.log("login", loginForm.value);
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    loading.value = false;
  }
};

// 加载状态
const loading = ref(false);
const year = new Date().getFullYear();
</script>

<template>
  <div class="wh-full login flex-center relative">
    <!-- 定位 -->
    <div class="login-header text-white absolute top-0 right-0">login-header</div>

    <div class="login-form">
      <!-- title -->
      <div
        class="absolute top-[42px] left-1/2 -translate-x-1/2 font-bold text-[22px] textGradient-login"
      >
        系统登录
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="h-full flex flex-col justify-between"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 记住我/忘记密码 -->
        <div class="flex-x-between w-full">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <!-- <el-link type="primary" @click="unfinished">忘记密码</el-link> -->
        </div>

        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="btnGradient-login"
          @click="handleLoginSubmit"
        >
          登录
        </el-button>
      </el-form>
    </div>

    <!-- 定位 -->
    <div class="w-full text-white text-size-sm absolute bottom-[30px] flex-center gap-12">
      <span>© {{ year }}版权所有</span>
      <span>技术支持：中科数遥（杭州）科技有限公司</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  background-image: url("@/assets/images/login_bg2.png");
  background-position: center center;
  background-size: 100% 100%;

  .login-form {
    position: relative;
    width: 560px;
    height: 430px;
    padding: 130px 50px 50px 50px;
    background-image: url("@/assets/images/loginBox.png");
    background-size: 100% 100%;

    :deep(.el-form) {
      .el-form-item {
        .el-input {
          --el-input-inner-height: 52px;
          .el-input__wrapper {
            color: #fff;
            background-color: #324863;
            box-shadow: none;

            &.is-foucus,
            &:hover {
              box-shadow: none;
            }

            .el-input__inner {
              margin-left: 10px;
              font-size: 18px;
              color: #fff;
            }
          }
        }
      }
    }

    .el-button {
      height: 52px;
      font-size: 24px;
      font-weight: bold;
      color: #fefefe;
      letter-spacing: 0.4em;
      border: none;

      &:hover {
        background-image: linear-gradient(
          to bottom,
          rgba(57, 155, 255, 0.9),
          rgba(18, 110, 235, 0.9)
        ) !important;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user.store.ts";

const userStore = useUserStoreHook();
const router = useRouter();

// const route = useRoute();
// 回到首页大屏
const goBigScreen = () => {
  router.push("/");
};

// 跳转个人中心
const handleProfileClick = () => {
  ElMessage.warning("开发中");
};

// 退出登录
const logout = () => {
  ElMessageBox.confirm("确定注销并退出系统吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  })
    .then(async () => {
      await userStore.logout();
      // 清除一些数据
      // 回到登录页,要保存当前页的参数,之后可以在回来
      router.push("/login");
      // router.push(`/login?redirect=${route.fullPath}`);
    })
    .catch(() => {});
};
</script>

<template>
  <div class="navbar">
    <div class="navbar__left bg-red-100">
      <Hamburger />
      <!-- 面包屑导航 -->
      <Breadcrumb />
    </div>
    <div class="navbar__right bg-blue-200">
      <!-- 全屏 -->
      <FullScreen />

      <!-- 语言选择 -->
      <LangSelect />

      <!-- 通知消息 -->

      <!-- 用户头像（个人中心、注销登录等） -->
      <el-dropdown trigger="click" class="h-full">
        <div class="flex items-center justify-center px-3">
          <img class="w-8 h-8 rounded-full" src="@/assets/images/avatar.png" />
          <span class="ml-3">{{ userStore.userInfo.userName }}</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goBigScreen">
              {{ $t("navbar.dashboard") }}
            </el-dropdown-item>
            <el-dropdown-item @click="handleProfileClick">
              {{ $t("navbar.profile") }}
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              {{ $t("navbar.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  // 一个盒子，flex布局，左右两边内容，左边盒子里面还要套盒子，右边盒子里面还要套盒子，最里面的内容垂直居中显示
  // 这时候就不要设置align-items: center;，让内部的盒子高度拉满，最里面的盒子设置align-items: center;，让内容居中
  // align-items: center;
  justify-content: space-between;
  width: 100%;
  height: $navbar-height;
  background-color: cadetblue;

  &__left {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__right {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 0 20px;
  }
}
</style>

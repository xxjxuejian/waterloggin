<script setup lang="ts">
import { usePermissionStoreHook } from "@/store/modules/permission.store.ts";
import router from "@/router";

const permissionStore = usePermissionStoreHook();
const goAdminSystem = () => {
  console.log("teshi", permissionStore.adminEntryRoute);
  router.push(permissionStore.adminEntryRoute);
};
</script>

<template>
  <div class="app-main">
    <!-- 导航栏 -->
    <div class="navbar">
      <el-button type="primary" @click="goAdminSystem">后台管理</el-button>
    </div>

    <!-- 主内容 -->
    <div class="main-content">主内容</div>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  .navbar {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 50px;
    background-color: rgb(175, 203, 226);
  }
  .main-content {
    width: 100%;
    height: 100vh;
    padding-top: 50px;
    background-color: rgb(218, 218, 218);
  }
}
</style>

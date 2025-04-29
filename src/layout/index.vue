<script setup>
import router from "@/router";

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="layout">
    <div class="sidebar">侧边栏</div>

    <div class="main-content">
      <div class="navbar">
        导航栏
        <el-button type="primary" @click="goHome">首页大屏</el-button>
      </div>
      <div class="tagsview">标签栏</div>
      <div class="app-main">
        router-view
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;

  .sidebar {
    width: 200px;
    height: 100%;
    background-color: #4b7de8;
  }

  .main-content {
    display: flex;
    flex: 1;
    flex-direction: column;

    .navbar {
      width: 100%;
      height: 50px;
      background-color: #6b80eb52;
    }

    .tagsview {
      width: 100%;
      height: 30px;
      background-color: #9ce8f6;
    }
    .app-main {
      width: 100%;
      height: 100%;
      background-color: #f0f2f5;
    }
  }
}
</style>

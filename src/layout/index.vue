<script setup>
import Sidebar from "./components/Sidebar/index.vue";
import Navbar from "./components/Navbar/index.vue";
</script>

<template>
  <div class="layout">
    <Sidebar />

    <div class="main-content">
      <Navbar />

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
  height: 100%;

  .main-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;

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

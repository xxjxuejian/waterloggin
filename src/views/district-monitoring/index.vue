<script setup lang="ts">
// @ts-nocheck
import { initViewer } from "./cesium/initViewer.js";
import { Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import Navbar from "./components/Navbar.vue";

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = "/Static/Cesium";
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE";

onMounted(async () => {
  initViewer();
});
</script>

<template>
  <div class="app-main">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容 -->
    <div id="cesiumContainer" class="main-content"></div>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100%;

  .main-content {
    width: 100%;
    height: 100vh;
  }
}
</style>

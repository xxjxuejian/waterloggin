<script setup>
import { initViewer } from "../cesium/initViewer.js";
import { Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import Toolbar from "./Toolbar.vue";

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = "/Static/Cesium";
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE";

let viewer = ref(null);
// 一种方式是子组件中发送事件，但是这种情况是为了组件更好的复用再其它页面中，
// 这里的逻辑比较单一，直接用provide/inject 比较合适
provide("cesiumViewer", viewer); // 提供 viewer 实例

onMounted(async () => {
  viewer.value = initViewer();
});
</script>

<template>
  <div id="cesiumContainer" class="main-content">
    <Toolbar></Toolbar>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  position: relative;
  //   display: flow-root;
  width: 100%;
  height: 100vh;
}
</style>

<script setup lang="ts">
// import * as Cesium from "cesium";
import { Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useCesiumStore } from "@/store/modules/cesium.store.ts";
import { useMeasureStore } from "@/store/modules/measure.store.ts";

import Toolbar from "./Toolbar.vue";

const cesiumStore = useCesiumStore();
const measureStore = useMeasureStore();

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = "/Static/Cesium";
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE";

onMounted(() => {
  cesiumStore.initViewer("cesiumContainer");
});
</script>

<template>
  <div
    id="cesiumContainer"
    class="main-content"
    :class="{ 'crosshair-cursor': measureStore.isMeasuring }"
  >
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

.crosshair-cursor {
  cursor: crosshair !important;
}
</style>

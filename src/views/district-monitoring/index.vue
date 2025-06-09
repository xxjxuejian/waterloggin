<script setup lang="ts">
// @ts-nocheck

import Navbar from "./components/Navbar.vue";
import Map from "./components/Map.vue";
</script>

<template>
  <div class="app-main">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容 -->
    <Map />
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

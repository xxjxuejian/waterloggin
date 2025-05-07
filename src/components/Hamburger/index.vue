<script setup lang="ts">
import { useAppStoreHook } from "@/store/modules/app.store.ts";

const appStore = useAppStoreHook();

const isCollapse = computed(() => appStore.isSidebarCollapse);

const toggleSidebar = () => {
  appStore.toggleSidebar();
};
</script>

<template>
  <div class="hamburger-wrapper">
    <!-- 折叠 -->
    <el-icon v-if="!isCollapse" size="20px" @click="toggleSidebar">
      <Fold />
    </el-icon>
    <!-- 展开 -->
    <el-icon v-else size="20px" @click="toggleSidebar">
      <Expand />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.hamburger-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  cursor: pointer;
}
</style>

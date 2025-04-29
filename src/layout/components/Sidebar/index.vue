<script setup lang="ts">
import titleLogo from "@/assets/images/logo.png";
import SidebarMenu from "./components/SidebarMenu/index.vue";
import { useAppStoreHook } from "@/store/modules/app.store.ts";

const appStore = useAppStoreHook();
const systemTitle = computed(() => appStore.systemTitle);
const isCollapse = computed(() => appStore.isSidebarCollapse);
</script>

<template>
  <div class="sidebar" :class="{ collapse: isCollapse }">
    <!-- 系统标题和logo -->
    <div class="title flex justify-center items-center">
      <!-- 侧边栏收缩时才显示图标 -->
      <img
        v-if="appStore.isSidebarCollapse"
        :src="titleLogo"
        alt="logo"
        class="w-[20px] h-[20px]"
        :title="systemTitle"
      />
      <span
        v-if="!isCollapse"
        class="ml-3 text-ellipsis whitespace-nowrap overflow-hidden text-white text-xl"
      >
        {{ systemTitle }}
      </span>
    </div>

    <!-- 菜单 -->
    <!-- <div class="menu"></div> -->
    <el-scrollbar>
      <SidebarMenu></SidebarMenu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: $sidebar-width;
  height: 100%;
  background-color: #001526;
  transition: width 0.3s ease;

  &.collapse {
    width: $sidebar-width-collapsed;
  }

  .title {
    height: $navbar-height;
  }

  //  必须设置高度，内容超出才能出现滚动条
  .el-scrollbar {
    height: calc(100vh - $navbar-height);
  }
}
</style>

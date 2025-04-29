<script setup lang="ts">
import { usePermissionStoreHook } from "@/store/modules/permission.store.ts";
import { useAppStoreHook } from "@/store/modules/app.store.ts";

import SidebarMenuItem from "../SidebarMenuItem/index.vue";

const permissionStore = usePermissionStoreHook();
const appStore = useAppStoreHook();

const routes = computed(() => permissionStore.routes);

// 计算高亮 menu 的方法,默认激活菜单的 index
const route = useRoute();
const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

console.log("routes", routes.value);
</script>

<template>
  <el-menu :collapse="appStore.isSidebarCollapse" :default-active="activeMenu" router>
    <SidebarMenuItem v-for="route in routes" :key="route.path" :route="route"></SidebarMenuItem>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  // 整个侧边栏的背景色
  --el-menu-bg-color: #001529;
  //侧边栏菜单的文本颜色
  --el-menu-text-color: #bfcbd9;
  //   侧边栏的激活菜单的文本颜色
  --el-menu-active-color: #fff;
  // 侧边栏 hover状态时的背景颜色
  --el-menu-hover-bg-color: #1890ff;
}
</style>

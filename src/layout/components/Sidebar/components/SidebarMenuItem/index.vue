<script setup lang="ts">
defineOptions({
  name: "SidebarMenuItem",
  inheritAttrs: false,
});

import SidebarMenuItemTitle from "../SidebarMenuItemTitle/index.vue";

defineProps({
  route: {
    type: Object,
    default: () => {},
  },
});
</script>

<template>
  <template v-if="!route.meta.hidden">
    <template v-if="route.children">
      <el-sub-menu :index="route.path">
        <template #title>
          <SidebarMenuItemTitle :title="route.meta.title"></SidebarMenuItemTitle>
        </template>

        <SidebarMenuItem
          v-for="child in route.children"
          :key="child.path"
          :route="child"
        ></SidebarMenuItem>
      </el-sub-menu>
    </template>

    <template v-else>
      <el-menu-item :index="route.path">
        <SidebarMenuItemTitle :title="route.meta.title"></SidebarMenuItemTitle>
      </el-menu-item>
    </template>
  </template>
</template>

<style lang="scss" scoped></style>

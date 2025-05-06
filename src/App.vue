<script setup lang="ts">
import { useAppStoreHook } from "@/store/modules/app.store.ts";

const appStore = useAppStoreHook();
const locale = computed(() => appStore.locale);
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>

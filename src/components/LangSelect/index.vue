<script setup lang="ts">
import { useAppStoreHook } from "@/store/modules/app.store.ts";
import i18n from "@/lang";

const appStore = useAppStoreHook();
const langOptions = [
  { label: "中文", value: "zh-cn" },
  { label: "English", value: "en" },
];

const handleLanguageChange = (value: string) => {
  appStore.changeLanguage(value);

  ElMessage.success(i18n.global.t("langSelect.message.success"));
};
</script>

<template>
  <div class="flex">
    <el-dropdown trigger="click" @command="handleLanguageChange">
      <SvgIcon iconName="language" size="20px"></SvgIcon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in langOptions"
            :key="item.value"
            :command="item.value"
            :disabled="appStore.language === item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped></style>

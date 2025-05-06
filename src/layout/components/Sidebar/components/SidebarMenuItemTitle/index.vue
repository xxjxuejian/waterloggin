<script setup lang="ts">
// import { translateRouteTitle } from "./utils/i18n";

defineProps({
  isShowIcon: {
    type: Boolean,
    default: true,
  },
  iconName: {
    type: String,
    default: "defaultMenuIcon",
  },
  title: {
    type: String,
    default: "defaultMenuText",
  },
});

// 函数是直接调用的，不会监听变化
// 使用 computed ，监听 props.title 的变化，当变化时，重新计算 translatedTitle
// const translatedTitle = computed(() => translateRouteTitle(props.title));
</script>

<template>
  <SvgIcon v-if="isShowIcon" :icon-name="iconName" color="#fff" size="20px"></SvgIcon>
  <span
    class="ml-2 text-base text-ellipsis whitespace-nowrap overflow-hidden"
    :title="$t(`sidebar.${title}`)"
  >
    <!-- {{ translateRouteTitle(title) }} -->
    <!-- 或者是直接用 $t 来获取 -->
    <span>{{ $t(`sidebar.${title}`) }}</span>
  </span>
</template>

<style lang="scss" scoped></style>

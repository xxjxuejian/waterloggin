<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen();
// isFullscreen是true或者false
</script>

<template>
  <div @click="toggle">
    <SvgIcon v-if="isFullscreen" iconName="fullscreen-exit" size="20px"></SvgIcon>
    <SvgIcon v-else iconName="fullscreen" size="20px"></SvgIcon>
  </div>
</template>

<style lang="scss" scoped></style>

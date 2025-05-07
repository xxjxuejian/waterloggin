<script setup lang="ts"></script>

<template>
  <div class="navbar">
    <div class="navbar__left bg-red-100">
      <Hamburger />
      <!-- 面包屑 -->
      <Breadcrumb />
    </div>
    <div class="navbar__right bg-blue-100">
      <!-- 全屏 -->
      <FullScreen />

      <!-- 语言选择 -->
      <LangSelect />

      <!-- 通知下拉 -->

      <!-- 用户头像（个人中心、注销登录等） -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  // 一个盒子，flex布局，左右两边内容，左边盒子里面还要套盒子，右边盒子里面还要套盒子，最里面的内容垂直居中显示
  // 这时候就不要设置align-items: center;，让内部的盒子高度拉满，最里面的盒子设置align-items: center;，让内容居中
  // align-items: center;
  justify-content: space-between;
  width: 100%;
  height: $navbar-height;
  background-color: cadetblue;

  &__left {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__right {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 0 20px;
  }
}
</style>

<script setup lang="ts">
import type { RouteLocationMatched } from "vue-router";

const breadcrumbs = ref<Array<RouteLocationMatched>>([]);

const currentRoute = useRoute();

// 获取当前路由匹配到的路由信息
function getBreadcrumb() {
  let matched = currentRoute.matched.filter((item) => item.meta && item.meta.title);

  // if (!isDashboard(first)) {
  //   matched = [{ path: "/dashboard", meta: { title: "dashboard" } } as any].concat(matched);
  // }
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
}

// 面包屑点击跳转
// const handleLink = (item: any) => {
//   const { redirect, path } = item;
//   if (redirect) {
//     router.push(redirect).catch((err) => {
//       console.warn(err);
//     });
//     return;
//   }
//   console.log(path);
//   router.push(path).catch((err) => {
//     console.warn(err);
//   });
//   router.push(pathCompile(path)).catch((err) => {
//     console.warn(err);
//   });
// };

// const pathCompile = (path: string) => {
//   const { params } = currentRoute;
//   const toPath = compile(path);
//   return toPath(params);
// };

getBreadcrumb();

// 监听路径变化,修改面包屑
watch(
  () => currentRoute.path,
  (path) => {
    // 这个作用是什么？
    if (path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);
</script>

<template>
  <!-- 面包屑的最后一个是不能点击的，前面的可以点击跳转的 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <!-- index === breadcrumbs.length - 1 是最后一个，不能点击 -->
      <span
        v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1"
        class="color-gray-400"
      >
        {{ $t(`sidebar.${item.meta.title}`) }}
      </span>
      <!-- 不是最后一个，可以点击跳转 -->
      <!-- <a v-else>{{ $t(`sidebar.${item.meta.title}`) }}</a> -->

      <!-- 这个系统是后端没有设置一级路由的redirect,所以点击一级路由不知道要跳转到哪,这里统一不跳转 -->
      <span v-else>{{ $t(`sidebar.${item.meta.title}`) }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
</style>

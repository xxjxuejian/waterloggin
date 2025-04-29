import type { RouteRecordRaw } from "vue-router";

import AuthAPI from "@/api/auth.api.ts";
import { pinia } from "@/store";
const modules = import.meta.glob("@/views/**/**.vue");

import { constantRoutes } from "@/router";

import { patchComponentPath } from "@/utils/patchRoutes";

const Layout = () => import("@/layout/index.vue");

export const usePermissionStore = defineStore("permission", () => {
  // 保存所有地路径，包含静态路由和动态路由
  const routes = ref<RouteRecordRaw[]>([]);
  // 动态路由是否加载完成
  const isRoutesLoaded = ref(false);
  // 后台管理地的入口路由,直接取后台路由的第一条
  const adminEntryRoute = ref("/404");

  function generateRoutes() {
    return new Promise((resolve, reject) => {
      AuthAPI.getRoutes()
        .then((res: any) => {
          //   console.log("getRouters", res.data);
          const patchedRoutes = patchComponentPath(res.data);
          //   console.log("patchedRoutes", patchedRoutes);

          const dynamicRoutes = parseDynamicRoutes(patchedRoutes);
          isRoutesLoaded.value = true;
          adminEntryRoute.value = dynamicRoutes[0]?.children[0]?.path;
          console.log("adminEntryRoute", adminEntryRoute.value);
          // console.log("dynamicRoutes", dynamicRoutes);
          routes.value = [...constantRoutes, ...dynamicRoutes];
          resolve(dynamicRoutes);
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  }

  return {
    routes,
    adminEntryRoute,
    isRoutesLoaded,
    generateRoutes,
  };
});

const parseDynamicRoutes = (rawRoutes: any): RouteRecordRaw[] => {
  const parsedRoutes: RouteRecordRaw[] = [];

  rawRoutes.forEach((route: any) => {
    const normalizedRoute = { ...route } as RouteRecordRaw;

    // 处理组件路径
    normalizedRoute.component =
      normalizedRoute.component?.toString() === "Layout"
        ? Layout
        : modules[`${normalizedRoute.component}`] || modules["/src/views/error/404.vue"];

    // 递归解析子路由
    if (normalizedRoute.children) {
      normalizedRoute.children = parseDynamicRoutes(route.children);
    }

    parsedRoutes.push(normalizedRoute);
  });

  return parsedRoutes;
};

export function usePermissionStoreHook() {
  return usePermissionStore(pinia);
}
